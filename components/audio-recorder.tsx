"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Mic, Square } from "lucide-react"
import { cn } from "@/lib/utils";

interface AudioRecorderProps {
  onSubmit: (audioBlob: Blob) => void
}

export function AudioRecorderComponent({ onSubmit }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioChunksRef = useRef<Float32Array[]>([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1)

      source.connect(processor)
      processor.connect(audioContextRef.current.destination)

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0)
        audioChunksRef.current.push(new Float32Array(inputData))
      }

      mediaRecorderRef.current = new MediaRecorder(stream)
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }, [])

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      const audioData = concatenateAudioBuffers(audioChunksRef.current)
      const wavBlob = encodeWavFile(audioData, audioContextRef.current!.sampleRate)

      // Create a download link for the WAV file
      // const downloadLink = document.createElement('a');
      // downloadLink.href = URL.createObjectURL(wavBlob);
      // downloadLink.download = 'recorded_audio.wav';
      // downloadLink.click();

      // // Clean up the object URL
      // URL.revokeObjectURL(downloadLink.href);
      
      try {
        await onSubmit(wavBlob)
        console.log('Audio submitted successfully')
      } catch (error) {
        console.error('Error submitting audio:', error)
      }

      // Stop all tracks on the stream to release the microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      audioContextRef.current!.close()
      audioChunksRef.current = []
    }
  }, [isRecording, onSubmit])

  const encodeWavFile = (samples: Float32Array, sampleRate: number): Blob => {
    const buffer = new ArrayBuffer(44 + samples.length * 2)
    const view = new DataView(buffer)

    // Write WAV header
    writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + samples.length * 2, true)
    writeString(view, 8, 'WAVE')
    writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 2, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)
    writeString(view, 36, 'data')
    view.setUint32(40, samples.length * 2, true)

    // Write audio data
    floatTo16BitPCM(view, 44, samples)

    return new Blob([buffer], { type: 'audio/wav' })
  }

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]))
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
    }
  }

  const concatenateAudioBuffers = (buffers: Float32Array[]): Float32Array => {
    const totalLength = buffers.reduce((acc, buffer) => acc + buffer.length, 0)
    const result = new Float32Array(totalLength)
    let offset = 0
    for (const buffer of buffers) {
      result.set(buffer, offset)
      offset += buffer.length
    }
    return result
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center",
          isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        )}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? (
          <Square className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        ) : (
          <Mic className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        )}
      </Button>
      <p className="mt-2 text-xs sm:text-sm font-medium text-gray-700 text-center">
        {isRecording ? 'Recording...' : ''}
      </p>
    </div>
  )
}