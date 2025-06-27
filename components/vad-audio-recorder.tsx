"use client";

import { useEffect } from 'react';
import { useMicVAD } from '@ricky0123/vad-react';

// --- Utility Functions ---

const encodeWavFile = (samples: Float32Array, sampleRate: number): Blob => {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  // Write audio data
  floatTo16BitPCM(view, 44, samples);

  return new Blob([buffer], { type: 'audio/wav' });
};

const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
};

// --- Component ---

interface VadAudioRecorderProps {
  onSubmit: (audioBlob: Blob) => void;
  onVadStateChange: (isSpeaking: boolean) => void;
}

export function VadAudioRecorder({ onSubmit, onVadStateChange }: VadAudioRecorderProps) {
  const vad = useMicVAD({
    model: "v5",
    redemptionFrames: 4,
    startOnLoad: true,
    onSpeechEnd: (audio) => {
      console.log("VAD: Speech ended");
      const wavBlob = encodeWavFile(audio, 16000); // VAD uses 16kHz sample rate
      onSubmit(wavBlob);
    },
  });

  useEffect(() => {
    onVadStateChange(vad.userSpeaking);
  }, [vad.userSpeaking, onVadStateChange]);

  // This component does not render anything
  return null;
}
