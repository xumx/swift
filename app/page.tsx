"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { track } from "@vercel/analytics";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { VadAudioRecorder } from "@/components/vad-audio-recorder";

export default function Home() {
  const [messages, setMessages] = useState<{ en: string; pt: string }[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mainRef = useRef<null | HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = mainRef.current.scrollHeight;
    }
  }, [messages, isSpeaking]);

    const [_, submit, isPending] = useActionState<{ en: string; pt: string }[], Blob>(
    async (prevMessages, data) => {
      const audioFormData = new FormData();
      audioFormData.append("input", data, "audio.webm");
      track("Speech input");

      try {
        const response = await fetch("/api", {
          method: "POST",
          body: audioFormData,
        });

        if (!response.ok) {
          if (response.status === 429) {
            toast.error("Too many requests. Please try again later.");
          } else {
            const errorText = await response.text();
            toast.error(errorText || "An error occurred.");
          }
          return prevMessages;
        }

        const result = await response.json();
        const transcript = result.transcript;

        if (transcript && typeof transcript === 'string' && transcript.includes('||')) {
          const [enText, ptText] = transcript.split('||');
          const newMessages = [...prevMessages, { en: enText, pt: ptText }];
          setMessages(newMessages);
          return newMessages;
        } else {
          toast.error("Failed to get a valid transcript.");
          return prevMessages;
        }

      } catch (error) {
        console.error("Error submitting audio:", error);
        toast.error("An unexpected error occurred while processing your request.");
        return prevMessages;
      }
    },
    []
  );

  return (
    <div className="flex flex-col h-screen font-[family-name:var(--font-geist-sans)] w-full bg-neutral-50 dark:bg-neutral-900">
      <header className="text-center p-2 border-b border-neutral-200 dark:border-neutral-700 shrink-0">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          {isSpeaking ? "User is speaking..." : "Listening..."}
        </p>
      </header>

      <main ref={mainRef} className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isPending ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-neutral-400 dark:text-neutral-500">
              No transcriptions yet. The recording will start automatically.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 p-3 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
              <p className="text-neutral-800 dark:text-neutral-200">{msg.en}</p>
              <p className="text-neutral-800 dark:text-neutral-200">{msg.pt}</p>
            </div>
          ))
        )}
        {isPending && <TypingIndicator />}
      </main>

      {/* The VAD component is not visible and does not need a footer element */}
      <VadAudioRecorder onSubmit={submit} onVadStateChange={setIsSpeaking} />
    </div>
  );
}
