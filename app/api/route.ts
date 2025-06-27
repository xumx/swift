import Groq from "groq-sdk";
import { z } from "zod";
import { zfd } from "zod-form-data";

const groq = new Groq();
const GROQ_MODELS = {
  speech: "whisper-large-v3",
};

const schema = zfd.formData({
  input: z.union([zfd.text(), zfd.file()]),
});

export async function POST(request: Request) {
  let data, success;
  try {
    const formData = await request.formData();
    const parsed = schema.safeParse(formData);
    data = parsed.data;
    success = parsed.success;
  } catch (error) {
    console.error("Error parsing FormData:", error);
    return new Response("Failed to parse request body as FormData.", { status: 400 });
  }

  if (!success) {
    return new Response("Invalid request data", { status: 400 });
  }

  const transcript = await getTranscript(data!.input);
  if (!transcript) {
    return new Response("Invalid audio", { status: 400 });
  }
  console.log("\x1b[32m%s\x1b[0m", transcript); // Sets the color to green

  return new Response(JSON.stringify({ transcript }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function getTranscript(input: string | File) {
  if (typeof input === "string") return input;

  try {

    const [ptTranscription, enTranscription] = await Promise.all([
      groq.audio.transcriptions.create({
        file: input,
        prompt: "Brazilian Portuguese",
        model: GROQ_MODELS.speech,
        language: "pt",
      }),
      groq.audio.transcriptions.create({
        file: input,
        prompt: "meeting discussion about AI and chatbots call center with KeyReply",
        model: GROQ_MODELS.speech,
        language: "en",
      }),
    ]);

    const enText = enTranscription.text.trim();
    const ptText = ptTranscription.text.trim();

    return `${enText}||${ptText}` || null;
  } catch {
    return null; // Empty audio file
  }
}
