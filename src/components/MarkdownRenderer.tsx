
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/github.css"; // Optional: for syntax theme

type Props = {
  content: string;
};

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div
      className="markdown-body max-w-3xl mx-auto px-6 py-10"
      style={{
        background: "none",
        backgroundColor: "transparent", // or "#fff" or dark bg depending on theme
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
