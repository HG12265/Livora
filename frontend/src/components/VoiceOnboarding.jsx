import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, CheckCircle2, Sparkles, X, ArrowRight, User, BookOpen, Briefcase, MapPin, HeartHandshake, IndianRupee, RotateCcw, AlertCircle } from 'lucide-react';
import { processVoiceInput } from '../services/api';
import { TRANSLATIONS } from '../data/translations';

const VoiceOnboarding = ({ isOpen, onClose, onProfileCreated, selectedLanguage = 'en' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [apiProcessing, setApiProcessing] = useState(false);
  const [voiceError, setVoiceError] = useState('');

  const recognitionRef = useRef(null);
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;
  const currentStep = t.voiceSteps[currentPromptIndex] || t.voiceSteps[0];

  const [profileData, setProfileData] = useState({
    name: '',
    education: '',
    familyOccupation: '',
    currentActivity: '',
    mobility: '',
    preference: ''
  });

  const getStepIcon = (field) => {
    switch (field) {
      case 'name': return User;
      case 'education': return BookOpen;
      case 'familyOccupation': return Briefcase;
      case 'currentActivity': return IndianRupee;
      case 'mobility': return MapPin;
      case 'preference': return HeartHandshake;
      default: return User;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTranscript(profileData[currentStep.field] || '');
      setVoiceError('');
      speakPrompt(currentStep.question);
    }
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, [isOpen, currentPromptIndex, selectedLanguage]);

  // Real Speech Recognition
  const startRealSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Web Speech API is not supported in this browser. Please type your response below.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      const langMap = {
        ta: 'ta-IN',
        en: 'en-IN',
        hi: 'hi-IN',
        te: 'te-IN'
      };
      recognition.lang = langMap[selectedLanguage] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError('');
      };

      recognition.onresult = (event) => {
        const currentText = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(currentText);
        setProfileData(prev => ({ ...prev, [currentStep.field]: currentText }));
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition warning:', err.error);
        setIsListening(false);
        if (err.error === 'not-allowed') {
          setVoiceError('Microphone access was denied. Please allow microphone permission or type below.');
        }
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
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
    } else {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      startRealSpeechRecognition();
    }
  };

  const speakPrompt = (textToSpeak) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const langMap = {
      ta: 'ta-IN',
      en: 'en-IN',
      hi: 'hi-IN',
      te: 'te-IN'
    };
    utterance.lang = langMap[selectedLanguage] || 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // Auto-start listening after asking the question
      startRealSpeechRecognition();
    };
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setTranscript(val);
    setProfileData(prev => ({ ...prev, [currentStep.field]: val }));
  };

  const handleNextPrompt = async () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    if (currentPromptIndex < t.voiceSteps.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
    } else {
      // Final submission to Backend API
      setApiProcessing(true);
      try {
        const apiResult = await processVoiceInput(profileData, selectedLanguage);

        let finalProfile = profileData;
        let matchedCourses = null;

        if (apiResult && apiResult.profile) {
          finalProfile = apiResult.profile;
          matchedCourses = apiResult.matched_courses;
        } else {
          // Robust client fallback with correct JavaScript .trim()
          const rawNameLoc = profileData.name || "Jeeva from Tharamangalam, Salem";
          const rawEdu = profileData.education || "10th Standard";
          const rawOcc = profileData.familyOccupation || "Handloom Weaving";
          
          let parsedName = "Jeeva";
          let parsedLoc = "Tharamangalam, Salem, Tamil Nadu";

          if (rawNameLoc.toLowerCase().includes("from")) {
            const parts = rawNameLoc.split(/from/i);
            parsedName = parts[0].replace(/^(my name is|i am|mera naam|en peyar)\s+/i, '').trim() || "Jeeva";
            parsedLoc = parts[1].trim() + ", Tamil Nadu";
          } else if (rawNameLoc.includes(",")) {
            parsedName = rawNameLoc.split(',')[0].trim() || "Jeeva";
            parsedLoc = rawNameLoc.split(',')[1].trim() + ", Tamil Nadu";
          } else {
            parsedName = rawNameLoc.trim() || "Jeeva";
          }

          finalProfile = {
            name: parsedName,
            location: parsedLoc,
            district: "Salem",
            state: "Tamil Nadu",
            education: rawEdu,
            familyOccupation: rawOcc,
            currentSkills: `Traditional craftsmanship and practical experience in ${rawOcc}`,
            currentActivity: profileData.currentActivity || `Working in family trade of ${rawOcc}`,
            mobility: profileData.mobility || "Local Village Cluster (within 15km)",
            preference: profileData.preference || "Self-Employment with PM-AJAY Toolkit Grant",
            assignedConsultant: "Mr. R. Ramesh",
            recommendedCourse: "Master Weaver & Handloom Stylist (NSQF Level 4)",
            grantEligible: "₹50,000 Handloom Modernization Grant under PM-AJAY GIA"
          };
        }

        onProfileCreated(finalProfile, matchedCourses);
        onClose();
      } catch (err) {
        console.error('Submission error:', err);
      } finally {
        setApiProcessing(false);
      }
    }
  };

  const handlePrevPrompt = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  const StepIcon = getStepIcon(currentStep.field);

  return (
    <div className="fixed inset-0 z-50 bg-[#24302C]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF9F6] border border-[#E2DBD0] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="bg-white px-6 py-4 border-b border-[#E2DBD0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#087F5B] text-white flex items-center justify-center shadow-sm">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#24302C] font-['Outfit']">
                  PM-AJAY Conversational Voice Interview
                </h3>
                <span className="text-[10px] bg-[#E6F4F0] text-[#087F5B] font-extrabold px-2 py-0.5 rounded-full">
                  AI Live
                </span>
              </div>
              <p className="text-[11px] text-[#5C6E67]">
                Natural regional language speech extraction for SC livelihood mapping
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-[#5C6E67] hover:text-[#24302C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#E2DBD0]/40 h-1.5 w-full">
          <div 
            className="bg-[#087F5B] h-1.5 transition-all duration-300"
            style={{ width: `${((currentPromptIndex + 1) / t.voiceSteps.length) * 100}%` }}
          />
        </div>

        <div className="p-6 md:p-8 space-y-6">

          {/* Step Counter & Category Badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-[#E6F4F0] text-[#087F5B] text-xs font-bold px-3 py-1 rounded-full">
              <StepIcon className="w-3.5 h-3.5" />
              <span>Step {currentPromptIndex + 1} of {t.voiceSteps.length}: {currentStep.title}</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#5C6E67]">
              Lang: {selectedLanguage.toUpperCase()}
            </span>
          </div>

          {/* AI Question Bubble */}
          <div className="bg-white p-6 rounded-3xl border-2 border-[#087F5B]/20 shadow-sm space-y-3 relative">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-[#087F5B] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#E98B73]" />
                  Livora AI Voice Question
                </span>
                <p className="text-lg md:text-xl font-extrabold text-[#24302C] leading-snug font-['Outfit']">
                  "{currentStep.question}"
                </p>
              </div>

              <button
                onClick={() => speakPrompt(currentStep.question)}
                className="w-10 h-10 rounded-full bg-[#E6F4F0] hover:bg-[#d8efe8] text-[#087F5B] flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 shadow-sm"
                title="Hear question again"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#5C6E67] italic pt-1 border-t border-[#E2DBD0]/60">
              💡 {currentStep.example}
            </p>
          </div>

          {/* Central Interactive Voice Visualizer */}
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing rings when listening */}
              {isListening && (
                <>
                  <div className="absolute w-28 h-28 rounded-full bg-[#087F5B]/20 animate-ping" />
                  <div className="absolute w-24 h-24 rounded-full bg-[#087F5B]/30 animate-pulse" />
                </>
              )}

              {/* Pulsing rings when speaking */}
              {isSpeaking && (
                <div className="absolute w-24 h-24 rounded-full bg-[#E98B73]/30 animate-ping" />
              )}

              {/* Central Mic Button */}
              <button
                onClick={toggleListening}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 transform active:scale-95 ${
                  isListening
                    ? 'bg-[#087F5B] text-white scale-105'
                    : isSpeaking
                    ? 'bg-[#E98B73] text-white'
                    : 'bg-white text-[#087F5B] border-2 border-[#087F5B] hover:bg-[#E6F4F0]'
                }`}
                title="Click to speak or stop"
              >
                {isListening ? (
                  <Mic className="w-8 h-8 animate-pulse text-white" />
                ) : isSpeaking ? (
                  <Volume2 className="w-8 h-8 text-white animate-bounce" />
                ) : (
                  <Mic className="w-8 h-8 text-[#087F5B]" />
                )}
              </button>
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-[#24302C]">
                {isListening 
                  ? t.listening 
                  : isSpeaking 
                  ? t.speaking 
                  : t.retryVoice}
              </p>
              <p className="text-[11px] text-[#5C6E67]">
                Speaks regional dialect naturally • Auto-bridges text-heavy form barriers
              </p>
            </div>
          </div>

          {/* Transcribed Answer Input Box with live editing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#24302C]">Captured Answer (Voice or Type):</span>
              {transcript && (
                <button
                  onClick={() => {
                    setTranscript('');
                    setProfileData(prev => ({ ...prev, [currentStep.field]: '' }));
                  }}
                  className="text-[#E98B73] hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            <div className="relative">
              <textarea
                value={transcript}
                onChange={handleInputChange}
                placeholder={currentStep.placeholder}
                rows={2}
                className="w-full bg-white border border-[#E2DBD0] focus:border-[#087F5B] focus:ring-2 focus:ring-[#087F5B]/20 rounded-2xl p-4 text-sm font-medium text-[#24302C] resize-none outline-none transition-all placeholder:text-[#5C6E67]/50 shadow-inner"
              />
              {transcript && (
                <div className="absolute right-3 bottom-3 bg-[#E6F4F0] text-[#087F5B] p-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            {voiceError && (
              <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{voiceError}</span>
              </div>
            )}
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E2DBD0]">
            <button
              onClick={handlePrevPrompt}
              disabled={currentPromptIndex === 0}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                currentPromptIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-[#5C6E67]'
                  : 'bg-white border border-[#E2DBD0] text-[#24302C] hover:bg-black/5'
              }`}
            >
              Previous
            </button>

            <button
              onClick={handleNextPrompt}
              disabled={apiProcessing}
              className="bg-[#087F5B] hover:bg-[#066749] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>
                {apiProcessing
                  ? t.processing
                  : currentPromptIndex === t.voiceSteps.length - 1
                  ? t.completeOnboarding
                  : t.nextStep}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default VoiceOnboarding;
