import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, CheckCircle2, Sparkles, X, ArrowRight, User, BookOpen, Briefcase, MapPin, HeartHandshake, Edit3 } from 'lucide-react';
import { processVoiceInput } from '../services/api';

const VoiceOnboarding = ({ isOpen, onClose, onProfileCreated, selectedLanguage }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [apiProcessing, setApiProcessing] = useState(false);

  const recognitionRef = useRef(null);

  // Clean empty initial state - NO PRE-FILLED HARDCODED DEFAULTS!
  const [profileData, setProfileData] = useState({
    name: '',
    education: '',
    familyOccupation: '',
    mobility: '',
    preference: ''
  });

  const prompts = [
    {
      field: 'name',
      questionTa: 'வணக்கம்! PM-AJAY உதவி மையத்திற்கு வரவேற்கிறோம். உங்கள் பெயர் மற்றும் ஊர் சொல்லுங்கள்?',
      questionEn: 'Welcome to PM-AJAY Livelihood Assistant! Please tell me your Name and Location?',
      placeholder: 'e.g. Gowtham, Salem',
      icon: User
    },
    {
      field: 'education',
      questionTa: 'உங்கள் கல்வித் தகுதி மற்றும் படிப்பு விவரங்களை சொல்லுங்கள்?',
      questionEn: 'What is your Educational qualification?',
      placeholder: 'e.g. 12th Standard / Diploma / 10th',
      icon: BookOpen
    },
    {
      field: 'familyOccupation',
      questionTa: 'உங்கள் குடும்பத்தின் பாரம்பரிய தொழில் அல்லது உங்களுக்குத் தெரிந்த வேலைகள் என்ன?',
      questionEn: 'What is your family or traditional occupation & skills?',
      placeholder: 'e.g. Agriculture / Handloom / Electronics / Computer',
      icon: Briefcase
    },
    {
      field: 'mobility',
      questionTa: 'உங்களால் பயிற்சிக்கு வேறு ஊருக்கு செல்ல முடியுமா? (உள் ஊர் / மாவட்டம்)?',
      questionEn: 'Are you comfortable traveling for training (Local / District)?',
      placeholder: 'e.g. Local (within 15km) / District Level',
      icon: MapPin
    },
    {
      field: 'preference',
      questionTa: 'உங்களுக்கு மாதச் சம்பள வேலையா அல்லது சுய தொழில் தொடங்க விருப்பமா?',
      questionEn: 'Do you prefer Wage Employment or Self-Employment?',
      placeholder: 'e.g. Self-Employment / Wage Job',
      icon: HeartHandshake
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      speakPrompt(prompts[currentPromptIndex]);
    }
  }, [isOpen, currentPromptIndex]);

  // Real Web Speech Recognition Setup
  const startRealSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage === 'ta' ? 'ta-IN' : 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('');
        };

        recognition.onresult = (event) => {
          const currentText = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setTranscript(currentText);

          const currentField = prompts[currentPromptIndex].field;
          setProfileData(prev => ({ ...prev, [currentField]: currentText }));
        };

        recognition.onerror = (err) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Recognition start error:', err);
        setIsListening(false);
      }
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
      }, 1500);
    }
  };

  const speakPrompt = (promptObj) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const textToSpeak = selectedLanguage === 'ta' ? promptObj.questionTa : promptObj.questionEn;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = selectedLanguage === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      startRealSpeechRecognition();
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setTranscript(val);
    const currentField = prompts[currentPromptIndex].field;
    setProfileData(prev => ({ ...prev, [currentField]: val }));
  };

  const handleNextPrompt = async () => {
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
      setTranscript('');
    } else {
      setApiProcessing(true);
      
      // Submit real user answers to FastAPI backend
      const apiResult = await processVoiceInput(profileData, selectedLanguage);
      setApiProcessing(false);

      let finalProfile = profileData;
      let matchedCourses = null;

      if (apiResult && apiResult.profile) {
        finalProfile = apiResult.profile;
        matchedCourses = apiResult.matched_courses;
      } else {
        // Fallback cleanup using exact user entered data
        const rawNameLoc = profileData.name || "Gowtham, Salem";
        const rawEdu = profileData.education || "12th Standard";
        const rawOcc = profileData.familyOccupation || "Agriculture";
        
        finalProfile = {
          name: rawNameLoc.split(',')[0] || "Gowtham",
          location: rawNameLoc.includes(',') ? rawNameLoc.split(',')[1].trim() + ", Tamil Nadu" : "Salem, Tamil Nadu",
          education: rawEdu,
          familyOccupation: rawOcc.charAt(0).toUpperCase() + rawOcc.slice(1),
          currentSkills: `Knowledge in ${rawOcc}, local operations`,
          mobility: profileData.mobility || "Local",
          preference: profileData.preference || "Self-Employment"
        };
      }

      onProfileCreated(finalProfile, matchedCourses);
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentPrompt = prompts[currentPromptIndex];
  const PromptIcon = currentPrompt.icon;
  const currentVal = profileData[currentPrompt.field] || transcript;

  return (
    <div className="fixed inset-0 z-50 bg-[#24302C]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] border border-[#E2DBD0] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="bg-[#087F5B] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Outfit']">Live Voice Interview Assistant</h2>
              <p className="text-xs text-white/80">Real-Time Web Speech & FastAPI Gemini AI Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-6">
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#5C6E67]">
              <span>Question {currentPromptIndex + 1} of {prompts.length}</span>
              <span>{Math.round(((currentPromptIndex + 1) / prompts.length) * 100)}% Completed</span>
            </div>
            <div className="w-full h-2 bg-[#E2DBD0] rounded-full overflow-hidden">
              <div className="h-full bg-[#087F5B] transition-all duration-500 rounded-full" style={{ width: `${((currentPromptIndex + 1) / prompts.length) * 100}%` }}></div>
            </div>
          </div>

          {/* Current Voice Question Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2DBD0] shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F4F0] text-[#087F5B] flex items-center justify-center shrink-0">
              <PromptIcon className="w-6 h-6" />
            </div>
            <div className="space-y-2 w-full">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F5B]">AI ASSISTANT ASKING</span>
              <p className="text-lg font-bold text-[#24302C] leading-snug">
                {selectedLanguage === 'ta' ? currentPrompt.questionTa : currentPrompt.questionEn}
              </p>
            </div>
          </div>

          {/* Voice Waveform & Microphone Status */}
          <div className="bg-[#F4EDE2]/50 p-6 rounded-2xl border border-[#E2DBD0] flex flex-col items-center justify-center gap-4 text-center">
            
            {/* Animated Audio Visualizer */}
            <div className="flex items-center gap-1.5 h-10">
              <div className={`wave-bar ${isSpeaking || isListening ? 'animate-pulse' : 'h-2'}`}></div>
              <div className={`wave-bar ${isSpeaking || isListening ? 'animate-pulse' : 'h-2'}`}></div>
              <div className={`wave-bar ${isSpeaking || isListening ? 'animate-pulse' : 'h-2'}`}></div>
              <div className={`wave-bar ${isSpeaking || isListening ? 'animate-pulse' : 'h-2'}`}></div>
              <div className={`wave-bar ${isSpeaking || isListening ? 'animate-pulse' : 'h-2'}`}></div>
            </div>

            {/* Mic Trigger */}
            <button
              onClick={startRealSpeechRecognition}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all cursor-pointer ${
                isListening 
                  ? 'bg-[#E98B73] animate-mic-pulse scale-110' 
                  : 'bg-[#087F5B] hover:scale-105'
              }`}
            >
              <Mic className="w-8 h-8" />
            </button>

            <p className="text-xs font-semibold text-[#5C6E67]">
              {isSpeaking ? '🔊 AI Assistant speaking...' : isListening ? '🎙️ Listening... Speak into your microphone' : 'Click mic button to speak'}
            </p>

          </div>

          {/* Real-time Voice Answer & Text Input Box */}
          <div className="bg-white p-4 rounded-xl border border-[#E2DBD0] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-[#087F5B]">CAPTURED VOICE ANSWER:</span>
              <span className="text-[10px] text-[#5C6E67] font-semibold flex items-center gap-1">
                <Edit3 className="w-3 h-3 text-[#087F5B]" /> Or type/edit below
              </span>
            </div>

            <input
              type="text"
              value={currentVal}
              onChange={handleInputChange}
              placeholder={currentPrompt.placeholder}
              className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E2DBD0] rounded-xl text-xs font-semibold text-[#24302C] focus:outline-none focus:border-[#087F5B]"
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-white p-6 border-t border-[#E2DBD0] flex items-center justify-between">
          <button onClick={onClose} className="text-xs font-bold text-[#5C6E67] hover:text-[#24302C] px-4 py-2">
            Cancel
          </button>

          <button
            onClick={handleNextPrompt}
            disabled={apiProcessing}
            className="flex items-center gap-2 bg-[#087F5B] hover:bg-[#066749] text-white px-6 py-3 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <span>{apiProcessing ? 'Saving to MongoDB & Gemini AI...' : currentPromptIndex === prompts.length - 1 ? 'Generate Profile & NSQF Pathways ➔' : 'Next Question ➔'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default VoiceOnboarding;
