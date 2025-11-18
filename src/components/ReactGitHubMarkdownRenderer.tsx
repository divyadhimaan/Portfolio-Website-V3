"use client";

import React from 'react';
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

// GitHub style layout, theme-colored
import styles from "./github-markdown.module.css";

const slugCounter: Record<string, number> = {};
function uniqueSlug(base: string) {
  if (!slugCounter[base]) {
    slugCounter[base] = 1;
    return base; // first occurrence
  }

  slugCounter[base] += 1;
  return `${base}-${slugCounter[base]}`;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function headingText(children: React.ReactNode): string {
  let result = '';

  const walk = (node: React.ReactNode) => {
    if (typeof node === 'string' || typeof node === 'number') {
      result += String(node);
      return;
    }

    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }

    if (
      node &&
      typeof node === 'object' &&
      'props' in (node as any) &&
      (node as any).props?.children
    ) {
      walk((node as any).props.children);
    }
  };

  walk(children);

  return result.trim();
}

interface GitHubMarkdownRendererProps {
  content: string;
  className?: string;
  maxCodeLines?: number;
}

export function ReactGitHubMarkdownRenderer({
  content,
  className = "",
  maxCodeLines = 20,
}: GitHubMarkdownRendererProps) {
  return (
    <div
      className={`${styles["github-markdown"]} ${className}`}
      style={{ maxWidth: "900px" }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[
          rehypeRaw,
          rehypeHighlight,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ]}
        components={{
          p: ({ children }) => {
            const flat = React.Children.toArray(children);
          
            // Detect actual block-level elements that should not be inside <p>
            const containsBlock = flat.some((child: any) => {
              if (!child) return false;
          
              // Real block code
              if (child.type === 'pre') return true;
          
              // Sometimes rehype creates <code class="language-xxx"> without <pre>
              if (child.type === 'code' && child.props?.className?.includes("language-"))
                return true;
          
              return false;
            });
          
            if (containsBlock) {
              return <>{children}</>; // Do NOT wrap in <p>
            }
          
            return (
              <Text as="p" variant="body-default-m" onBackground="neutral-medium">
                {children}
              </Text>
            );
          },
          

          h1: ({ children }) => (
            <HeadingLink
              as="h1"
              id={uniqueSlug(slugify(headingText(children)))}
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
              id={uniqueSlug(slugify(headingText(children)))}
              style={{
                borderBottom: "1px solid var(--color-border-default)",
              }}
            >
              {children}
            </HeadingLink>
          ),
          h3: ({ children }) => (
            <HeadingLink as="h3" id={uniqueSlug(slugify(headingText(children)))}>
              {children}
            </HeadingLink>
          ),
          h4: ({ children }) => (
            <HeadingLink as="h4" id={uniqueSlug(slugify(headingText(children)))}>
              {children}
            </HeadingLink>
          ),
          h5: ({ children }) => (
            <HeadingLink as="h5" id={uniqueSlug(slugify(headingText(children)))}>
              {children}
            </HeadingLink>
          ),
          h6: ({ children }) => (
            <HeadingLink as="h6" id={uniqueSlug(slugify(headingText(children)))}>
              {children}
            </HeadingLink>
          ),

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

          code: ({ inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <InlineCode className={className || ""} {...props}>
                  {children}
                </InlineCode>
              );
            }
            // For code blocks: let rehype-highlight style them, don't use a custom CodeBlock!
            return (
              <pre>
                <code className={className || ""} {...props}>
                  {children}
                </code>
              </pre>
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
            <hr
              style={{
                width: "100%",
              }}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
