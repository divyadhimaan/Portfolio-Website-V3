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
