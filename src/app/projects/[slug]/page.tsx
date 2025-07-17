import { notFound } from "next/navigation";
import { getPosts } from "@/app/utils/utils";
import { Meta, Schema, AvatarGroup, Button, Column, Flex, Heading, Media, Text } from "@once-ui-system/core";
import { baseURL, about, person, projects } from "@/resources";
import { formatDate } from "@/app/utils/formatDate";
import { ScrollToHash, CustomMDX } from "@/components";
import { Metadata } from "next";
import { serialize } from 'next-mdx-remote/serialize'


interface PageParams {
  params: Promise<{ slug: string | string[] }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "resources", "projectwork"])
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug || "";

  const posts = getPosts(["src", "resources", "projectwork"]);
  let post = posts.find((post) => post.slug === slugPath);

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image || `/generate-og?title=${post.metadata.title}`,
    path: `${projects.path}/${post.slug}`,
  });
}

export default async function Project({ params }: PageParams) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug || "";

  let post = getPosts(["src", "resources", "projectwork"]).find((post) => post.slug === slugPath);

  if (!post) return notFound();

  // Debug logging - remove in production
  console.log('Post found:', post.slug);
  console.log('Post metadata:', post.metadata);
  console.log('Post content length:', post.content?.length || 'undefined');
  console.log('Post content type:', typeof post.content);

  // Safety check for content
  if (!post.content) {
    console.error('Post content is undefined for slug:', slugPath);
    return (
      <Column as="section" maxWidth="m" horizontal="center" gap="l">
        <Text>Error: Post content not found</Text>
      </Column>
    );
  }

  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${projects.path}/${post.slug}`}
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
      <Column maxWidth="xs" gap="16">
        <Button data-border="rounded" href="/projects" variant="tertiary" weight="default" size="s" prefixIcon="chevronLeft">
          Projects
        </Button>
        <Heading variant="display-strong-s">{post.metadata.title}</Heading>
      </Column>
      {post.metadata.images.length > 0 && (
        <Media
          priority
          aspectRatio="16 / 9"
          radius="m"
          alt="image"
          src={post.metadata.images[0]}
        />
      )}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        <Flex gap="12" marginBottom="24" vertical="center">
          {post.metadata.team && <AvatarGroup reverse avatars={avatars} size="m" />}
          <Text variant="body-default-s" onBackground="neutral-weak">
            {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
          </Text>
        </Flex>
        <div>
          <CustomMDX source={await serialize(post.content)} />
        </div>
      </Column>
      <ScrollToHash />
    </Column>
  );
}