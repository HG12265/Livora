import React, { useState } from 'react';
import { MessageSquare, Mic, Play, Pause, CheckCheck, Send, Sparkles, X } from 'lucide-react';

const WhatsappSimulator = ({ isOpen, onClose, selectedLanguage }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'text',
      text: selectedLanguage === 'ta' 
        ? 'வணக்கம்! PM-AJAY வாழ்வாதார மையம் வாட்ஸ்அப் சேவைக்கு வரவேற்கிறோம். உங்கள் 15-வினாடி குரல் குறிப்பை (Voice Note) அனுப்பவும்.'
        : 'Welcome to PM-AJAY Livelihood WhatsApp Bot! Please send your 15-second voice note describing your work experience.',
      time: '10:40 AM'
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordVoiceNote = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      
      // User voice note message
      const userMsg = {
        id: messages.length + 1,
        sender: 'user',
        type: 'voice',
        duration: '0:14',
        time: '10:41 AM'
      };

      // Bot response message
      const botMsg = {
        id: messages.length + 2,
        sender: 'bot',
        type: 'text',
        text: selectedLanguage === 'ta'
          ? 'ஆராய்ச்சி முடிந்தது! உங்களுக்கான பரிந்துரைக்கப்பட்ட பயிற்சி: Solar PV Installer (NSQF Level 4). PM-AJAY GIA மானியம் ₹45,000 தங்களுக்கு ஒதுக்கப்பட்டுள்ளது!'
          : 'Voice Analysis Complete! Recommended Course: Solar PV Installer (NSQF Level 4). PM-AJAY GIA Toolkit Grant ₹45,000 allocated for you!',
        time: '10:41 AM'
      };

      setMessages(prev => [...prev, userMsg, botMsg]);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#24302C]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] border border-[#E2DBD0] rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* WhatsApp Header */}
        <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-[#075E54] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5 fill-[#075E54]" />
            </div>
            <div>
              <h3 className="text-sm font-bold">PM-AJAY Livelihood Bot</h3>
              <p className="text-[10px] text-white/80">Official WhatsApp Voice Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-white/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Chat Messages Box */}
        <div className="p-4 bg-[#E5DDD5] h-80 overflow-y-auto space-y-3 font-sans text-xs">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-2xl max-w-[80%] shadow-sm ${msg.sender === 'user' ? 'bg-[#DCF8C6] text-[#24302C] rounded-tr-none' : 'bg-white text-[#24302C] rounded-tl-none'}`}>
                {msg.type === 'voice' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#075E54] text-white flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">🎤 Voice Note ({msg.duration})</span>
                      <span className="text-[9px] text-[#5C6E67]">Tap to play</span>
                    </div>
                  </div>
                ) : (
                  <p className="leading-relaxed">{msg.text}</p>
                )}
                <span className="text-[9px] text-[#5C6E67] block text-right mt-1">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Voice Note Trigger */}
        <div className="p-4 bg-white border-t border-[#E2DBD0] flex items-center justify-between gap-3">
          <p className="text-xs text-[#5C6E67]">Hold mic to send 15s Voice Note</p>
          <button
            onClick={handleRecordVoiceNote}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all ${
              isRecording ? 'bg-red-500 animate-ping' : 'bg-[#075E54] hover:bg-[#128C7E]'
            }`}
          >
            <Mic className="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default WhatsappSimulator;
