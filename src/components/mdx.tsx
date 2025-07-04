import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { ReactNode } from "react";
import dynamic from "next/dynamic";

import { 
  Heading,
  HeadingLink,
  Media,
  SmartLink,
  Text,
  InlineCode,
} from "@once-ui-system/core";
import { CodeBlock } from "@once-ui-system/core";
import { TextProps } from "@once-ui-system/core";
import { MediaProps } from "@once-ui-system/core";

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <SmartLink href={href} {...props}>
        {children}
      </SmartLink>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function createImage({ alt, src, ...props }: MediaProps & { src: string }) {
  if (!src) {
    console.error("Media requires a valid 'src' property.");
    return null;
  }

  return (
    <Media
      marginTop="8"
      marginBottom="16"
      enlarge
      radius="m"
      aspectRatio="16 / 9"
      border="neutral-alpha-medium"
      sizes="(max-width: 960px) 100vw, 960px"
      alt={alt}
      src={src}
      {...props}
    />
  );
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const CustomHeading = ({ children, ...props }: Omit<React.ComponentProps<typeof HeadingLink>, 'as' | 'id'>) => {
    const slug = slugify(children as string);
    return (
      <HeadingLink
        marginTop="24"
        marginBottom="12"
        as={as}
        id={slug}
        {...props}
      >
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `${as}`;

  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return (
    <Text
      style={{ lineHeight: "175%" }}
      variant="body-default-m"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
    >
      {children}
    </Text>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return <InlineCode>{children}</InlineCode>;
}

function createCodeBlock(props: any) {
  // For pre tags that contain code blocks
  if (props.children && props.children.props && props.children.props.className) {
    const { className, children } = props.children.props;
    
    // Extract language from className (format: language-xxx)
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
            label
          }
        ]}
        copyButton={true}
      />
    );
  }
  
  // Fallback for other pre tags or empty code blocks
  return <pre {...props} />;
}

const components = {
  p: createParagraph as any,
  h1: createHeading("h1") as any,
  h2: createHeading("h2") as any,
  h3: createHeading("h3") as any,
  h4: createHeading("h4") as any,
  h5: createHeading("h5") as any,
  h6: createHeading("h6") as any,
  img: createImage as any,
  a: CustomLink as any,
  code: createInlineCode as any,
  pre: createCodeBlock as any,
  Heading,
  Text,
  CodeBlock,
  InlineCode,
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
  source: string;
  components?: typeof components;
};

export function CustomMDX({ source, components: additionalComponents }: CustomMDXProps) {
  // Add error handling and validation
  if (!source) {
    console.error('CustomMDX: source is required');
    return <Text>No content available</Text>;
  }

  if (typeof source !== 'string') {
    console.error('CustomMDX: source must be a string, received:', typeof source);
    return <Text>Invalid content format</Text>;
  }

  try {
    // If the source is HTML, render it directly
    if (source.includes('<') && source.includes('>') && !source.includes('---')) {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: source }}
          className="prose prose-lg max-w-none"
        />
      );
    }

    // Otherwise, render as MDX
    return (
      <MDXRemote 
        source={source}
        components={{ ...components, ...(additionalComponents || {}) }}
      />
    );
  } catch (error) {
    console.error('Error rendering CustomMDX:', error);
    return (
      <div>
        <Text>Error rendering content</Text>
        <details style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
          <summary>Debug Information</summary>
          <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>
            Error: {error instanceof Error ? error.message : 'Unknown error'}
            {'\n'}
            Source type: {typeof source}
            {'\n'}
            Source length: {source?.length || 'N/A'}
            {'\n'}
            Source preview: {source?.slice(0, 200) || 'No source'}
          </pre>
        </details>
      </div>
    );
  }
}