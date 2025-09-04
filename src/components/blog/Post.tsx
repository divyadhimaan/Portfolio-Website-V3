"use client";

import { Card,Column, Avatar, Media, Row, Text, Tag } from '@once-ui-system/core';
import styles from './Posts.module.scss';
import { formatDate } from '@/app/utils/formatDate';
import { person } from "@/resources";

interface Post {
  title?: string;
  metadata: {
    title?: string;
    tag?: string | string[];
    publishedAt?: string;
    summary?: string;
    image?: string;
  };
  slug?: string;
  content?: string;
}
interface PostProps {
    post: Post;
    thumbnail: boolean;
    direction?: "row" | "column";
}
const getTags = (tag: string | string[] | undefined): string[] => {
  if (!tag) return [];
  return Array.isArray(tag) ? tag : [tag];
};

export default function Post({ post, thumbnail, direction }: PostProps) {
    return (
        <Card
        fillWidth
        key={post.slug}
        href={`/blog/${post.slug}`}
        transition="micro-medium"
        direction={direction}
        border="transparent"
        background="transparent"
        padding="4"
        radius="l-4"
        gap={direction === "column" ? undefined : "24"}
        s={{ direction: "column" }}
      >
        {post.metadata.image && thumbnail && (
          <Media
            priority
            sizes="(max-width: 768px) 100vw, 640px"
            border="neutral-alpha-weak"
            cursor="interactive"
            radius="l"
            src={post.metadata.image}
            alt={`Thumbnail of ${post.metadata.title}`}
            aspectRatio="16 / 9"
          />
        )}
        <Row fillWidth>
          <Column maxWidth={28} paddingY="24" paddingX="l" gap="20" vertical="center">
            <Row gap="24" vertical="center">
              <Row vertical="center" gap="16">
                <Avatar src={person.avatar} size="s" />
                <Text variant="label-default-s">{person.name}</Text>
              </Row>
              <Text variant="body-default-xs" onBackground="neutral-weak">
              {formatDate(post.metadata.publishedAt || new Date().toISOString(), false)}
              </Text>
            </Row>
            <Text variant="heading-strong-l" wrap="balance">
              {post.metadata.title}
            </Text>
            {post.metadata.tag && post.metadata.tag.length > 0 && (
                <Row wrap gap="8" paddingTop="8">
                  {getTags(post.metadata.tag).map((tag: string) => (
                    <Tag key={`${post.title}-${tag}`} size="l">
                      {tag}
                    </Tag>
                  ))}
                </Row>
            )}
          </Column>
        </Row>
      </Card>
    );
}