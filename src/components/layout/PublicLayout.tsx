'use client'
import React from "react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";

interface PublicLayoutProps {
  title: string;
  children: React.ReactNode;
  showBackToHome?: boolean;
}

export default function PublicLayout({ title, children, showBackToHome = true }: PublicLayoutProps) {
  return (
    <>
      <Head>
        <title>{title} - Esports League</title>
      </Head>
      
      <div className="min-h-screen bg-slate-900">
        <Header />

        {/* Page Title */}
        {title && (
          <div className="bg-slate-800 py-2">
            <div className="container mx-auto px-4">
              <h1 className="text-lg text-white font-medium">{title}</h1>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main>
          {children}
        </main>

        <Footer />
      </div>
    </>
  );
}