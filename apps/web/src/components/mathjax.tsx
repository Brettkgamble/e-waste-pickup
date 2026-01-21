"use client";

import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useEffect, useState } from "react";

const MATHJAX_CONFIG = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
  },
  options: {
    enableMenu: false,
  },
};

export function MathJaxProvider({ children }: { children: React.ReactNode }) {
  return (
    <MathJaxContext
      config={MATHJAX_CONFIG}
      src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
    >
      {children}
    </MathJaxContext>
  );
}

export function InlineMath({ tex }: { tex: string }) {
  const [isTypeset, setIsTypeset] = useState(false);

  useEffect(() => {
    setIsTypeset(false);
  }, [tex]);

  return (
    <span className="relative inline-block align-middle">
      {!isTypeset && (
        <span
          aria-hidden
          className="inline-block h-4 w-20 rounded bg-muted/40 animate-pulse"
        />
      )}
      <MathJax
        inline
        dynamic
        hideUntilTypeset="every"
        onTypeset={() => setIsTypeset(true)}
      >
        {`\\(${tex}\\)`}
      </MathJax>
    </span>
  );
}

export function BlockMath({ tex }: { tex: string }) {
  const [isTypeset, setIsTypeset] = useState(false);

  useEffect(() => {
    setIsTypeset(false);
  }, [tex]);

  return (
    <div className="relative">
      {!isTypeset && (
        <div
          aria-hidden
          className="h-8 w-full rounded bg-muted/40 animate-pulse"
        />
      )}
      <MathJax
        dynamic
        hideUntilTypeset="every"
        onTypeset={() => setIsTypeset(true)}
      >
        {`\\[${tex}\\]`}
      </MathJax>
    </div>
  );
}
