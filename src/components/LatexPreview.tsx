"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { BlockMath, InlineMath } from "react-katex";
import { toPng, toSvg, toBlob } from "html-to-image";
import { Image as ImageIcon, FileCode, Settings2, X, AlertCircle, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Katex from "katex";

interface LatexPreviewProps {
  latex: string;
}

export function LatexPreview({ latex }: LatexPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"block" | "inline">("block");
  const [scale, setScale] = useState<number>(3);
  const [isTransparent, setIsTransparent] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [textColor, setTextColor] = useState<string>("#171717"); // Default text color

  const downloadImage = useCallback(async (format: "png" | "svg") => {
    if (contentRef.current === null) {
      return;
    }

    try {
      const options = { 
        backgroundColor: isTransparent ? undefined : '#ffffff',
        skipAutoScale: true,
        pixelRatio: scale,
        style: {
             padding: '20px',
             margin: '0',
             color: textColor, // Ensure color is applied during capture
        }
      };

      // Type assertion to bypass strict library types if necessary
      const finalOptions = options;

      let dataUrl;
      if (format === 'png') {
        dataUrl = await toPng(contentRef.current, finalOptions);
      } else {
        dataUrl = await toSvg(contentRef.current, finalOptions);
      }

      const link = document.createElement('a');
      link.download = `equation.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    }
  }, [contentRef, scale, isTransparent, textColor]);

  const copyImageToClipboard = useCallback(async () => {
    if (contentRef.current === null) return;

    setCopyStatus("idle");
    try {
      const blob = await toBlob(contentRef.current, {
        backgroundColor: isTransparent ? undefined : '#ffffff',
        skipAutoScale: true,
        pixelRatio: scale,
        style: {
          padding: '20px',
          margin: '0',
          color: textColor,
        }
      });

      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        setCopyStatus("copied");
        setTimeout(() => setCopyStatus("idle"), 2000);
      }
    } catch (err) {
      console.error("Failed to copy image", err);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  }, [contentRef, scale, isTransparent, textColor]);

  // Check for errors in useEffect to avoid render loops
  useEffect(() => {
    try {
        Katex.renderToString(latex, { 
            throwOnError: true, 
            displayMode: mode === 'block' 
        });
        setError(null);
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        setError(errorMessage.replace("KaTeX parse error: ", ""));
    }
  }, [latex, mode]);

  return (
    <div className="flex h-full flex-col rounded-md border border-gray-200 bg-white shadow-sm relative">
      <div className="flex h-10 items-center justify-between border-b border-gray-100 bg-gray-50 px-4">
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500">Preview</span>
             <div className="flex rounded-lg bg-gray-200 p-0.5">
                <button
                    onClick={() => setMode("block")}
                    className={cn(
                        "rounded-md px-2 py-0.5 text-xs font-medium transition-all",
                        mode === "block" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Block
                </button>
                <button
                    onClick={() => setMode("inline")}
                    className={cn(
                        "rounded-md px-2 py-0.5 text-xs font-medium transition-all",
                        mode === "inline" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Inline
                </button>
            </div>
        </div>
      </div>

      {/* Error Message Toast */}
      {error && (
        <div className="absolute top-12 left-4 right-4 z-20 flex items-start space-x-2 rounded-md bg-red-50 p-3 text-red-900 shadow-sm border border-red-200 animate-in fade-in slide-in-from-top-2">
           <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
           <div className="text-sm font-medium break-all">{error}</div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
          <div className="absolute bottom-12 right-4 z-10 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Export Settings</h3>
                  <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-500">
                      <X className="h-4 w-4" />
                  </button>
              </div>
              <div className="space-y-4">
                  <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">Image Scale (Resolution)</label>
                      <div className="grid grid-cols-4 gap-2">
                          {[1, 2, 3, 4].map((s) => (
                              <button
                                  key={s}
                                  onClick={() => setScale(s)}
                                  className={cn(
                                      "flex items-center justify-center rounded-md border py-1 text-xs font-medium transition-colors",
                                      scale === s
                                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                  )}
                              >
                                  {s}x
                              </button>
                          ))}
                      </div>
                  </div>
                  
                  {/* Text Color Selection */}
                  <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">Text Color</label>
                      <div className="flex items-center space-x-2">
                          <button
                              onClick={() => setTextColor("#171717")}
                              className={cn(
                                  "h-6 w-6 rounded-full border border-gray-300 bg-[#171717] focus:outline-none focus:ring-2 focus:ring-offset-2",
                                  textColor === "#171717" ? "ring-2 ring-indigo-500 ring-offset-1" : ""
                              )}
                              title="Black"
                          />
                          <button
                              onClick={() => setTextColor("#ffffff")}
                              className={cn(
                                  "h-6 w-6 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2",
                                  textColor === "#ffffff" ? "ring-2 ring-indigo-500 ring-offset-1" : ""
                              )}
                              title="White"
                          />
                          <div className="relative flex items-center">
                              <input 
                                type="color" 
                                value={textColor} 
                                onChange={(e) => setTextColor(e.target.value)}
                                className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0 opacity-0 absolute inset-0 z-10" 
                              />
                               <div className={cn(
                                   "h-6 w-8 rounded border border-gray-300 flex items-center justify-center text-[10px] font-mono text-gray-500 bg-gray-50",
                                   textColor !== "#171717" && textColor !== "#ffffff" ? "border-indigo-500 ring-1 ring-indigo-500" : ""
                               )}>
                                   Custom
                               </div>
                               <div 
                                    className="ml-2 h-4 w-4 rounded-full border border-gray-200" 
                                    style={{ backgroundColor: textColor }}
                               />
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center justify-between">
                       <label className="text-xs font-medium text-gray-500">Transparent Background</label>
                       <button
                           onClick={() => setIsTransparent(!isTransparent)}
                           className={cn(
                               "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
                               isTransparent ? "bg-indigo-600" : "bg-gray-200"
                           )}
                       >
                           <span
                               aria-hidden="true"
                               className={cn(
                                   "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                   isTransparent ? "translate-x-4" : "translate-x-0"
                               )}
                           />
                       </button>
                  </div>
              </div>
          </div>
      )}

      {/* Preview Area */}
      <div className="flex flex-grow items-center justify-center overflow-auto p-8 bg-white transition-colors duration-200" 
           ref={containerRef}
           style={{ backgroundColor: isTransparent ? '#f3f4f6' : '#ffffff' }} // Show faint background if transparent mode is on, to see white text
        >
        <div className="inline-block" ref={contentRef} style={{ color: textColor }}>
            <div className="text-2xl p-4">
                {mode === "block" ? (
                    <BlockMath errorColor="#cc0000" renderError={(err) => {
                        return <span className="text-red-600 font-mono text-sm">{err.message}</span>
                    }}>{latex}</BlockMath>
                ) : (
                    <InlineMath errorColor="#cc0000" renderError={(err) => {
                        return <span className="text-red-600 font-mono text-sm">{err.message}</span>
                    }}>{latex}</InlineMath>
                )}
            </div>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-gray-100 bg-gray-50 px-4 py-2 space-x-2">
         <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
                "inline-flex items-center justify-center rounded-md p-1.5 transition-colors mr-2",
                 showSettings || isTransparent || textColor !== "#171717" ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:bg-gray-200"
            )}
            title="Export Settings"
        >
            <Settings2 className="h-5 w-5" />
        </button>
        <button
          onClick={copyImageToClipboard}
          className={cn(
            "inline-flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium shadow-sm ring-1 ring-inset transition-all",
            copyStatus === "copied" 
              ? "bg-green-50 text-green-700 ring-green-300" 
              : copyStatus === "error"
              ? "bg-red-50 text-red-700 ring-red-300"
              : "bg-white text-gray-700 ring-gray-300 hover:bg-gray-50"
          )}
        >
          {copyStatus === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span>{copyStatus === "copied" ? "Copied!" : "Copy PNG"}</span>
        </button>
        <button
          onClick={() => downloadImage("png")}
          className="inline-flex items-center space-x-2 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          title="Download as PNG"
        >
          <ImageIcon className="h-4 w-4" />
          <span>PNG</span>
        </button>
        <button
          onClick={() => downloadImage("svg")}
          className="inline-flex items-center space-x-2 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          title="Download as SVG"
        >
          <FileCode className="h-4 w-4" />
          <span>SVG</span>
        </button>
      </div>
    </div>
  );
}
