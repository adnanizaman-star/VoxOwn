"use client";

import { Download, Settings, Sparkles } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Download,
    title: "Install",
    description: "Download and install VoxOwn on your machine. Works on macOS, Windows, and Linux.",
  },
  {
    number: "2",
    icon: Settings,
    title: "Configure",
    description: "Choose your AI models based on your hardware. VoxOwn auto-detects your GPU and optimizes settings.",
  },
  {
    number: "3",
    icon: Sparkles,
    title: "Create",
    description: "Start creating. Upload media, configure options, and let VoxOwn handle the rest — privately.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A1A2E]/30 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 animate-fade-up">
            Get Started in Minutes
          </h2>
          <p className="text-[#9898A6] max-w-xl mx-auto animate-fade-up stagger-1">
            Three simple steps to powerful, private AI media processing.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-[#FF6B35] via-[#7C5CFF] to-[#FF6B35]" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative text-center animate-fade-up stagger-${index + 1}`}
              >
                {/* Step Badge */}
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#1A1A2E] border-2 border-[#FF6B35] flex items-center justify-center animate-pulse-glow">
                    <step.icon className="w-7 h-7 text-[#FF6B35]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{step.number}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-[#F5F5F7] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#9898A6] max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
