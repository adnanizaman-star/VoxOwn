"use client";

import { Mic, Volume2, Users, Video, Monitor, Calendar } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Transcription",
    description: "Convert speech to text with high accuracy. Support for multiple languages and speakers.",
  },
  {
    icon: Volume2,
    title: "Text-to-Speech",
    description: "Natural-sounding AI voices for narration, accessibility, and creative projects.",
  },
  {
    icon: Users,
    title: "Voice Cloning",
    description: "Create a digital replica of any voice. Speak with your own voice in any language.",
  },
  {
    icon: Video,
    title: "Video Translation",
    description: "Translate videos to any language while preserving the original speaker's voice.",
  },
  {
    icon: Monitor,
    title: "Screen Recording",
    description: "Capture your screen with built-in AI annotations and instant processing.",
  },
  {
    icon: Calendar,
    title: "Meeting Assistant",
    description: "Automatically transcribe, summarize, and action items from your meetings.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 animate-fade-up">
            Everything You Need,
            <br />
            <span className="gradient-text">Nothing You Don't</span>
          </h2>
          <p className="text-[#9898A6] max-w-2xl mx-auto animate-fade-up stagger-1">
            A complete suite of AI media tools, all running locally on your hardware. 
            No subscriptions, no data collection, no compromises.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`card p-6 animate-fade-up stagger-${index + 1}`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B35]/20 to-[#7C5CFF]/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <h3 className="text-lg font-semibold text-[#F5F5F7] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#9898A6] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
