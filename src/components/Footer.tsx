import React from "react";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-4">
      <div className="container mx-auto flex flex-col items-center justify-between px-4 sm:flex-row">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Katexed. Made by{" "}
          <a 
            href="https://romophic.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            romophic
          </a>
          .
        </p>
        <div className="mt-2 flex items-center space-x-4 sm:mt-0">
          <a
            href="https://github.com/romophic/katexed"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}