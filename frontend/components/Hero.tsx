"use client";

import { ArrowRight, Shield, Cpu } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradient Orb */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#FF6B35]/20 via-[#7C5CFF]/10 to-transparent blur-3xl animate-gradient" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#7C5CFF]/15 to-transparent blur-3xl animate-float" />
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#F5F5F7 1px, transparent 1px), linear-gradient(90deg, #F5F5F7 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-up">
          <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
          <span className="text-sm text-[#9898A6]">100% Local</span>
          <span className="text-[#5C5C6E]">•</span>
          <span className="text-sm text-[#9898A6]">Zero Cloud</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-up stagger-1">
          Your AI.
          <br />
          <span className="gradient-text">Your Hardware.</span>
          <br />
          Your Data.
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-[#9898A6] max-w-2xl mx-auto mb-10 animate-fade-up stagger-2">
          Powerful AI media processing — transcription, voice synthesis, video translation, and more — 
          all running privately on your own machine.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up stagger-3">
          <a
            href="/dashboard"
            className="btn btn-primary btn-lg group"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#how-it-works"
            className="btn btn-secondary btn-lg"
          >
            See How It Works
          </a>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-up stagger-4">
          {[
            { icon: Shield, text: "Private by Design" },
            { icon: Cpu, text: "Runs Locally" },
            { icon: Zap, text: "Fast Processing" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A2E]/50 border border-[#2D2D4A]"
            >
              <Icon className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-sm text-[#9898A6]">{text}</span>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-[#2D2D4A] flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-[#FF6B35] animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
