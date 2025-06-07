import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { ArrowLeft } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function DashboardLayout({
  children,
  title = "GERENCIE SEUS",
  subtitle = "CAMPEONATOS",
  breadcrumbs = [{ label: "DASHBOARD", href: "/dashboard" }, { label: "HOME" }],
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen dashboard-bg flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-6 border-b dashboard-border">
          <div className="flex items-center justify-between">
            <div>
              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-2 text-sm mb-4">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <span
                      className={cn(
                        index === breadcrumbs.length - 1
                          ? "text-red-500 font-medium"
                          : "dashboard-text-muted hover:text-white cursor-pointer"
                      )}
                    >
                      {crumb.label}
                    </span>
                    {index < breadcrumbs.length - 1 && (
                      <span className="dashboard-text-muted">{">"}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>

              {/* Title */}
              <div>
                <h1 className="text-3xl font-light dashboard-text-muted">
                  {title}
                </h1>
                <h2 className="text-4xl font-bold text-red-500 mt-1">
                  {subtitle}
                </h2>
              </div>
            </div>

            {/* Back Button */}
            <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Voltar</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <div className="dashboard-card border dashboard-border rounded-lg min-h-[600px] border-red-500/20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
