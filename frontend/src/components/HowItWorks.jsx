import React from 'react';
import { Mic, Brain, Target, UserCheck, ArrowRight } from 'lucide-react';

const HowItWorks = ({ onStartStep }) => {
  const steps = [
    {
      stepNum: "1",
      title: "1. Speak",
      desc: "Share your details in your language.",
      icon: Mic,
      iconBg: "bg-[#E6F4F0]",
      iconColor: "text-[#087F5B]",
      actionStep: 1
    },
    {
      stepNum: "2",
      title: "2. Get Profile",
      desc: "AI understands and creates your profile.",
      icon: Brain,
      iconBg: "bg-[#FDF1EE]",
      iconColor: "text-[#E98B73]",
      actionStep: 2
    },
    {
      stepNum: "3",
      title: "3. Explore Options",
      desc: "Find suitable skill training and opportunities.",
      icon: Target,
      iconBg: "bg-[#E6F4F0]",
      iconColor: "text-[#087F5B]",
      actionStep: 3
    },
    {
      stepNum: "4",
      title: "4. Take Action",
      desc: "Connect with training and get support.",
      icon: UserCheck,
      iconBg: "bg-[#FDF1EE]",
      iconColor: "text-[#E98B73]",
      actionStep: 4
    }
  ];

  return (
    <section id="how-it-works" className="bg-[#FAF9F6] py-12 border-t border-[#E2DBD0]/60 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-10">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#087F5B] font-['Outfit']">
            HOW IT WORKS
          </p>
        </div>

        {/* 4 Steps Horizontal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div 
                key={step.stepNum}
                onClick={() => onStartStep && onStartStep(step.actionStep)}
                className="group bg-white p-6 rounded-2xl border border-[#E2DBD0] hover:border-[#087F5B] hover:shadow-md transition-all cursor-pointer relative"
              >
                
                {/* Step Icon */}
                <div className={`w-14 h-14 rounded-full ${step.iconBg} flex items-center justify-center ${step.iconColor} mb-5 group-hover:scale-110 transition-transform`}>
                  <StepIcon className="w-7 h-7" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#24302C] mb-2 font-['Outfit'] group-hover:text-[#087F5B] transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#5C6E67] font-normal leading-relaxed">
                  {step.desc}
                </p>

                {/* Connector Arrow for non-last items */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-5 top-1/2 -translate-y-1/2 z-10 text-[#C4BBB0]">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
