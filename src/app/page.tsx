"use client"; // 必須

import { useState, useRef, useEffect } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import MonacoEditor, { loader } from "@monaco-editor/react";
import html2canvas from 'html2canvas';

export default function Home() {
  const [latexInput, setLatexInput] = useState('i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r}, t) = \\hat{H} \\Psi(\\mathbf{r}, t)');
  const outputRef = useRef<HTMLDivElement>(null);

  const editorOptions = {
    selectOnLineNumbers: true,
    minimap: {
      enabled: true,
    },
    automaticLayout: true,
  };

  const onChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      setLatexInput(newValue);
    }
  };

  const saveAsImage = () => {
    if (outputRef.current) {
      html2canvas(outputRef.current, {
        scale: 2, // 解像度を向上させるためのスケール
        useCORS: true, // CORSの設定
        backgroundColor: null, // 背景を透明にする
      }).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'latex-output.png';
        link.click();
      });
    }
  };

  const saveAsSVG = () => {
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="100">
        <text x="10" y="20" font-family="Verdana" font-size="20" fill="black">
          ${latexInput.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </text>
      </svg>`;

    const link = document.createElement('a');
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    link.href = URL.createObjectURL(blob);
    link.download = 'latex-output.svg';
    link.click();
  };

  useEffect(() => {
    // MonacoEditorの初期化
    loader.init().then(monaco => {
      // LaTeXのカスタム定義を登録
      monaco.languages.register({ id: 'latex' });

      // シンタックスハイライトの定義
      monaco.languages.setMonarchTokensProvider('latex', {
        tokenizer: {
          root: [
            [/\\[a-zA-Z]+/, 'keyword'],   // LaTeXコマンド
            [/\$.*?\$/, 'string'],        // 数式 (inline math)
            [/%.*$/, 'comment'],          // コメント
            [/[{}]/, 'delimiter'],        // 括弧
          ],
        },
      });

      // 言語の設定
      monaco.languages.setLanguageConfiguration('latex', {
        brackets: [
          ['{', '}'],
          ['(', ')'],
          ['[', ']'],
        ],
      });
    });
  }, []); // 空の依存配列を指定して初回レンダリング時のみ実行

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-grow">
        <MonacoEditor
          width="100%"
          height="100%"
          language="latex"
          theme="vs-dark"
          value={latexInput}
          options={editorOptions}
          onChange={onChange}
        />
      </div>
      <div className="p-6 bg-white rounded-lg shadow-lg mt-4 mx-4 border border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-center">Output</h2>
        <div ref={outputRef} className="flex">
          <div className="flex-grow mr-4">
            <h3 className="text-xl font-semibold mb-2">Block Output</h3>
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-400">
              <BlockMath>{latexInput}</BlockMath>
            </div>
          </div>
          <div className="flex-none">
            <h3 className="text-xl font-semibold mb-2">Inline Output</h3>
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-400">
              <span className="text-lg">
                <InlineMath>{latexInput}</InlineMath>
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button onClick={saveAsImage} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">
            Save as Image
          </button>
          <button onClick={saveAsSVG} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Save as SVG
          </button>
        </div>
      </div>
    </div>
  );
}
