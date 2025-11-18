"use client";

import React, { useRef, useState, isValidElement } from 'react';
import type { ReactNode, ReactElement, ComponentPropsWithoutRef } from "react";
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
  Icon,
  Button
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

function headingText(children: ReactNode): string {
  let result = "";

  const walk = (node: ReactNode): void => {
    if (typeof node === "string" || typeof node === "number") {
      result += String(node);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (isValidElement(node)) {
      const element = node as ReactElement;

      // Recursively read children
      if (isValidElement(node)) {
        const element = node as ReactElement<{ children?: ReactNode }>;
  
        if (element.props.children) {
          walk(element.props.children);
        }
      }
    }
  };

  walk(children);
  return result.trim();
}

// Copy button for code block
function CopyButton({ getText }: { getText: () => string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      setCopied(false);
    }
  }

  return (
    <Button
      prefixIcon={copied ? "check" : "copy"}
      variant='primary'
      size='s'
      onClick={handleCopy}
      className="copy-btn"
      style={{
        position: "absolute",
        top: 4,
        right: 4,
        // zIndex: 9999,   
        // border: "none",
        // borderRadius: 4,
        // color: "rgba(175, 184, 193, 0.2)",
        // background: "transparent",
        // cursor: "pointer",
      }}
      aria-label={copied ? "Copied!" : "Copy code"}
      tabIndex={0}
      type="button"
    >
      {/* <Icon
        name={copied ? "copyCheck" : "copy"}
        onBackground="accent-strong"
      /> */}
      
    </Button>
  );
}

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
};

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
          
            const containsBlock = flat.some((child: ReactNode) => {
              if (!child) return false;
            
              if (isValidElement(child)) {
                const element = child as ReactElement<{
                  className?: string;
                  children?: ReactNode;
                }>;
            
                const type = element.type;
                const props = element.props;
            
                if (type === "pre") return true;
            
                if (
                  type === "code" &&
                  typeof props.className === "string" &&
                  props.className.includes("language-")
                ) {
                  return true;
                }
              }
            
              return false;
            });
          
            if (containsBlock) {
              return <>{children}</>; 
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

          code: ({ inline, className, children, ...props }: CodeProps) => {
            if (inline) {
              return (
                <InlineCode className={className || ""} {...props}>
                  {children}
                </InlineCode>
              );
            }


            const codeRef = useRef<HTMLElement>(null);

            // For code blocks: let rehype-highlight style them, don't use a custom CodeBlock!
            return (
              <div style={{ position: "relative" }}>
                <CopyButton getText={() => codeRef.current?.innerText || ""} />
          
                <pre>
                  <code ref={codeRef} className={className || ""} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
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
