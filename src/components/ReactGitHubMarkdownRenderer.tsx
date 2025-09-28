"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// Once UI components
import {
  Heading,
  HeadingLink,
  Text,
  InlineCode,
  SmartLink,
  Media,
} from "@once-ui-system/core";

import CodeBlock from "./CodeBlock"

// GitHub style layout, theme-colored
import styles from "./github-markdown.module.css";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

interface GitHubMarkdownRendererProps {
  content: string;
  className?: string;
  maxCodeLines?: number;
}

export function ReactGitHubMarkdownRenderer({ content, className = "", maxCodeLines = 20 }: GitHubMarkdownRendererProps) {
  return (
    <div
      className={`${styles["github-markdown"]} ${className}`}
      style={{ maxWidth: "900px" }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[
          // rehypeHighlight,
          rehypeRaw,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ]}
        components={{
          p: ({ children }) => (
            <Text
              variant="body-default-m"
              as="p"
              onBackground="neutral-medium"
            >
              {children}
            </Text>
          ),

          h1: ({ children }) => (
            <HeadingLink
              as="h1"
              id={slugify(String(children))}
              style={{
                borderBottom: "1px solid var(--color-border-default)",
              }}
            >
              {children}
            </HeadingLink>
          ),
          h2: ({ children }) => (
            <HeadingLink
              as="h2"
              id={slugify(String(children))}
              style={{
                borderBottom: "1px solid var(--color-border-default)",
              }}
            >
              {children}
            </HeadingLink>
          ),
          h3: ({ children }) => <Heading as="h3">{children}</Heading>,
          h4: ({ children }) => <Heading as="h4">{children}</Heading>,
          h5: ({ children }) => <Heading as="h5">{children}</Heading>,
          h6: ({ children }) => <Heading as="h6">{children}</Heading>,

          a: ({ href, children }) => {
            if (!href) return <>{children}</>;
            if (href.startsWith("/") || href.startsWith("#")) {
              return <SmartLink href={href}>{children}</SmartLink>;
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },

          img: ({ src = "", alt }) => (
            <Media
              src={src as string}
              alt={alt}
              marginTop="8"
              marginBottom="16"
              radius="m"
              enlarge
            />
          ),

          code: ({ inline, className, node, children, ...props }: any) => {
            if (inline || node?.tagName !== 'code' || node?.parent?.tagName !== 'pre') {
              return (
                <InlineCode className={className || ""} {...props}>
                  {children}
                </InlineCode>
              );
            }
            const match = /language-(\w+)/.exec(className || "");
            const language = match?.[1] || "plaintext";
            const code = String(children).replace(/\n$/, "");

            return (
              <CodeBlock
                codes={[
                  {
                    code: code,
                    language: language,
                    label: language.charAt(0).toUpperCase() + language.slice(1),
                  },
                ]}
                copyButton={true}
                maxLines={maxCodeLines}
              />
            );
          },

          blockquote: ({ children }) => (
            <blockquote className={styles.blockquote}>
              <Text as="span" style={{ fontStyle: "italic" }}>
                {children}
              </Text>
            </blockquote>
          ),

          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,

          table: ({ children }) => (
            <div className={styles["table-wrapper"]}>
              <table>{children}</table>
            </div>
          ),
          

          hr: () => (
            <hr style={{ borderTop: "1px solid #e1e4e8", width: "100%", }} />
          ),
          subHr: () => (
              <hr style={{
               borderTop: "1px solid #f3f4f6",
               width: "100%",
               margin: "16px 0",
               border: "none"
             }} />
           )

        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
