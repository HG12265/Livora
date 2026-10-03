import React, { useState } from 'react';
import { PhoneCall, PhoneOff, Mic, Volume2, Sparkles, X, Delete, PhoneForwarded } from 'lucide-react';

const IvrSimulator = ({ isOpen, onClose, selectedLanguage = 'en' }) => {
  const [callStatus, setCallStatus] = useState('idle'); // idle, dialing, connected, ended
  const [ivrStep, setIvrStep] = useState(1);
  const [selectedKey, setSelectedKey] = useState('');
  const [callLog, setCallLog] = useState([]);

  const prompts = {
    ta: {
      step1: "வணக்கம்! PM-AJAY கட்டணமில்லா குரல் சேவைக்கு வரவேற்கிறோம். கைத்தறி நெசவுக்கு 1, சோலார் மின்சாரத்திற்கு 2, இயற்கை விவசாயத்திற்கு 3, வாகன மெக்கானிக்கிற்கு 4 அழுத்தவும்.",
      step2_1: "கைத்தறி நெசவு தேர்ந்தெடுக்கப்பட்டது. ₹50,000 PM-AJAY நவீனமயமாக்கல் மானியம் மற்றும் சேலம் பயிற்சி மையம் தங்களுக்கு ஒதுக்கப்பட்டுள்ளது. உறுதிப்படுத்த 1 அழுத்தவும்.",
      step2_2: "சோலார் PV தொழில்நுட்பம் தேர்ந்தெடுக்கப்பட்டது. ₹45,000 PM-AJAY டூல்கிட் மானியம் ஒதுக்கப்பட்டுள்ளது. உறுதிப்படுத்த 1 அழுத்தவும்.",
      step2_3: "இயற்கை விவசாய உரம் தயாரிப்பு தேர்ந்தெடுக்கப்பட்டது. ₹35,000 பயோ-யூனிட் மானியம் ஒதுக்கப்பட்டுள்ளது. உறுதிப்படுத்த 1 அழுத்தவும்.",
      step2_4: "மின்சார வாகன (EV) மெக்கானிக் தேர்ந்தெடுக்கப்பட்டது. ₹50,000 டூல்கிட் மானியம் ஒதுக்கப்பட்டுள்ளது. உறுதிப்படுத்த 1 அழுத்தவும்.",
      completed: "நன்றி! உங்கள் பதிவு எண் PMAJAY-IVR-8841. நிதி ஆலோசகர் திரு. ரமேஷ் தங்களை 24 மணி நேரத்தில் தொடர்பு கொள்வார். உங்கள் செல்போனுக்கு SMS அனுப்பப்பட்டது."
    },
    en: {
      step1: "Welcome to PM-AJAY Toll-Free IVR Voice Helpline 1800-PMAJAY. Press 1 for Handloom Weaving, 2 for Solar PV Technician, 3 for Organic Agriculture, 4 for EV Vehicle Servicing.",
      step2_1: "Handloom Weaving selected. ₹50,000 PM-AJAY modernization toolkit grant allocated. Press 1 to confirm.",
      step2_2: "Solar PV Technician selected. ₹45,000 PM-AJAY toolkit grant allocated. Press 1 to confirm.",
      step2_3: "Organic Agriculture Producer selected. ₹35,000 Bio-unit setup grant allocated. Press 1 to confirm.",
      step2_4: "Electric Vehicle Servicing selected. ₹50,000 EV toolkit subsidy allocated. Press 1 to confirm.",
      completed: "Thank you! Registration ID PMAJAY-IVR-8841 generated. Financial Consultant Mr. R. Ramesh will call you within 24 hours. SMS sent to your phone."
    },
    hi: {
      step1: "नमस्ते! पीएम-अजय टोल-फ्री आईवीआर हेल्पलाइन 1800-PMAJAY में आपका स्वागत है। हथकरघा के लिए 1, सौर ऊर्जा के लिए 2, जैविक कृषि के लिए 3, ईवी वाहन के लिए 4 दबाएं।",
      step2_1: "हथकरघा बुनाई चुनी गई। ₹50,000 टूलकिट अनुदान स्वीकृत। पुष्टि के लिए 1 दबाएं।",
      step2_2: "सोलर पीवी इंस्टॉलर चुना गया। ₹45,000 टूलकिट अनुदान स्वीकृत। पुष्टि के लिए 1 दबाएं।",
      step2_3: "जैविक कृषि चुनी गई। ₹35,000 अनुदान स्वीकृत। पुष्टि के लिए 1 दबाएं।",
      step2_4: "ईवी मैकेनिक चुना गया। ₹50,000 अनुदान स्वीकृत। पुष्टि के लिए 1 दबाएं।",
      completed: "धन्यवाद! पंजीकरण आईडी PMAJAY-IVR-8841 उत्पन्न हुई। वित्तीय सलाहकार श्री रमेश आपसे शीघ्र संपर्क करेंगे।"
    },
    te: {
      step1: "నమస్కారం! పీఎం-అజయ్ టోల్-ఫ్రీ ఐవీఆర్ హెల్ప్‌లైన్‌కు స్వాగతం. చేనేత మగ్గం కొరకు 1, సోలార్ టెక్నీషియన్ కొరకు 2, సేంద్రీయ వ్యవసాయం కొరకు 3, ఈవీ మెకానిక్ కొరకు 4 నొక్కండి.",
      step2_1: "చేనేత మగ్గం ఎంపికైంది. ₹50,000 పీఎం-అజయ్ టూల్‌కిట్ గ్రాంట్ మంజూరైంది. నిర్ధారించడానికి 1 నొక్కండి.",
      step2_2: "సోలార్ టెక్నీషియన్ ఎంపికైంది. ₹45,000 టూల్‌కిట్ గ్రాంట్ మంజూరైంది. నిర్ధారించడానికి 1 నొక్కండి.",
      step2_3: "సేంద్రీయ వ్యవసాయం ఎంపికైంది. ₹35,000 బయో-యూనిట్ గ్రాంట్ మంజూరైంది. నిర్ధారించడానికి 1 నొక్కండి.",
      step2_4: "ఈవీ మెకానిక్ ఎంపికైంది. ₹50,000 టూల్‌కిట్ గ్రాంట్ మంజూరైంది. నిర్ధారించడానికి 1 నొక్కండి.",
      completed: "ధన్యవాదాలు! రిజిస్ట్రేషన్ ఐడీ PMAJAY-IVR-8841 సృష్టించబడింది. ఆర్థిక సలహాదారు మిమ్మల్ని సంప్రదిస్తారు."
    }
  };

  const p = prompts[selectedLanguage] || prompts.en;

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = { ta: 'ta-IN', en: 'en-IN', hi: 'hi-IN', te: 'te-IN' };
    utterance.lang = langMap[selectedLanguage] || 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleStartCall = () => {
    setCallStatus('dialing');
    setIvrStep(1);
    setCallLog(["Dialing 1800-PMAJAY-GIA..."]);

    setTimeout(() => {
      setCallStatus('connected');
      setCallLog(prev => [...prev, "Connected to PM-AJAY Toll-Free IVR Server", "Playing Trade Selection Menu..."]);
      speakText(p.step1);
    }, 1500);
  };

  const handleKeyPress = (num) => {
    if (callStatus !== 'connected') return;
    setSelectedKey(num);

    if (ivrStep === 1) {
      setCallLog(prev => [...prev, `User pressed [${num}]`]);
      const nextPrompt = num === '1' ? p.step2_1 : num === '2' ? p.step2_2 : num === '3' ? p.step2_3 : p.step2_4;
      setIvrStep(2);
      speakText(nextPrompt);
    } else if (ivrStep === 2) {
      setCallLog(prev => [...prev, `User confirmed with [${num}]`, "Grant Allocated & SMS Dispatched"]);
      setIvrStep(3);
      speakText(p.completed);
    }
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setTimeout(() => {
      setCallStatus('idle');
      setIvrStep(1);
      setCallLog([]);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#24302C]/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] border border-[#E2DBD0] rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#087F5B]">
            <Sparkles className="w-4 h-4 text-[#E98B73]" />
            <span>Low-Tech IVR Phone Simulator (*1800#)</span>
          </div>
          <button onClick={onClose} className="text-[#5C6E67] hover:text-[#24302C]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Phone Visual Chassis */}
        <div className="bg-[#1C2826] text-white p-5 rounded-3xl border-4 border-[#24302C] shadow-2xl space-y-4">
          
          {/* LCD Screen on phone */}
          <div className="bg-[#2D4039] p-3 rounded-2xl border border-white/20 text-center space-y-1 font-mono">
            <span className="text-[10px] text-emerald-400 block font-bold tracking-wider">
              {callStatus === 'connected' ? 'CALL CONNECTED • 00:34' : callStatus === 'dialing' ? 'DIALING...' : 'TOLL-FREE HELPLINE'}
            </span>
            <p className="text-lg font-bold text-white tracking-widest">
              1800-PMAJAY-GIA
            </p>
            <p className="text-[10px] text-white/70">
              {callStatus === 'connected' ? (ivrStep === 1 ? 'Select Trade [1-4]' : ivrStep === 2 ? 'Confirm Grant [1]' : 'Registration Complete!') : 'Feature Phone / Offline Support'}
            </p>
          </div>

          {/* Keypad Grid (1-9, *, 0, #) */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
              <button
                key={k}
                onClick={() => handleKeyPress(k)}
                disabled={callStatus !== 'connected'}
                className="bg-[#24302C] hover:bg-[#087F5B] disabled:opacity-40 active:scale-95 text-white py-3 rounded-xl font-mono text-base font-bold transition-all border border-white/10 shadow-sm"
              >
                {k}
              </button>
            ))}
          </div>

          {/* Call / End Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            {callStatus === 'idle' ? (
              <button
                onClick={handleStartCall}
                className="w-full bg-[#087F5B] hover:bg-[#066749] text-white py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Dial 1800 Toll-Free Call</span>
              </button>
            ) : (
              <button
                onClick={handleEndCall}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            )}
          </div>

        </div>

        {/* Live Call Logs */}
        <div className="bg-white p-3 rounded-2xl border border-[#E2DBD0] text-[11px] font-mono space-y-1 max-h-24 overflow-y-auto">
          <span className="text-[10px] font-bold text-[#5C6E67] block uppercase">Live IVR Terminal:</span>
          {callLog.length === 0 ? (
            <p className="text-[#5C6E67]/60 italic">Press "Dial" to test feature phone voice flow</p>
          ) : (
            callLog.map((log, idx) => (
              <p key={idx} className="text-[#24302C]">• {log}</p>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default IvrSimulator;
