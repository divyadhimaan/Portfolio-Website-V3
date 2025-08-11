"use client";

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import React, { ReactNode } from "react";
import dynamic from "next/dynamic";
import {
  Heading,
  HeadingLink,
  Media,
  SmartLink,
  Text,
  InlineCode,
  CodeBlock,
} from "@once-ui-system/core";
import { TextProps } from "@once-ui-system/core";
import { MediaProps } from "@once-ui-system/core";

// --- Utilities ---

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// --- Custom Components for Markdown ---

function CustomLink({ href, children, ...props }: {
  href: string; children: ReactNode
}) {
  if (href.startsWith("/")) {
    return (
      <SmartLink href={href} {...props}>{children}</SmartLink>
    );
  }
  if (href.startsWith("#")) {
    return <a href={href} {...props}>{children}</a>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function createParagraph({ children }: TextProps) {
  return (
    <Text
      variant="body-default-m"
      as="p"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
      style={{
        fontSize: 16,
        lineHeight: "1.6",
        margin: "0 0 16px 0",
      }}
    >
      {children}
    </Text>
  );
}

function createHeading(as: "h1"|"h2"|"h3"|"h4"|"h5"|"h6") {
  const sizes = {
    h1: { fontSize: 32, fontWeight: 600, lineHeight: "1.25", margin: "24px 0 16px" },
    h2: { fontSize: 24, fontWeight: 600, lineHeight: "1.25", margin: "24px 0 16px" },
    h3: { fontSize: 20, fontWeight: 600, margin: "24px 0 16px" },
    h4: { fontSize: 16, fontWeight: 600, margin: "24px 0 16px" },
    h5: { fontSize: 14, fontWeight: 600, margin: "24px 0 16px" },
    h6: { fontSize: 12, fontWeight: 600, margin: "24px 0 16px" },
  };
  const style = (sizes as any)[as];
  const CustomHeading = ({
    children, ...props
  }: Omit<React.ComponentProps<typeof HeadingLink>, 'as'|'id'>) => {
    // In real code, use childrenToString() for robustness
    const slug = slugify(typeof children === 'string' ? children : '');
    return (
      <HeadingLink
        as={as}
        id={slug}
        marginTop="24"
        marginBottom="12"
        onBackground="neutral-medium"
        style={{
          ...style,
          borderBottom: (as === "h1" || as === "h2") ? "1px solid #eaecef" : undefined,
          paddingBottom: (as === "h1" || as === "h2") ? "0.3em" : undefined
        }}
        {...props}
      >
        {children}
      </HeadingLink>
    );
  };
  return CustomHeading;
}

function createBlockquote({ children }: {children: ReactNode}) {
  return (
    <blockquote
      style={{
        borderLeft: "4px solid #dfe2e5",
        padding: "0 1em",
        margin: "0 0 16px 0",
      }}
    >
      <Text as="span" style={{fontStyle: "italic"}}>
        {children}
      </Text>
    </blockquote>
  )
}

function createUl({ children }: {children: ReactNode}) {
  return (
    <ul style={{margin: "0 0 16px 2em", padding: 0, listStyle: "disc"}}>
      {children}
    </ul>
  );
}
function createOl({ children }: {children: ReactNode}) {
  return (
    <ol style={{margin: "0 0 16px 2em", padding: 0, listStyle: "decimal"}}>
      {children}
    </ol>
  );
}
function createLi({ children }: {children: ReactNode}) {
  return (
    <li style={{ marginBottom: "4px" }}>
    <Text as="span" onBackground="neutral-medium">{children}</Text>
  </li>
  );
}

function createImage({ alt, src, ...props }: MediaProps & { src: string }) {
  if (!src) return null;
  return (
    <Media
      src={src}
      alt={alt}
      marginTop="8"
      marginBottom="16"
      enlarge
      radius="m"
      aspectRatio="16 / 9"
      border="neutral-alpha-medium"
      sizes="(max-width: 960px) 100vw, 960px"
      {...props}
    />
  );
}

function createTaskListItem({ children, checked }: {children: ReactNode, checked?: boolean}) {
  return (
    <li style={{ 
      marginBottom: "4px", 
      listStyle: "none", 
      marginLeft: "-1.5em",
      display: "flex",
      alignItems: "flex-start",
      gap: "8px"
    }}>
      <input 
        type="checkbox" 
        checked={checked} 
        readOnly 
        style={{ 
          marginTop: "2px",
          accentColor: "#0969da"
        }} 
      />
      <Text as="span" onBackground="neutral-medium" style={{
        textDecoration: checked ? "line-through" : "none",
        opacity: checked ? 0.7 : 1
      }}>
        {children}
      </Text>
    </li>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return (
    <InlineCode
      style={{
        color: "#e83e8c",
        borderRadius: "3px",
        padding: "0.2em 0.4em",
        fontSize: "90%",
        fontFamily: "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",
      }}
    >
      {children}
    </InlineCode>
  );
}

function createCodeBlock(props: any) {
  // For pre tags that contain code blocks, as in your original code:
  if (props.children && props.children.props && props.children.props.className) {
    const { className, children } = props.children.props;
    const language = className.replace('language-', '');
    const label = language.charAt(0).toUpperCase() + language.slice(1);
    return (
      <CodeBlock
        marginTop="8"
        marginBottom="16"
        codes={[
          {
            code: children,
            language,
            label,
          },
        ]}
        copyButton={true}
      />
    );
  }
  return (
    <pre
      {...props}
    />
  );
}

// Table Components - Enhanced for better GitHub-style rendering
function createTable({ children }: {children: ReactNode}) {
  return (
    <div style={{ 
      margin: "16px 0", 
      overflowX: "auto",
      border: "1px solid #d0d7de",
      borderRadius: "6px",
      fontSize: "14px"
    }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        borderSpacing: 0,
        display: "table",
        marginTop: 0,
        marginBottom: 0
      }}>
        {children}
      </table>
    </div>
  );
}

function createThead({ children }: {children: ReactNode}) {
  return (
    <thead style={{ 
      backgroundColor: "#f6f8fa",
      display: "table-header-group"
    }}>
      {children}
    </thead>
  );
}

function createTbody({ children }: {children: ReactNode}) {
  return (
    <tbody style={{ display: "table-row-group" }}>
      {children}
    </tbody>
  );
}

function createTr({ children }: {children: ReactNode}) {
  return (
    <tr style={{ 
      borderTop: "1px solid #d0d7de",
      backgroundColor: "#ffffff",
      display: "table-row"
    }}>
      {children}
    </tr>
  );
}

function createTh({ children }: {children: ReactNode}) {
  return (
    <th style={{
      padding: "6px 13px",
      border: "1px solid #d0d7de",
      textAlign: "left",
      fontWeight: 600,
      backgroundColor: "#f6f8fa",
      display: "table-cell",
      verticalAlign: "middle"
    }}>
      <Text as="span" style={{ fontWeight: 600, fontSize: "14px" }}>
        {children}
      </Text>
    </th>
  );
}

function createTd({ children }: {children: ReactNode}) {
  return (
    <td style={{
      padding: "6px 13px",
      border: "1px solid #d0d7de",
      display: "table-cell",
      verticalAlign: "top"
    }}>
      <Text as="span" style={{ fontSize: "14px" }}>
        {children}
      </Text>
    </td>
  );
}

// Custom MarkdownTable component for handling table markdown syntax
function MarkdownTable({ children }: { children: string }) {
  const lines = children.trim().split('\n');
  
  if (lines.length < 2) return <pre>{children}</pre>;
  
  const headerLine = lines[0];
  const separatorLine = lines[1];
  const dataLines = lines.slice(2);
  
  // Check if it's a valid table (separator line should have dashes and pipes)
  if (!separatorLine.includes('|') || !separatorLine.includes('-')) {
    return <pre>{children}</pre>;
  }
  
  // Parse headers
  const headers = headerLine
    .split('|')
    .map(h => h.trim())
    .filter(h => h.length > 0);
    
  // Parse alignment from separator
  const alignments = separatorLine
    .split('|')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => {
      if (s.startsWith(':') && s.endsWith(':')) return 'center';
      if (s.endsWith(':')) return 'right';
      return 'left';
    });
  
  // Parse data rows
  const rows = dataLines.map(line => 
    line
      .split('|')
      .map(cell => cell.trim())
      .filter((cell, index, arr) => {
        // Remove empty first/last cells if they exist due to leading/trailing |
        if (index === 0 && cell === '') return false;
        if (index === arr.length - 1 && cell === '') return false;
        return true;
      })
  ).filter(row => row.length > 0);
  
  return (
    <div style={{ 
      margin: "16px 0", 
      overflowX: "auto",
      border: "1px solid #d0d7de",
      borderRadius: "6px",
      fontSize: "14px"
    }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        borderSpacing: 0
      }}>
        <thead style={{ backgroundColor: "#f6f8fa" }}>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                style={{
                  padding: "6px 13px",
                  border: "1px solid #d0d7de",
                  textAlign: alignments[index] as any || 'left',
                  fontWeight: 600,
                  backgroundColor: "#f6f8fa"
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ borderTop: "1px solid #d0d7de" }}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{
                    padding: "6px 13px",
                    border: "1px solid #d0d7de",
                    textAlign: alignments[cellIndex] as any || 'left'
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Horizontal Rule
function createHr() {
  return (
    <hr style={{
      height: "0.25em",
      padding: 0,
      margin: "24px 0",
      backgroundColor: "#d0d7de",
      border: 0
    }} />
  );
}

// Strong/Bold text
function createStrong({ children }: {children: ReactNode}) {
  return (
    <strong style={{ fontWeight: 600 }}>
      {children}
    </strong>
  );
}

// Emphasis/Italic text
function createEm({ children }: {children: ReactNode}) {
  return (
    <em style={{ fontStyle: "italic" }}>
      {children}
    </em>
  );
}

// Strikethrough text
function createDel({ children }: {children: ReactNode}) {
  return (
    <del style={{ 
      textDecoration: "line-through",
      opacity: 0.7 
    }}>
      {children}
    </del>
  );
}
// Details/Summary (Collapsible sections)
function createDetails({ children, open }: {children: ReactNode, open?: boolean}) {
  return (
    <details 
      open={open}
      style={{
        margin: "16px 0",
        border: "1px solid #d0d7de",
        borderRadius: "6px",
        padding: "16px"
      }}
    >
      {children}
    </details>
  );
}

function createSummary({ children }: {children: ReactNode}) {
  return (
    <summary style={{
      fontWeight: 600,
      cursor: "pointer",
      marginBottom: "8px",
      outline: "none"
    }}>
      {children}
    </summary>
  );
}

// Badge/Label component for GitHub-style badges
function createBadge({ children, variant = "default" }: {
  children: ReactNode, 
  variant?: "default" | "success" | "warning" | "error" | "info"
}) {
  const variants = {
    default: { backgroundColor: "#f6f8fa", color: "#24292f", border: "1px solid #d0d7de" },
    success: { backgroundColor: "#dcffe4", color: "#0969da", border: "1px solid #1a7f37" },
    warning: { backgroundColor: "#fff8c5", color: "#9a6700", border: "1px solid #d1242f" },
    error: { backgroundColor: "#ffebe9", color: "#cf222e", border: "1px solid #d1242f" },
    info: { backgroundColor: "#ddf4ff", color: "#0969da", border: "1px solid #0969da" }
  };

  return (
    <span style={{
      display: "inline-block",
      padding: "2px 6px",
      fontSize: "12px",
      fontWeight: 500,
      lineHeight: "1.5",
      borderRadius: "12px",
      whiteSpace: "nowrap",
      ...variants[variant]
    }}>
      {children}
    </span>
  );
}


// --- Compose all the above into the MDX components mapping ---

const components = {
  p: createParagraph as any,
  h1: createHeading("h1") as any,
  h2: createHeading("h2") as any,
  h3: createHeading("h3") as any,
  h4: createHeading("h4") as any,
  h5: createHeading("h5") as any,
  h6: createHeading("h6") as any,
  blockquote: createBlockquote as any,
  ul: createUl as any,
  ol: createOl as any,
  li: createLi as any,
  img: createImage as any,
  a: CustomLink as any,
  code: createInlineCode as any,
  pre: createCodeBlock as any,
  table: createTable as any,
  thead: createThead as any,
  tbody: createTbody as any,
  tr: createTr as any,
  th: createTh as any,
  td: createTd as any,
  hr: createHr as any,
  strong: createStrong as any,
  em: createEm as any,
  del: createDel as any,
  details: createDetails as any,
  summary: createSummary as any,

  // Custom components
  TaskListItem: createTaskListItem as any,
  Badge: createBadge as any,
  MarkdownTable: MarkdownTable as any,


  // Original Once UI components
  Heading,
  Text,
  InlineCode,
  CodeBlock,
  Accordion: dynamic(() => import("@once-ui-system/core").then(mod => mod.Accordion)),
  AccordionGroup: dynamic(() => import("@once-ui-system/core").then(mod => mod.AccordionGroup)),
  Table: dynamic(() => import("@once-ui-system/core").then(mod => mod.Table)),
  Feedback: dynamic(() => import("@once-ui-system/core").then(mod => mod.Feedback)),
  Button: dynamic(() => import("@once-ui-system/core").then(mod => mod.Button)),
  Card: dynamic(() => import("@once-ui-system/core").then(mod => mod.Card)),
  Grid: dynamic(() => import("@once-ui-system/core").then(mod => mod.Grid)),
  Row: dynamic(() => import("@once-ui-system/core").then(mod => mod.Row)),
  Column: dynamic(() => import("@once-ui-system/core").then(mod => mod.Column)),
  Icon: dynamic(() => import("@once-ui-system/core").then(mod => mod.Icon)),
  Media: dynamic(() => import("@once-ui-system/core").then(mod => mod.Media)),
  SmartLink: dynamic(() => import("@once-ui-system/core").then(mod => mod.SmartLink)),
};

type CustomMDXProps = {
  source: MDXRemoteSerializeResult;
  components?: typeof components;
};

export function CustomMDX({ source, components: additionalComponents }: CustomMDXProps) {
  if (!source) {
    return <Text>No content available</Text>;
  }

  // Add a container with GitHub fonts/colors
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        fontSize: "16px",
        color: "#24292f",
        padding: "24px",
        // borderRadius: "8px",
        // border: "1px solid #e1e4e8",
        maxWidth: "900px",
        boxSizing: "border-box"
      }}
    >
      <MDXRemote
        {...source}
        components={{ ...components, ...additionalComponents }}
      />
    </div>
  );
}
