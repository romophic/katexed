"use client"; // 必須

import { useState, useEffect, useRef } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import MonacoEditor, { loader } from "@monaco-editor/react";
import html2canvas from 'html2canvas';

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
    ],
  });

  // 自動補完の設定
  monaco.languages.registerCompletionItemProvider('latex', {
    provideCompletionItems: () => {
      const suggestions = [
        {
          label: '\\frac',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\frac{numerator}{denominator}',
          documentation: 'Fraction command',
        },
        {
          label: '\\sqrt',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\sqrt{radicand}',
          documentation: 'Square root command',
        },
        {
          label: '\\int',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\int_{lower}^{upper}',
          documentation: 'Integral command',
        },
        {
          label: '\\sum',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\sum_{i=1}^{n} i',
          documentation: 'Summation command',
        },
        {
          label: '\\prod',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\prod_{i=1}^{n} i',
          documentation: 'Product command',
        },
        {
          label: '\\lim',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\lim_{x \\to 0} f(x)',
          documentation: 'Limit command',
        },
        {
          label: '\\sin',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\sin{x}',
          documentation: 'Sine function',
        },
        {
          label: '\\cos',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\cos{x}',
          documentation: 'Cosine function',
        },
        {
          label: '\\tan',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\tan{x}',
          documentation: 'Tangent function',
        },
        {
          label: '\\log',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\log_{base}(x)',
          documentation: 'Logarithm command',
        },
        {
          label: '\\exp',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\exp{x}',
          documentation: 'Exponential function',
        },
        {
          label: '\\sum_{n=1}^{\\infty}',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\sum_{n=1}^{\\infty} a_n',
          documentation: 'Infinite summation',
        },
        {
          label: '\\lim_{n \\to \\infty}',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\lim_{n \\to \\infty} f(n)',
          documentation: 'Limit at infinity',
        },
        {
          label: '\\pm',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\pm',
          documentation: 'Plus-minus symbol',
        },
        {
          label: '\\times',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\times',
          documentation: 'Multiplication symbol',
        },
        {
          label: '\\div',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\div',
          documentation: 'Division symbol',
        },
        {
          label: '\\rightarrow',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\rightarrow',
          documentation: 'Right arrow',
        },
        {
          label: '\\leftarrow',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\leftarrow',
          documentation: 'Left arrow',
        },
        {
          label: '\\Leftrightarrow',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\Leftrightarrow',
          documentation: 'Double arrow',
        },
        {
          label: '\\forall',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\forall x',
          documentation: 'Universal quantifier',
        },
        {
          label: '\\exists',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\exists x',
          documentation: 'Existential quantifier',
        },
        {
          label: '\\nabla',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\nabla',
          documentation: 'Del operator',
        },
        {
          label: '\\partial',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\partial',
          documentation: 'Partial derivative symbol',
        },
        {
          label: '\\textbf',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\textbf{text}',
          documentation: 'Bold text',
        },
        {
          label: '\\textit',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\textit{text}',
          documentation: 'Italic text',
        },
        {
          label: '\\underline',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\underline{text}',
          documentation: 'Underlined text',
        },
        {
          label: '\\overline',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\overline{text}',
          documentation: 'Overlined text',
        },
        {
          label: '\\begin',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\begin{environment}\n    \n\\end{environment}',
          documentation: 'Begin an environment',
        },
        {
          label: '\\end',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\end{environment}',
          documentation: 'End an environment',
        },
        {
          label: '\\item',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\item ',
          documentation: 'List item command',
        },
        {
          label: '\\begin{enumerate}',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\begin{enumerate}\n    \\item \n\\end{enumerate}',
          documentation: 'Begin an enumerated list',
        },
        {
          label: '\\begin{itemize}',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\begin{itemize}\n    \\item \n\\end{itemize}',
          documentation: 'Begin a bulleted list',
        },
        {
          label: '\\begin{equation}',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\begin{equation}\n    \n\\end{equation}',
          documentation: 'Begin an equation environment',
        },
        {
          label: '\\begin{align}',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\begin{align}\n    \n\\end{align}',
          documentation: 'Begin an aligned equation environment',
        },
        {
          label: '\\text',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\text{Your text here}',
          documentation: 'Insert text in math mode',
        },
        {
          label: '\\color',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\color{color}{text}',
          documentation: 'Color text',
        },
        {
          label: '\\mathbb',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\mathbb{A}',
          documentation: 'Blackboard bold',
        },
        {
          label: '\\mathcal',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\mathcal{A}',
          documentation: 'Calligraphic font',
        },
        {
          label: '\\mathfrak',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\mathfrak{A}',
          documentation: 'Fraktur font',
        },
        {
          label: '\\textsf',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\textsf{text}',
          documentation: 'Sans-serif text',
        },
        {
          label: '\\texttt',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\texttt{text}',
          documentation: 'Typewriter text',
        },
        {
          label: '\\caption',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\caption{Your caption here}',
          documentation: 'Figure/table caption',
        },
        {
          label: '\\label',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\label{label}',
          documentation: 'Label for referencing',
        },
        {
          label: '\\ref',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\ref{label}',
          documentation: 'Reference to a labeled item',
        },
        {
          label: '\\cite',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\cite{citation_key}',
          documentation: 'Cite a reference',
        },
        {
          label: '\\appendix',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\appendix',
          documentation: 'Begin an appendix',
        },
        {
          label: '\\chapter',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\chapter{Chapter Title}',
          documentation: 'Begin a new chapter',
        },
        {
          label: '\\section',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\section{Section Title}',
          documentation: 'Begin a new section',
        },
        {
          label: '\\subsection',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\subsection{Subsection Title}',
          documentation: 'Begin a new subsection',
        },
        {
          label: '\\subsubsection',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\subsubsection{Subsubsection Title}',
          documentation: 'Begin a new subsubsection',
        },
        {
          label: '\\footnote',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\footnote{Your footnote here}',
          documentation: 'Footnote command',
        },
        {
          label: '\\newpage',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\newpage',
          documentation: 'Begin a new page',
        },
        {
          label: '\\clearpage',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\clearpage',
          documentation: 'Clear all floats and start a new page',
        },
        {
          label: '\\begin{table}',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\begin{table}\n    \\centering\n    \\caption{Your caption here}\n    \\begin{tabular}{|c|c|}\n        \\hline\n        Header1 & Header2 \\\\\n        \\hline\n        Data1 & Data2 \\\\\n        \\hline\n    \\end{tabular}\n\\end{table}',
          documentation: 'Begin a table environment',
        },
        {
          label: '\\begin{figure}',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\begin{figure}\n    \\centering\n    \\includegraphics[width=0.5\\textwidth]{image}\n    \\caption{Your caption here}\n\\end{figure}',
          documentation: 'Begin a figure environment',
        },
        {
          label: '\\includegraphics',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\includegraphics[width=\\textwidth]{image}',
          documentation: 'Include an image',
        },
        {
          label: '\\begin{align*}',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\begin{align*}\n    \n\\end{align*}',
          documentation: 'Begin an unnumbered aligned equation environment',
        },
        {
          label: '\\begin{cases}',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '\\begin{cases}\n    a & \\text{if condition 1} \\\\\n    b & \\text{if condition 2}\n\\end{cases}',
          documentation: 'Begin a cases environment',
        },
      ];

      return { suggestions: suggestions };
    },
  });
});

export default function Home() {
  const [latexInput, setLatexInput] = useState('i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r}, t) = \\hat{H} \\Psi(\\mathbf{r}, t)');
  const outputRef = useRef<HTMLDivElement>(null);

  const editorOptions = {
    selectOnLineNumbers: true,
    minimap: {
      enabled: false,
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