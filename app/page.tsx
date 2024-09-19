"use client";

import clsx from "clsx";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { EnterIcon, LoadingIcon } from "@/lib/icons";
import { usePlayer } from "@/lib/usePlayer";
import { track } from "@vercel/analytics";
import type * as ORT from "onnxruntime-web";
import { useMicVAD, utils } from "@ricky0123/vad-react";


type Message = {
  role: "user" | "assistant";
  content: string;
  latency?: number;
};

import { MultiStepFormComponent } from "@/components/multi-step-form";
// import Image from "next/image";

export default function Home() {
  const [input, setInput] = useState("Hello");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const inputRef = useRef<HTMLInputElement>(null);
  const player = usePlayer();

  const vad = useMicVAD({
    startOnLoad: true,
    onSpeechEnd: (audio) => {
      player.stop();
      const wav = utils.encodeWAV(audio);
      const blob = new Blob([wav], { type: "audio/wav" });
      submit(blob);
      const isFirefox = navigator.userAgent.includes("Firefox");
      console.log("isFirefox", isFirefox);
      if (isFirefox) vad.pause();
    },
    workletURL: "/vad.worklet.bundle.min.js",
    modelURL: "/silero_vad.onnx",
    positiveSpeechThreshold: 0.6,
    minSpeechFrames: 4,
    ortConfig(ort: typeof ORT) {
      console.log(ort.env)
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );

      ort.env.wasm = {
        wasmPaths: {
          "ort-wasm-simd-threaded.wasm": "/ort-wasm-simd-threaded.wasm",
          "ort-wasm-simd.wasm": "/ort-wasm-simd.wasm",
          "ort-wasm.wasm": "/ort-wasm.wasm",
          "ort-wasm-threaded.wasm": "/ort-wasm-threaded.wasm"
        },
        numThreads: isSafari ? 1 : 4,
      };
    },
  });

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
      audioFormData.append("input", data, "audio.wav");
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
      const formFillData = JSON.parse(decodeURIComponent(
        response.headers.get("X-Formdata") || ""
      ));
  
      console.log(formFillData);

      // Determine which step of the form to jump to based on the received data
      const determineStep = (formFillData: Partial<typeof sampleData>) => {
        let possibleStep = 1;  // Default to first step if no match
        let stepLabel = "MedicalHistory";
        if (formFillData.MedicalHistory || formFillData.CurrentFunctionalStatus || formFillData.AssessedAddress) {
          possibleStep = 1;
          stepLabel = "Medical History, Current Functional Status & Assessed Address";
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
        } else if (formFillData.BathroomToilet || formFillData.KerbEntrance) {
          possibleStep = 6;
          stepLabel = "Bathroom/Toilet & Kerb Entrance";
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

        return {possibleStep, stepLabel};
      };
      
      const {possibleStep, stepLabel} = determineStep(formFillData);
      console.log(`Step: ${possibleStep}, ${stepLabel}`);
      
      setStep(possibleStep);
      setFormData(prevData => ({
        ...prevData,
        ...formFillData
      }));  
    }

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
      const isFirefox = navigator.userAgent.includes("Firefox");
      if (isFirefox) vad.start();
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
  }, []);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Form data:", formData);
    submit(input);
  }

  const addSampleData = (sectionName: string) => {
    const sampleData = {
      MedicalHistory: "Patient has a history of hypertension and Type 2 diabetes. Recently underwent hip replacement surgery at Singapore General Hospital.",
      CurrentFunctionalStatus: "Ambulatory with walking stick",
      AssessedAddress: "Block 123, Ang Mo Kio Avenue 6, #08-123, Singapore 560123",
      SocialBackground: {
        AccommodationType: "HDB 3-room flat",
        HomeSituation: ["Lives with someone", "Community Resources"],
        HomeSituationRemarks: "Lives with elderly spouse, receives help from nearby Senior Activity Centre",
        SocialSupport: [
          {
            Name: "Tan Ah Kow",
            Relationship: "Spouse",
            ContactNo: "91234567",
            IsSpokesperson: "Yes"
          },
          {
            Name: "Tan Mei Ling",
            Relationship: "Daughter",
            ContactNo: "98765432",
            IsSpokesperson: "No"
          }
        ]
      },
      Equipments: {
        EquipmentRequiredForHomeVisit: "Walking Aids",
        EquipmentsRequiredRemarks: "Quad cane required for stability",
        EquipmentAvailableAtHome: "Wheelchair",
        EquipmentsAvailableRemarks: "Wheelchair available for longer distances"
      },
      ExternalAccessibility: {
        AccessibilityAssessed: "Assessed",
        AccessibilityLanding: {
          LiftLandingFlat: "Lift-Landing",
          Remarks: "Lift available, but occasional breakdowns reported"
        },
        AccessibilityFlat: {
          TypeOfFlat: "Corridor Flat",
          DimensionsOfCorridor: "1.2m wide"
        },
        AccessibilityClutter: {
          PresenceOfClutter: true,
          Remarks: "Some potted plants near the entrance"
        },
        AccessibilitySpace: {
          SpaceAvailable: "Sufficient",
          WidthOfDoor: 90
        },
        AccessibilityKerbEntrance: {
          PresenceOfKerb: true,
          Type: "End",
          Remarks: "Small kerb at entrance",
          Measurement: "2cm height"
        },
        AccessibilitySteps: {
          PresenceOfSteps: false
        },
        OtherRemarks: "Consider installing grab bars near entrance"
      },
      LivingArea: {
        LivingAreaAssessed: "Assessed",
        LivingAreaStairs: {
          PresenceOfStairs: false
        },
        LivingAreaRugs: {
          PresenceOfRugs: true,
          Remarks: "Non-slip rug in living room"
        },
        LivingAreaSofa: {
          PresenceOfSofa: true,
          Height: 45,
          Remarks: "Able"
        },
        LivingAreaSpace: {
          SpaceAvailable: "Sufficient",
          Remarks: "Adequate space for mobility aid maneuvering"
        },
        LivingAreaLighting: "Adequate",
        BedroomLight: true,
        OtherRemarks: "Consider rearranging furniture for easier navigation"
      },
      BathroomToilet: {
        BathroomAssessed: "Assessed",
        BathroomLocation: "Attached to bedroom",
        BathroomKerbEntrance: {
          PresenceOfKerb: true,
          Type: "Complete",
          Remarks: "Kerb at bathroom entrance",
          Measurement: "3cm height"
        },
        BathroomRugs: {
          PresenceOfRugs: false
        },
        BathroomMats: {
          PresenceOfMats: true,
          Remarks: "Non-slip bath mat present"
        },
        BathroomShower: {
          PresenceOfShower: true,
          Remarks: "Handheld shower head installed"
        },
        BathroomToiletType: "Sitting",
        BathroomToiletHeight: 40,
        BathroomToiletRemarks: "Able",
        BathroomBars: {
          PresenceOfBars: true,
          Remarks: "Grab bars installed near toilet and shower"
        },
        BathroomSpace: {
          SpaceAvailable: "Sufficient"
        },
        BathroomLighting: {
          Lighting: "Adequate"
        },
        OtherRemarks: "Consider installing a shower chair"
      },
      Bedroom: {
        BedroomAssessed: "Assessed",
        BedroomBed: {
          PresenceOfBed: true,
          Height: 55,
          Remarks: "Able"
        },
        BedroomRugs: {
          PresenceOfRugs: false
        },
        BedroomLighting: "Adequate",
        BedroomLight: true,
        BedroomSpace: {
          SpaceAvailable: "Sufficient",
          Remarks: "Adequate space for mobility aid beside bed"
        },
        OtherRemarks: "Consider installing bed rail for support"
      },
      Kitchen: {
        KitchenAssessed: "Assessed",
        KitchenKerb: {
          PresenceOfKerb: false
        },
        KitchenRugs: {
          PresenceOfRugs: false
        },
        KitchenStove: {
          PresenceOfStove: true,
          Height: 90,
          Remarks: "Induction cooktop for safety"
        },
        KitchenItemHeight: {
          PresenceOfItemHeight: true,
          Height: 150,
          Remarks: "Unable"
        },
        KitchenTable: {
          PresenceOfTable: true,
          Height: 75,
          Remarks: "Suitable height for wheelchair access"
        },
        KitchenChair: {
          PresenceOfChair: true,
          Height: 45,
          Remarks: "Able"
        },
        OtherRemarks: "Consider lowering some kitchen cabinets for easier reach"
      },
      OtherAreas: {
        OtherAreasAssessed: "Assessed",
        OtherAreasRemarks: "Balcony has a small step, consider adding a small ramp for accessibility"
      },
      OtherAssessments: {
        OtherAssessmentsAssessed: "Assessed",
        OtherAssessmentsRemarks: "Home generally well-lit and ventilated. Consider installing emergency call system."
      },
      SubjectiveInformation: {
        NotApplicable: false,
        ClientReported: "Client reports difficulty reaching high cabinets and occasional dizziness when standing up quickly",
        PresenceOfPain: "Yes",
        PainDetails: {
          Location: "Lower back and right hip",
          Nature: "Dull ache",
          Severity: "4/10",
          Frequency: "Intermittent, worse in the evenings",
          PainHistory: "Pain started after hip surgery, gradually improving with physiotherapy"
        },
        Problems: [
          {
            MainProblems: "Difficulty accessing high cabinets in kitchen",
            Recommendations: "Rearrange frequently used items to lower shelves or install pull-down shelving"
          },
          {
            MainProblems: "Risk of falls due to occasional dizziness",
            Recommendations: "Educate on proper techniques for positional changes, consider referral to doctor for medication review"
          }
        ]
      },
      ClientFamilyEducation: {
        EducationProvidedTo: "Social Support",
        SocialSupport: ["Tan Ah Kow", "Tan Mei Ling"],
        EducationDone: "Educated on fall prevention strategies, proper use of mobility aids, and importance of medication adherence",
        EducationPerformance: "Competent",
        EducationPerformanceRemarks: "Family members demonstrated understanding",
        EducationFollowup: {
          FollowupNeeded: true,
          FollowupRemarks: "Follow up in 1 month to assess implementation of recommendations"
        }
      },
      AttachmentLink: "https://www.example.com/home-assessment-photos-123456"
    };

    if (sectionName) {
      setFormData(prevData => ({
        ...prevData,
        [sectionName]: sampleData[sectionName as keyof typeof sampleData]
      }));
    } else {
      setFormData(sampleData);
    }
  };

  // Expose addSampleData function to window object
  if (typeof window !== 'undefined') {
    (window as any).addSampleData = addSampleData;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] w-full sm:w-4/5 mx-auto">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <form
          className="rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 flex items-center w-full border border-transparent hover:border-neutral-300 focus-within:border-neutral-400 hover:focus-within:border-neutral-400 dark:hover:border-neutral-700 dark:focus-within:border-neutral-600 dark:hover:focus-within:border-neutral-600"
          onSubmit={handleFormSubmit}
        >
          <input
            type="text"
            className="bg-transparent focus:outline-none p-4 w-full placeholder:text-neutral-600 dark:placeholder:text-neutral-400"
            required
            placeholder="Ask me anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
          />

          <button
            type="submit"
            className="p-4 text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
            disabled={isPending}
            aria-label="Submit"
          >
            {isPending ? <LoadingIcon /> : <EnterIcon />}
          </button>
        </form>

        <div className="text-neutral-400 dark:text-neutral-600 pt-4 text-center max-w-xl text-balance min-h-28 space-y-4">
          {messages.length > 0 && (
            <p>
              {messages.at(-1)?.content}
              <span className="text-xs font-mono text-neutral-300 dark:text-neutral-700">
                {" "}
                ({messages.at(-1)?.latency}ms)
              </span>
            </p>
          )}

          {messages.length === 0 && (
            <>
              {vad.loading ? (
                <p>Loading speech detection...</p>
              ) : vad.errored ? (
                <p>Failed to load speech detection.</p>
              ) : (
                <p>Start talking to chat.</p>
              )}
            </>
          )}
        </div>

        <div
          className={clsx(
            "absolute size-36 blur-3xl rounded-full bg-gradient-to-b from-red-200 to-red-400 dark:from-red-600 dark:to-red-800 -z-50 transition ease-in-out",
            {
              "opacity-0": vad.loading || vad.errored,
              "opacity-30": !vad.loading && !vad.errored && !vad.userSpeaking,
              "opacity-100 scale-110": vad.userSpeaking,
            }
          )}
        />

        <MultiStepFormComponent formData={formData} setFormData={setFormData} step={step} setStep={setStep} />

      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
