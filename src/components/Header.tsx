"use client";

import React, { useState } from "react";
import { Sigma, Share2, Check } from "lucide-react";

interface HeaderProps {
    currentLatex?: string;
}

export function Header({ currentLatex }: HeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
      if (!currentLatex) return;
      
      const url = new URL(window.location.href);
      // Compress/Encode the latex string. 
      // Simple encoding for now:
      url.searchParams.set("code", encodeURIComponent(currentLatex));
      
      try {
          await navigator.clipboard.writeText(url.toString());
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      } catch (err) {
          console.error("Failed to copy link", err);
      }
  };

  return (
    <header className="flex h-16 items-center border-b border-gray-200 bg-white px-6 shadow-sm justify-between">
      <div className="flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sigma className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">Katexed</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
            onClick={handleShare}
            className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
        >
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            <span>{copied ? "Link Copied!" : "Share"}</span>
        </button>
      </div>
    </header>
  );
}
