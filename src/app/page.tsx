"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import 'katex/dist/katex.min.css';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LatexEditor } from "@/components/LatexEditor";
import { LatexPreview } from "@/components/LatexPreview";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const DEFAULT_LATEX = String.raw`% Maxwell's Equations
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\varepsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}

% Schrödinger Equation
i\hbar \frac{\partial}{\partial t} \Psi(\mathbf{r}, t) = \hat{H} \Psi(\mathbf{r}, t)`;

function EditorPage() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code");
  
  // Main latex state
  const [latexInput, setLatexInput] = useLocalStorage<string>("katexed-input", DEFAULT_LATEX);

  // Initialize from URL if present
  useEffect(() => {
    if (initialCode) {
        const decoded = decodeURIComponent(initialCode);
        if (decoded !== latexInput) {
             setLatexInput(decoded);
        }
    }
  }, [initialCode]);

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Katexed",
    "url": "https://romophic.github.io/katexed/",
    "description": "A fast, lightweight, and real-time online LaTeX equation editor.",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "author": {
      "@type": "Person",
      "name": "romophic",
      "url": "https://romophic.com"
    },
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header currentLatex={latexInput} />
      
      <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-hidden">
        <section 
            aria-label="LaTeX Editor Workspace"
            className="mx-auto grid h-[calc(100vh-10rem)] max-w-[1920px] grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {/* Left Column: Editor */}
          <div className="flex flex-col h-full min-h-[400px]" role="region" aria-label="Code Editor">
            <h2 className="sr-only">LaTeX Input</h2>
            <LatexEditor 
              value={latexInput} 
              onChange={(val) => setLatexInput(val || "")}
            />
          </div>

          {/* Right Column: Preview */}
          <div className="flex flex-col h-full min-h-[400px]" role="region" aria-label="Equation Preview">
            <h2 className="sr-only">Equation Preview</h2>
            <LatexPreview latex={latexInput} />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default function Home() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <EditorPage />
        </Suspense>
    );
}