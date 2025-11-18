// import { notFound } from "next/navigation";
// import { CustomMDX, ScrollToHash } from "@/components";
// import { Meta, Schema, AvatarGroup, Button, Column, Heading, HeadingNav, Icon, Row, Text } from "@once-ui-system/core";
// import { baseURL, about, blog, person } from "@/resources";
// import { serialize } from 'next-mdx-remote/serialize'
// import { formatDate } from "@/app/utils/formatDate";
// import { getPosts } from "@/app/utils/utils";
// import { Metadata } from 'next';
// import { ReactGitHubMarkdownRenderer } from "@/components/ReactGitHubMarkdownRenderer";

// export async function generateStaticParams(): Promise<{ slug: string }[]> {
//   const posts = getPosts(["src", "resources", "blogs"]);
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string | string[] }>;
// }): Promise<Metadata> {
//   const routeParams = await params;
//   const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

//   const posts = getPosts(["src", "resources", "blogs"]);
//   let post = posts.find((post) => post.slug === slugPath);

//   if (!post) return {};

//   return Meta.generate({
//     title: post.metadata.title,
//     description: post.metadata.summary,
//     baseURL: baseURL,
//     image: post.metadata.image || `/generate-og?title=${post.metadata.title}`,
//     path: `${blog.path}/${post.slug}`,
//   });
// }

// export default async function Blog({
//   params
// }: { params: Promise<{ slug: string | string[] }> }) {
//   const routeParams = await params;
//   const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

//   let post = getPosts(["src", "resources", "blogs"]).find((post) => post.slug === slugPath);

//   if (!post) {
//     notFound();
//   }

//   const avatars =
//     post.metadata.team?.map((person) => ({
//       src: person.avatar,
//     })) || [];

//   return (
//     <Row fillWidth>
//       {/* <Row maxWidth={12} m={{ hide: true }}/> */}
//       <Row fillWidth horizontal="center">
//         <Column as="section" maxWidth="s" gap="l">
//           <Schema
//             as="blogPosting"
//             baseURL={baseURL}
//             path={`${blog.path}/${post.slug}`}
//             title={post.metadata.title}
//             description={post.metadata.summary}
//             datePublished={post.metadata.publishedAt}
//             dateModified={post.metadata.publishedAt}
//             image={post.metadata.image || `/generate-og?title=${encodeURIComponent(post.metadata.title)}`}
//             author={{
//               name: person.name,
//               url: `${baseURL}${about.path}`,
//               image: `${baseURL}${person.avatar}`,
//             }}
//           />
//           <Button data-border="rounded" href="/blog" weight="default" variant="tertiary" size="s" prefixIcon="chevronLeft">
//             Posts
//           </Button>
//           <Heading variant="display-strong-s">{post.metadata.title}</Heading>
//           <Row gap="12" vertical="center">
//             {avatars.length > 0 && <AvatarGroup size="s" avatars={avatars} />}
//             <Text variant="body-default-s" onBackground="neutral-weak">
//               {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
//             </Text>
//           </Row>
//           <Column as="article" fillWidth >
//             {/* <CustomMDX source={await serialize(post.content)} /> */}
//             <ReactGitHubMarkdownRenderer content={post.content} />
//           </Column>
//           <ScrollToHash />
//         </Column>
//     </Row>
//     <Column maxWidth={12} paddingLeft="40" fitHeight position="sticky" top="80" gap="16" m={{ hide: true }}>
//       <Row
//         gap="12"
//         paddingLeft="2"
//         vertical="center"
//         onBackground="neutral-medium"
//         textVariant="label-default-s"
//       >
//         <Icon name="document" size="xs" />
//         On this page
//       </Row>
//       <HeadingNav fitHeight/>
//     </Column>
//     </Row>
//   );
// }
import { notFound } from "next/navigation";
import { CustomMDX, ScrollToHash } from "@/components";
import {
  Meta,
  Schema,
  AvatarGroup,
  Button,
  Column,
  Heading,
  HeadingNav,
  Icon,
  Row,
  Text,
  Media,
} from "@once-ui-system/core";
import { baseURL, about, blog, person } from "@/resources";
import { formatDate } from "@/app/utils/formatDate";
import { getPosts } from "@/app/utils/utils";
import { Metadata } from 'next';
import { ReactGitHubMarkdownRenderer } from "@/components/ReactGitHubMarkdownRenderer";

function estimateReadingTime(text: string): number {
  const wordsPerMinute = 210; // Medium uses 200-250
  const noOfWords = text.trim().split(/\s+/).length;
  return Math.ceil(noOfWords / wordsPerMinute);
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "resources", "blogs"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

  const posts = getPosts(["src", "resources", "blogs"]);
  let post = posts.find((post) => post.slug === slugPath);

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image || `/generate-og?title=${post.metadata.title}`,
    path: `${blog.path}/${post.slug}`,
  });
}

export default async function Blog({
  params
}: { params: Promise<{ slug: string | string[] }> }) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

  let post = getPosts(["src", "resources", "blogs"]).find((post) => post.slug === slugPath);

  if (!post) {
    notFound();
  }

  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];

  // Calculate reading time
  const readingTime = estimateReadingTime(post.content);

  return (
    <Row
      fillWidth
      style={{
        justifyContent: 'center',
        minHeight: '100vh'
      }}
    >
      <Row fillWidth horizontal="center" style={{ maxWidth: '820px', padding: '0 1.5rem', borderRadius: 12, marginTop: 32, boxShadow: '0 6px 40px 0 rgba(0,0,0,0.06)' }}>
        <Column as="section" fillWidth gap="l" style={{ padding: '32px 0 48px 0' }}>
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={`${blog.path}/${post.slug}`}
            title={post.metadata.title}
            description={post.metadata.summary}
            datePublished={post.metadata.publishedAt}
            dateModified={post.metadata.publishedAt}
            image={post.metadata.image || `/generate-og?title=${encodeURIComponent(post.metadata.title)}`}
            author={{
              name: person.name,
              url: `${baseURL}${about.path}`,
              image: `${baseURL}${person.avatar}`,
            }}
          />

          <Button data-border="rounded" href="/blog" weight="default" variant="tertiary" size="s" prefixIcon="chevronLeft" style={{ marginBottom: 16 }}>
            Back to posts
          </Button>

          {/* COVER IMAGE */}
          {post.metadata.image && (
            <Media
              src={post.metadata.image}
              alt={post.metadata.title}
              marginBottom="16"
              style={{
                borderRadius: 12,
                width: '100%',
                maxHeight: 420,
                objectFit: 'cover',
                boxShadow: '0 2px 32px 0 rgba(0,0,0,0.06)'
              }}
            />
          )}

          {/* Title */}
          <Heading variant="display-strong-xl" as="h1" style={{
            fontSize: 36,
            lineHeight: 1.16,
            textAlign: 'center',
            letterSpacing: '-0.005em',
            marginBottom: 8,
          }}>
            {post.metadata.title}
          </Heading>

          {/* Subtitle / Summary */}
          {post.metadata.summary && (
            <Text variant="body-strong-l" as="div" onBackground="neutral-medium" style={{
              textAlign: 'center',
              fontSize: 20,
              marginBottom: 12,
              color: '#757575',
            }}>
              {post.metadata.summary}
            </Text>
          )}

          {/* Author + Meta */}
          <Row vertical="center" gap="20" style={{ marginBottom: 12, justifyContent: 'center' }}>
            <Row vertical="center" gap="8">
              {avatars.length > 0 ?
                <AvatarGroup size="m" avatars={avatars} /> :
                <img
                  src={`${baseURL}${person.avatar}`}
                  alt={person.name}
                  style={{ width: 38, height: 38, borderRadius: '50%' }}
                />
              }
              <Text variant="body-default-m" as="div" style={{ fontWeight: 500 }}>
                {person.name}
              </Text>
            </Row>
            <Text variant="body-default-s" as="div" style={{ color: '#b0b0b0' }}>•</Text>
            <Text variant="body-default-s" style={{ color: '#757575' }}>
              {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
            </Text>
            <Text variant="body-default-s" as="div" style={{ color: '#b0b0b0' }}>•</Text>
            <Text variant="body-default-s" style={{ color: '#757575' }}>{readingTime} min read</Text>
          </Row>

          <hr style={{
            border: 'none',
            borderTop: '1.5px solid #eee',
            margin: '16px 0 28px 0'
          }} />

          {/* Main Content */}
          <Column as="article" fillWidth>
            <ReactGitHubMarkdownRenderer content={post.content} maxCodeLines={30} />
          </Column>
          <ScrollToHash />
        </Column>
      </Row>

      {/* STICKY TOC: only visible on large screens */}
      <Column
        maxWidth={13}
        paddingLeft="36"
        fitHeight
        position="sticky"
        top="78"
        gap="16"
        m={{ hide: true }}
        style={{ marginTop: 32 }}
      >
        <Row
          gap="12"
          paddingLeft="2"
          vertical="center"
          onBackground="neutral-medium"
          textVariant="label-default-s"
          style={{
            letterSpacing: '.01em',
            fontWeight: 600,
            fontSize: 15,
            color: '#95989c'
          }}>
          <Icon name="document" size="xs" />
          On this page
        </Row>
        <HeadingNav fitHeight/>
      </Column>
    </Row>
  );
}