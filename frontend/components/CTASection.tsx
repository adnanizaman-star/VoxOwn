"use client";

import { ArrowRight, Github } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* CTA Card */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/20 via-[#7C5CFF]/10 to-[#FF6B35]/20 animate-gradient" />
          <div className="absolute inset-0 bg-[#1A1A2E]/80" />

          {/* Content */}
          <div className="relative z-10 text-center py-16 px-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 animate-fade-up">
              Ready to Own Your AI?
            </h2>
            <p className="text-[#9898A6] max-w-xl mx-auto mb-8 animate-fade-up stagger-1">
              Join thousands of users who've taken back control of their AI workflow. 
              Free forever, no cloud required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up stagger-2">
              <a
                href="/dashboard"
                className="btn btn-primary btn-lg group"
              >
                Start Using VoxOwn
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-[#5C5C6E] animate-fade-up stagger-3">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
                Open Source
              </span>
              <span>•</span>
              <span>No Data Collection</span>
              <span>•</span>
              <span>Privacy First</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
