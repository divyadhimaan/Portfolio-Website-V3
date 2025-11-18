"use client";

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

interface CodeComponentProps {
  inline?: boolean;
  className?: string;
  node?: Element;
  children: React.ReactNode;
}

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

function headingText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(headingText).join('');
  if (
    typeof children === 'object' &&
    children !== null &&
    // @ts-ignore
    'props' in children &&
    // @ts-ignore
    children.props.children !== undefined
  ) {
    // @ts-ignore
    return headingText(children.props.children);
  }
  return '';
}

function parseCodeMeta(className = "", meta = ""): { language: string, label?: string } {
  // Try to extract language and possible :title=...
  const langMatch = /language-(\w+)/.exec(className) || [];
  let language = langMatch[1] ?? "plaintext";
  let label: string | undefined = undefined;

  // Support for fences like ```js:title=main.js
  if (meta) {
    const titleMatch = /title=([\w.\- ]+)/.exec(meta);
    if (titleMatch) label = titleMatch[1];
  }
  // For ```js:title=main.js, parse in className itself
  const codeFenceTitle = /(\w+):title=([\w.\- ]+)/.exec(className);
  if (codeFenceTitle) {
    language = codeFenceTitle[1];
    label = codeFenceTitle[2];
  }
  return { language, label };
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
              id={slugify(headingText(children))}
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
              id={slugify(headingText(children))}
              style={{
                borderBottom: "1px solid var(--color-border-default)",
              }}
            >
              {children}
            </HeadingLink>
          ),
          h3: ({ children }) => (
            <HeadingLink as="h3" id={slugify(headingText(children))}>
              {children}
            </HeadingLink>
          ),
          h4: ({ children }) => (
            <HeadingLink as="h4" id={slugify(headingText(children))}>
              {children}
            </HeadingLink>
          ),
          h5: ({ children }) => (
            <HeadingLink as="h5" id={slugify(headingText(children))}>
              {children}
            </HeadingLink>
          ),
          h6: ({ children }) => (
            <HeadingLink as="h6" id={slugify(headingText(children))}>
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

          

          code: ({ inline, className, node, children, ...props }: any) => {
            if (inline || node?.tagName !== 'code' || node?.parent?.tagName !== 'pre') {
              return (
                <InlineCode className={className || ""} {...props}>
                  {children}
                </InlineCode>
              );
            }

            const meta = node?.data?.meta || "";
            const { language, label } = parseCodeMeta(className, meta);
            const code = String(children).replace(/\n$/, "");


            return (
              <CodeBlock
              codes={[
                {
                  code,
                  language,
                  label: label || (language.charAt(0).toUpperCase() + language.slice(1)),
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

        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
