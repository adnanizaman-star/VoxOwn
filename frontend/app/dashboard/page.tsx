"use client";

import { useState } from "react";
import {
  Mic,
  Volume2,
  Users,
  Video,
  Monitor,
  Calendar,
  Settings,
  History,
  Activity,
  ChevronLeft,
  ChevronRight,
  Upload,
  FolderOpen,
  Bell,
  User,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Quick action features
const quickActions = [
  { id: "transcription", icon: Mic, label: "Transcription", status: "ready" },
  { id: "tts", icon: Volume2, label: "Text-to-Speech", status: "ready" },
  { id: "voice-cloning", icon: Users, label: "Voice Cloning", status: "ready" },
  { id: "video-translation", icon: Video, label: "Video Translation", status: "ready" },
  { id: "screen-recording", icon: Monitor, label: "Screen Recording", status: "ready" },
  { id: "meeting-assistant", icon: Calendar, label: "Meeting Assistant", status: "ready" },
];

// Recent projects
const recentProjects = [
  { id: 1, name: "Podcast Episode 3", type: "Transcription", date: "2 hours ago", duration: "45 min" },
  { id: 2, name: "Product Demo Reel", type: "Video Translation", date: "Yesterday", duration: "12 min" },
  { id: 3, name: "CEO Voice Clone", type: "Voice Cloning", date: "3 days ago", duration: "—" },
  { id: 4, name: "Team Standup", type: "Meeting Summary", date: "1 week ago", duration: "30 min" },
];

// System stats mock
const systemStats = {
  gpu: 23,
  ram: 47,
  modelsReady: true,
};

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const navItems = [
    { id: "dashboard", icon: Activity, label: "Dashboard" },
    { id: "projects", icon: FolderOpen, label: "Projects" },
    { id: "history", icon: History, label: "History" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-[#0D0D0D]">
      {/* Sidebar */}
      <aside
        className={`relative flex flex-col border-r border-[#2D2D4A] bg-[#0D0D0D] transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[#2D2D4A]">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#7C5CFF] flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-bold text-[#F5F5F7]">VoxOwn</span>
            )}
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30"
                  : "text-[#9898A6] hover:text-[#F5F5F7] hover:bg-[#1A1A2E]"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[#2D2D4A]">
          <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
            <div className="w-10 h-10 rounded-full bg-[#1A1A2E] border border-[#2D2D4A] flex items-center justify-center">
              <User className="w-5 h-5 text-[#9898A6]" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F5F5F7] truncate">Local User</p>
                <p className="text-xs text-[#5C5C6E]">Premium Plan</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1A1A2E] border border-[#2D2D4A] flex items-center justify-center text-[#9898A6] hover:text-[#F5F5F7] transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-[#2D2D4A] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#F5F5F7]">Dashboard</h1>
              <p className="text-sm text-[#5C5C6E]">Welcome back — your AI is ready</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-xl bg-[#1A1A2E] border border-[#2D2D4A] text-[#9898A6] hover:text-[#F5F5F7] transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF6B35]" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* GPU Usage */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#9898A6]">GPU Usage</span>
                <span className="badge badge-success">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#F5F5F7]">{systemStats.gpu}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#1A1A2E] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FF6B35] to-[#7C5CFF] transition-all duration-500"
                    style={{ width: `${systemStats.gpu}%` }}
                  />
                </div>
              </div>
            </div>

            {/* RAM Usage */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#9898A6]">RAM Usage</span>
                <span className="badge badge-success">
                  <CheckCircle2 className="w-3 h-3" />
                  Healthy
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#F5F5F7]">{systemStats.ram}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#1A1A2E] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#4ADE80] to-[#22D3EE] transition-all duration-500"
                    style={{ width: `${systemStats.ram}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Models Status */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#9898A6]">AI Models</span>
                {systemStats.modelsReady ? (
                  <span className="badge badge-success">
                    <CheckCircle2 className="w-3 h-3" />
                    Ready
                  </span>
                ) : (
                  <span className="badge badge-warning">
                    <AlertCircle className="w-3 h-3" />
                    Downloading
                  </span>
                )}
              </div>
              <p className="text-sm text-[#5C5C6E]">
                All models loaded and ready for inference
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-[#F5F5F7] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="card p-4 flex flex-col items-center gap-3 text-center hover:border-[#FF6B35]/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1A1A2E] group-hover:bg-[#FF6B35]/10 transition-colors flex items-center justify-center">
                    <action.icon className="w-6 h-6 text-[#FF6B35]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F5F5F7]">{action.label}</p>
                    <p className="text-xs text-[#4ADE80] capitalize">{action.status}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div className="card p-8 border-dashed border-2 border-[#2D2D4A] hover:border-[#FF6B35]/50 transition-colors">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-[#FF6B35]" />
              </div>
              <h3 className="text-lg font-semibold text-[#F5F5F7] mb-2">
                Drop files here to start
              </h3>
              <p className="text-sm text-[#5C5C6E] mb-4">
                or click to browse your files
              </p>
              <button className="btn btn-primary btn-md">
                Choose Files
              </button>
              <p className="text-xs text-[#5C5C6E] mt-4">
                Supports: MP3, WAV, MP4, MOV, M4A • Max 2GB per file
              </p>
            </div>
          </div>

          {/* Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#F5F5F7]">Recent Projects</h2>
              <button className="text-sm text-[#FF6B35] hover:underline">
                View All
              </button>
            </div>
            <div className="card overflow-hidden">
              <div className="divide-y divide-[#2D2D4A]">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 flex items-center justify-between hover:bg-[#1A1A2E]/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#1A1A2E] flex items-center justify-center">
                        <Mic className="w-5 h-5 text-[#9898A6]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#F5F5F7]">{project.name}</p>
                        <p className="text-xs text-[#5C5C6E]">{project.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#5C5C6E]">{project.date}</p>
                      <p className="text-xs text-[#9898A6]">{project.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
