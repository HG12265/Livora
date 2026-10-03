import React, { useState } from 'react';
import { MessageSquare, Mic, Play, Pause, CheckCheck, Send, Sparkles, X, Paperclip, Phone, MoreVertical } from 'lucide-react';

const WhatsappSimulator = ({ isOpen, onClose, selectedLanguage = 'en' }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'text',
      text: selectedLanguage === 'ta' 
        ? 'வணக்கம்! MoSJE PM-AJAY வாழ்வாதார மையம் வாட்ஸ்அப் சேவைக்கு வரவேற்கிறோம். உங்கள் பெயர், ஊர் மற்றும் பாரம்பரிய தொழிலை 15-வினாடி குரல் குறிப்பாக (Voice Note) அனுப்பவும்.'
        : 'Welcome to MoSJE PM-AJAY Livelihood WhatsApp Bot! Please send your 15-second voice note describing your name, location, and skills.',
      time: '10:40 AM'
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const handleRecordVoiceNote = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      
      const userMsg = {
        id: Date.now(),
        sender: 'user',
        type: 'voice',
        duration: '0:14',
        time: '10:41 AM'
      };

      const botRespText = selectedLanguage === 'ta'
        ? 'குரல் பகுப்பாய்வு முடிந்தது! ✅\n\n👤 பயனாளி: ஜீவா (சேலம்)\n🎯 பரிந்துரைக்கப்பட்ட NSQF: Master Weaver & Handloom Stylist (Level 4)\n💰 PM-AJAY GIA மானியம்: ₹50,000 நவீனமயமாக்கல் மானியம்\n🏛️ பயிற்சி மையம்: MoSJE Center of Excellence தாரமங்கலம்\n👨‍💼 நிதி ஆலோசகர்: திரு. ஆர். ரமேஷ் (+91 94432 10987)\n\nஉங்கள் டிஜிட்டல் பாஸ்புக் தயார்!'
        : 'Voice Analysis Complete! ✅\n\n👤 Beneficiary: Jeeva (Salem)\n🎯 Recommended NSQF: Master Weaver & Handloom Stylist (Level 4)\n💰 PM-AJAY GIA Grant: ₹50,000 Modernization Grant\n🏛️ Training Center: MoSJE Center of Excellence Tharamangalam\n👨‍💼 Financial Consultant: Mr. R. Ramesh (+91 94432 10987)\n\nYour Verified Digital Passbook is ready!';

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        type: 'text',
        text: botRespText,
        time: '10:41 AM'
      };

      setMessages(prev => [...prev, userMsg, botMsg]);
    }, 2500);
  };

  const togglePlayAudio = (msgId) => {
    if (playingAudioId === msgId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(msgId);
      setTimeout(() => setPlayingAudioId(null), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#24302C]/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] border border-[#E2DBD0] rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col h-[520px]">
        
        {/* WhatsApp Header */}
        <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between flex-shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white text-[#075E54] flex items-center justify-center font-bold text-sm shadow-sm">
              🇮🇳
            </div>
            <div>
              <h3 className="text-xs font-bold leading-tight">PM-AJAY Livelihood Bot</h3>
              <span className="text-[10px] text-emerald-200 block">Verified Official MoSJE • Online</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white/80">
            <button onClick={onClose} className="hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body with WhatsApp Wallpaper Tint */}
        <div className="flex-1 bg-[#ECE5DD] p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`p-3 rounded-2xl max-w-[85%] shadow-sm ${
                msg.sender === 'user' ? 'bg-[#DCF8C6] text-[#24302C] rounded-tr-none' : 'bg-white text-[#24302C] rounded-tl-none'
              }`}>
                {msg.type === 'text' ? (
                  <p className="whitespace-pre-line leading-relaxed text-[11px] font-medium">{msg.text}</p>
                ) : (
                  <div className="flex items-center gap-3 min-w-[170px]">
                    <button
                      onClick={() => togglePlayAudio(msg.id)}
                      className="w-8 h-8 rounded-full bg-[#075E54] text-white flex items-center justify-center flex-shrink-0"
                    >
                      {playingAudioId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <div className="flex-1 space-y-1">
                      <div className="h-1 bg-black/20 rounded-full overflow-hidden">
                        <div className={`h-full bg-[#075E54] ${playingAudioId === msg.id ? 'w-full transition-all duration-3000' : 'w-1/3'}`}></div>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-[#5C6E67]">
                        <span>Voice Note ({msg.duration})</span>
                        <Mic className="w-3 h-3 text-[#075E54]" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 text-[9px] text-[#5C6E67] mt-1">
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                </div>
              </div>
            </div>
          ))}

          {isRecording && (
            <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-2xl border border-emerald-300 animate-pulse text-xs text-[#075E54] font-bold">
              <Mic className="w-4 h-4 text-red-500 animate-bounce" />
              <span>Simulating Voice Note Transmission (0:14)...</span>
            </div>
          )}
        </div>

        {/* WhatsApp Bottom Bar with Mic */}
        <div className="bg-[#F0F0F0] p-3 flex items-center gap-2 border-t border-[#E2DBD0] flex-shrink-0">
          <div className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-[#5C6E67] flex items-center justify-between">
            <span>Hold mic to record voice note...</span>
            <Paperclip className="w-4 h-4 text-[#5C6E67]" />
          </div>

          <button
            onClick={handleRecordVoiceNote}
            disabled={isRecording}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all active:scale-95 ${
              isRecording ? 'bg-red-500 animate-ping' : 'bg-[#075E54] hover:bg-[#128C7E]'
            }`}
            title="Send Voice Note"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default WhatsappSimulator;
