import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoxOwn — Your AI. Your Hardware. Your Data.",
  description: "Local-first AI media processing platform. Transcription, TTS, Voice Cloning, Video Translation, Screen Recording, and Meeting Assistant — all running on your own hardware. Zero cloud dependency.",
  keywords: ["AI", "local AI", "media processing", "transcription", "TTS", "voice cloning", "privacy"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
