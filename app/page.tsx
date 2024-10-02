"use client";

import clsx from "clsx";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { EnterIcon, LoadingIcon } from "@/lib/icons";
import { usePlayer } from "@/lib/usePlayer";
import { track } from "@vercel/analytics";

type Message = {
  role: "user" | "assistant";
  content: string;
  latency?: number;
};

import { MultiStepFormComponent } from "@/components/multi-step-form";
import { sampleData } from "@/lib/sample";
import { AudioRecorderComponent } from "@/components/audio-recorder";
// import Image from "next/image";

export default function Home() {
  const [input, setInput] = useState("");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const inputRef = useRef<HTMLInputElement>(null);
  const player = usePlayer();

  const vad = {}
  // const vad = useMicVAD({
  //   startOnLoad: false,
  //   onSpeechEnd: (audio) => {
  //     player.stop();
  //     const wav = utils.encodeWAV(audio);
  //     const blob = new Blob([wav], { type: "audio/wav" });
  //     submit(blob);
  //     vad.pause();
  //   },
  //   onSpeechStart() {
  //     player.stop();
  //   },
  //   workletURL: "/vad.worklet.bundle.min.js",
  //   modelURL: "/silero_vad.onnx",
  //   positiveSpeechThreshold: 0.6,
  //   minSpeechFrames: 4,
  //   ortConfig(ort: typeof ORT) {
  //     console.log(ort.env);
  //     const isSafari = /^((?!chrome|android).)*safari/i.test(
  //       navigator.userAgent
  //     );

  //     ort.env.wasm = {
  //       wasmPaths: {
  //         "ort-wasm-simd-threaded.wasm": "/ort-wasm-simd-threaded.wasm",
  //         "ort-wasm-simd.wasm": "/ort-wasm-simd.wasm",
  //         "ort-wasm.wasm": "/ort-wasm.wasm",
  //         "ort-wasm-threaded.wasm": "/ort-wasm-threaded.wasm",
  //       },
  //       numThreads: isSafari ? 1 : 4,
  //     };
  //   },
  // });

  useEffect(() => {
    function keyDown(e: KeyboardEvent) {
      if (e.key === "Enter") return inputRef.current?.focus();
      if (e.key === "Escape") return setInput("");
    }

    window.addEventListener("keydown", keyDown);
    return () => window.removeEventListener("keydown", keyDown);
  });

  const [messages, submit, isPending] = useActionState<
    Array<Message>,
    string | Blob
  >(async (prevMessages, data) => {
    const audioFormData = new FormData();

    if (typeof data === "string") {
      audioFormData.append("input", data);
      track("Text input");
    } else {
      audioFormData.append("input", data, "audio.webm");
      track("Speech input");
    }

    for (const message of prevMessages) {
      audioFormData.append("message", JSON.stringify(message));
    }

    audioFormData.append("formData", JSON.stringify(formData));

    const submittedAt = Date.now();

    const response = await fetch("/api", {
      method: "POST",
      body: audioFormData,
    });

    const transcript = decodeURIComponent(
      response.headers.get("X-Transcript") || ""
    );

    if (response.headers.get("X-Formdata")) {
      const formFillData = JSON.parse(
        decodeURIComponent(response.headers.get("X-Formdata") || "")
      );

      console.log(formFillData);
      // Determine which step of the form to jump to based on the received data
      const determineStep = (formFillData: Partial<typeof sampleData>) => {
        let possibleStep = 1; // Default to first step if no match
        let stepLabel = "MedicalHistory";
        if (
          formFillData.MedicalHistory ||
          formFillData.CurrentFunctionalStatus ||
          formFillData.AssessedAddress
        ) {
          possibleStep = 1;
          stepLabel =
            "Medical History, Current Functional Status & Assessed Address";
        } else if (formFillData.SocialBackground) {
          possibleStep = 2;
          stepLabel = "Social Background";
        } else if (formFillData.Equipments) {
          possibleStep = 3;
          stepLabel = "Equipments";
        } else if (formFillData.ExternalAccessibility) {
          possibleStep = 4;
          stepLabel = "External Accessibility";
        } else if (formFillData.LivingArea) {
          possibleStep = 5;
          stepLabel = "Living Area";
        } else if (formFillData.BathroomToilet) {
          possibleStep = 6;
          stepLabel = "Bathroom/Toilet";
        } else if (formFillData.Bedroom) {
          possibleStep = 7;
          stepLabel = "Bedroom";
        } else if (formFillData.Kitchen) {
          possibleStep = 8;
          stepLabel = "Kitchen";
        } else if (formFillData.OtherAreas || formFillData.OtherAssessments) {
          possibleStep = 9;
          stepLabel = "Other Areas and Assessments";
        } else if (formFillData.SubjectiveInformation) {
          possibleStep = 10;
          stepLabel = "Subjective Information";
        } else if (formFillData.ClientFamilyEducation) {
          possibleStep = 11;
          stepLabel = "Client/Family Education";
        } else if (formFillData.AttachmentLink) {
          possibleStep = 12;
          stepLabel = "Attachment Link";
        }

        return { possibleStep, stepLabel };
      };

      const { possibleStep, stepLabel } = determineStep(formFillData);
      console.log(`Step: ${possibleStep}, ${stepLabel}`);

      setStep(possibleStep);
      setFormData((prevData) => ({
        ...prevData,
        ...formFillData,
      }));

      setInput(transcript);

      return [
        ...prevMessages,
        {
          role: "user",
          content: transcript,
        },
      ];
    }

    if (response.headers.get("X-Response")) {
      const text = decodeURIComponent(response.headers.get("X-Response") || "");

      if (!response.ok || !transcript || !text || !response.body) {
        if (response.status === 429) {
          toast.error("Too many requests. Please try again later.");
        } else {
          toast.error((await response.text()) || "An error occurred.");
        }

        return prevMessages;
      }

      const latency = Date.now() - submittedAt;
      player.play(response.body, () => {
        // const isFirefox = navigator.userAgent.includes("Firefox");
        // if (isFirefox) vad.start();
      });
      setInput(transcript);

      return [
        ...prevMessages,
        {
          role: "user",
          content: transcript,
        },
        {
          role: "assistant",
          content: text,
          latency,
        },
      ];
    } else {
      return [
        ...prevMessages,
        {
          role: "user",
          content: transcript,
        }
      ];
    }

  }, []);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Form data:", formData);
    submit(input);
  }

  const addSampleData = (sectionName: string) => {
    if (sectionName) {
      setFormData((prevData) => ({
        ...prevData,
        [sectionName]: sampleData[sectionName as keyof typeof sampleData],
      }));
    } else {
      setFormData(sampleData);
    }
  };

  // Expose addSampleData function to window object
  if (typeof window !== "undefined") {
    (window as any).addSampleData = addSampleData;
  }

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-12 font-[family-name:var(--font-geist-sans)] w-full sm:w-4/5 mx-auto">
      <header className="mb-4">
        <form
          className="rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 flex items-center w-full border border-transparent hover:border-neutral-300 focus-within:border-neutral-400 hover:focus-within:border-neutral-400 dark:hover:border-neutral-700 dark:focus-within:border-neutral-600 dark:hover:focus-within:border-neutral-600"
          onSubmit={handleFormSubmit}
        >
          <input
            type="text"
            className="bg-transparent focus:outline-none p-3 sm:p-4 w-full text-black dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
            required
            placeholder="Ask me anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
          />

          <button
            type="submit"
            className="p-3 sm:p-4 text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
            disabled={isPending}
            aria-label="Submit"
          >
            {isPending ? <LoadingIcon /> : <EnterIcon />}
          </button>
        </form>
      </header>

      <main className="flex-grow overflow-y-auto">
        <MultiStepFormComponent
          formData={formData}
          setFormData={setFormData}
          step={step}
          setStep={setStep}
        />

        <div className="flex justify-center w-full mt-4">
          <div className="text-neutral-400 dark:text-neutral-600 text-center max-w-xl text-balance space-y-4">
            {messages.length > 0 && (
              <p>
                {messages.at(-1)?.content}
                <span className="text-xs font-mono text-neutral-300 dark:text-neutral-700">
                  {" "}
                  ({messages.at(-1)?.latency}ms)
                </span>
              </p>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-4">
        <AudioRecorderComponent onSubmit={submit} />
      </footer>
    </div>
  );
}
