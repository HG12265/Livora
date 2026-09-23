import React, { useState } from 'react';
import { PhoneCall, PhoneOff, Mic, Volume2, Sparkles, X } from 'lucide-react';

const IvrSimulator = ({ isOpen, onClose, selectedLanguage }) => {
  const [callStatus, setCallStatus] = useState('idle'); // idle, calling, connected, ended
  const [currentPrompt, setCurrentPrompt] = useState('Welcome to PM-AJAY Toll-Free Voice Assistant (*1800-PMAJAY#). Please speak your name and district.');

  const handleStartCall = () => {
    setCallStatus('calling');
    setTimeout(() => {
      setCallStatus('connected');
      speakIVR(currentPrompt);
    }, 1500);
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setTimeout(() => setCallStatus('idle'), 1000);
  };

  const speakIVR = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage === 'ta' ? 'ta-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#24302C]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] border border-[#E2DBD0] rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden p-6 space-y-6 text-center animate-in zoom-in-95">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#087F5B]">
            <Sparkles className="w-4 h-4" />
            <span>Low-Tech IVR Phone Call Simulator</span>
          </div>
          <button onClick={onClose} className="text-[#5C6E67] hover:text-[#24302C]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phone Visual Interface */}
        <div className="bg-white p-6 rounded-3xl border-2 border-[#087F5B] shadow-inner space-y-4">
          
          <div className="text-center space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-[#087F5B]">Toll-Free Helpline</span>
            <h3 className="text-2xl font-black text-[#24302C] font-mono">1800-PMAJAY-GIA</h3>
            <p className="text-[11px] text-[#5C6E67]">Feature Phone / Offline Support</p>
          </div>

          {/* Call Status Animation */}
          <div className="py-6 flex flex-col items-center justify-center gap-3">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-all ${
              callStatus === 'connected' ? 'bg-[#087F5B] animate-mic-pulse' : callStatus === 'calling' ? 'bg-[#E98B73] animate-pulse' : 'bg-[#5C6E67]'
            }`}>
              <PhoneCall className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold text-[#24302C]">
              {callStatus === 'idle' && 'Tap below to simulate IVR Call'}
              {callStatus === 'calling' && 'Connecting to Toll-Free Server...'}
              {callStatus === 'connected' && '🔊 IVR Voice Interview Active'}
              {callStatus === 'ended' && 'Call Ended'}
            </span>
          </div>

          {/* Active Voice Prompt Box */}
          {callStatus === 'connected' && (
            <div className="bg-[#E6F4F0] p-4 rounded-2xl text-xs font-semibold text-[#087F5B] text-left leading-relaxed">
              🗣️ <strong>IVR Voice Prompt:</strong> "{currentPrompt}"
            </div>
          )}

        </div>

        {/* Call Trigger Buttons */}
        <div className="flex items-center justify-center gap-4">
          {callStatus === 'idle' ? (
            <button
              onClick={handleStartCall}
              className="flex items-center gap-2 bg-[#087F5B] hover:bg-[#066749] text-white px-8 py-3.5 rounded-full font-bold text-xs shadow-md transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Simulate IVR Call</span>
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="flex items-center gap-2 bg-[#E98B73] hover:bg-red-600 text-white px-8 py-3.5 rounded-full font-bold text-xs shadow-md transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default IvrSimulator;
