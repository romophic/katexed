"use client";

import React, { useEffect } from "react";
import Editor, { loader } from "@monaco-editor/react";

interface LatexEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

export function LatexEditor({ value, onChange }: LatexEditorProps) {
  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.languages.register({ id: "latex" });
      // Tokenizer temporarily removed to fix build issues
    });
  }, []);

  const editorOptions = {
    minimap: { enabled: false },
    wordWrap: "on" as const,
    lineNumbers: "on" as const,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: { top: 16, bottom: 16 },
    fontSize: 14,
    fontFamily: "Geist Mono, monospace",
  };

  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <div className="flex h-10 items-center justify-between border-b border-gray-100 bg-gray-50 px-4">
        <span className="text-sm font-medium text-gray-500">LaTeX Source</span>
      </div>
      <div className="h-[calc(100%-2.5rem)]">
        <Editor
          height="100%"
          defaultLanguage="latex"
          value={value}
          onChange={onChange}
          theme="light"
          options={editorOptions}
        />
      </div>
    </div>
  );
}