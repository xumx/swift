import Groq from "groq-sdk";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { unstable_after as after } from "next/server";
import voices from "@/lib/embedding";
import { FormSchema } from "@/components/form-schema";

const groq = new Groq();

const schema = zfd.formData({
  input: z.union([zfd.text(), zfd.file()]),
  message: zfd.repeatableOfType(
    zfd.json(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
  ),
  formData: zfd.json(z.any({})),
});

async function answerQuestion(transcript: string, messages: any[]) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-70b-versatile",
    messages: [
      {
        role: "system",
        content: `Schema ${FormSchema}\n\nBe short and concise while responding in a friendly tone to the user's question.`,
      },
      ...messages,
      {
        role: "user",
        content: transcript,
      },
    ],
  });

  return completion.choices[0].message.content!
}

async function nextQuestion(transcript: string, messages: any[]) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-70b-versatile",
    messages: [
      {
        role: "system",
        content: `Schema ${FormSchema}\n\n Identify the next question to ask, prompt the user to continue to complete the Home Visit Report form to assess patient living environment. Be short and concise and just ask one question at a time.`,
      },
      ...messages,
      {
        role: "user",
        content: transcript,
      },
    ],
  });

  return completion.choices[0].message.content!
}

export async function POST(request: Request) {
  console.time("transcribe " + (request.headers.get("x-vercel-id") || "local"));

  const { data, success } = schema.safeParse(await request.formData());
  if (!success) return new Response("Invalid request", { status: 400 });

  const transcript = await getTranscript(data.input);
  if (!transcript) return new Response("Invalid audio", { status: 400 });
  console.log("\x1b[32m%s\x1b[0m", transcript); // Sets the color to green

  console.timeEnd(
    "transcribe " + (request.headers.get("x-vercel-id") || "local")
  );
  console.time(
    "text completion " + (request.headers.get("x-vercel-id") || "local")
  );

  let response = "";
  const isQuestion = transcript.trim().includes("?");
  const isWelcome = transcript.trim() == "Hello";
  if (isWelcome) {
    response = "Hi, my name is Lisa, I can guide you to complete your Home Visit Report. You can start by describing the patient profile."
  } else  if (isQuestion) {
    response = await answerQuestion(transcript, data.message);
  } else {
    response = await nextQuestion(transcript, data.message)
  }

  const FormFillingPrompt = `Schema:\n${JSON.stringify(
    FormSchema
  )}\n\nCurrent Data\n${JSON.stringify(
    data.formData
  )}\n\nPlease fill in the form based on the fields provided. Always outputs JSON values in English. Responds in JSON format`;

  let fillForm = "";
  try {
    const formCompletion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      // model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
      stream: false,
      messages: [
        {
          role: "system",
          content: FormFillingPrompt,
        },
        ...data.message,
        {
          role: "user",
          content: transcript,
        },
      ],
    });

    fillForm = formCompletion.choices[0].message.content!;
  } catch (err: any) {
	  const error = err.error.error
	  console.log(error.code)
    if (error.code == "json_validate_failed") {
      try {
		console.warn(error.failed_generation);
		console.warn("Invalid JSON, Attempt Retry");
        const retryCompletion = await groq.chat.completions.create({
          model: "llama-3.1-70b-versatile",
          response_format: { type: "json_object" },
          stream: false,
          messages: [
            {
              role: "system",
              content: FormFillingPrompt,
            },
            ...data.message,
            {
              role: "user",
              content: transcript,
            },
            {
              role: "assistant",
              content:
                `The previous attempt failed with invalid JSON ${error.failed_generation}. Please try again to generate a valid JSON response.`,
            },
          ],
        });
        fillForm = retryCompletion.choices[0].message.content!;
      } catch (retryError) {
        console.error("Retry failed:", (retryError as any).message);
        fillForm = "{}"; // Fallback to empty object if retry also fails
      }
    }
  }

  console.log(fillForm);

  console.timeEnd(
    "text completion " + (request.headers.get("x-vercel-id") || "local")
  );

  console.time(
    "cartesia request " + (request.headers.get("x-vercel-id") || "local")
  );

  const useMultilingual = response?.match(
    /[\u3400-\u9FBF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/
  );

  // remove * from response
  response = response.replace(/\*/g, "");

  const voice = await fetch("https://api.cartesia.ai/tts/bytes", {
    method: "POST",
    headers: {
      "Cartesia-Version": "2024-06-10",
      "Content-Type": "application/json",
      "X-API-Key": process.env.CARTESIA_API_KEY!,
    },
    body: JSON.stringify({
      model_id: useMultilingual ? "sonic-multilingual" : "sonic-english",
      transcript: response,
      voice: {
        mode: "embedding",
        embedding: voices.singapore,
        __experimental_controls: {
          speed: "normal",
          emotion: ["positivity"],
        },
      },
      output_format: {
        container: "raw",
        encoding: "pcm_f32le",
        sample_rate: 24000,
      },
    }),
  });

  console.timeEnd(
    "cartesia request " + (request.headers.get("x-vercel-id") || "local")
  );

  if (!voice.ok) {
    console.error(await voice.text());
    return new Response("Voice synthesis failed", { status: 500 });
  }

  console.time("stream " + (request.headers.get("x-vercel-id") || "local"));
  after(() => {
    console.timeEnd(
      "stream " + (request.headers.get("x-vercel-id") || "local")
    );
  });

  return new Response(voice.body, {
    headers: {
      "X-Transcript": encodeURIComponent(transcript),
      "X-Response": encodeURIComponent(response!),
      "X-Formdata": encodeURIComponent(fillForm!),
    },
  });
}

async function getTranscript(input: string | File) {
  if (typeof input === "string") return input;

  try {
    const { text } = await groq.audio.transcriptions.create({
      file: input,
      prompt: "Singapore Healthcare topics, use British spelling",
      // model: "whisper-large-v3",
      // language: "en",
      model: "distil-whisper-large-v3-en",
      language: "en",
    });

    return text.trim() || null;
  } catch {
    return null; // Empty audio file
  }
}
