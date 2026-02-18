
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { useAppContext } from '../context/AppContext';

declare const __API_KEY__: string;

// Helper functions for audio decoding
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


interface TTSButtonProps {
  textToSpeak: string;
  className?: string;
}

const TTSButton: React.FC<TTSButtonProps> = ({ textToSpeak, className }) => {
  const { showToast } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Clean up audio resources on unmount
  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        sourceRef.current.stop();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);


  const handlePlay = async () => {
    if (isLoading || isPlaying || !textToSpeak) {
      return;
    }
    
    const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
    if (!apiKey) {
      console.error("API_KEY is missing. TTS is disabled.");
      showToast("Sorry, Buddy can't speak right now.");
      return;
    }

    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({apiKey: apiKey});
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say rhythmically and energetically: ${textToSpeak}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
          },
          thinkingConfig: { thinkingBudget: 0 } // Speed over thinking
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (base64Audio) {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioContext = audioContextRef.current;
        const audioBuffer = await decodeAudioData(
          decode(base64Audio),
          audioContext,
          24000,
          1,
        );

        if (sourceRef.current) {
          sourceRef.current.stop();
        }

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        source.onended = () => {
          setIsPlaying(false);
          sourceRef.current = null;
        };
        
        source.start();
        sourceRef.current = source;
        setIsPlaying(true);
      } else {
         throw new Error("No audio data received from API.");
      }

    } catch (error) {
      console.error("Error generating or playing speech:", error);
      showToast("Sorry, Buddy can't speak right now.");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    if (isPlaying) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3.5a.5.5 0 01.5.5v12a.5.5 0 01-1 0v-12a.5.5 0 01.5-.5zM5 7.5a.5.5 0 01.5.5v5a.5.5 0 01-1 0v-5a.5.5 0 01.5-.5zM15 5.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0v-9a.5.5 0 01.5-.5z" />
        </svg>
      );
    }
    return (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
         <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.969 9.969 0 0117 10c0 2.652-.996 5.036-2.629 6.857a1 1 0 01-1.414-1.414A7.969 7.969 0 0015 10c0-2.11-.84-4.03-2.214-5.457a1 1 0 010-1.414z" clipRule="evenodd" />
       </svg>
    );
  };
  
  const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
  const isApiKeyMissing = !apiKey;
  const defaultClassName = "bg-teal-100 text-teal-600 rounded-full h-8 w-8 flex items-center justify-center transition-transform transform hover:scale-110 disabled:bg-gray-200 disabled:scale-100 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300";
  
  return (
    <button
      onClick={handlePlay}
      disabled={isLoading || isPlaying || !textToSpeak.trim() || isApiKeyMissing}
      className={`${defaultClassName} ${className}`}
      aria-label="Listen to text"
    >
      {getButtonContent()}
    </button>
  );
};

export default TTSButton;
