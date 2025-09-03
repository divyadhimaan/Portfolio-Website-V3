"use client";

import { Card,Column, Avatar, Media, Row, Text, Tag } from '@once-ui-system/core';
import styles from './Posts.module.scss';
import { formatDate } from '@/app/utils/formatDate';
import { person } from "@/resources";


interface PostProps {
    post: any;
    thumbnail: boolean;
    direction?: "row" | "column";
}

export default function Post({ post, thumbnail, direction }: PostProps) {
    return (
        // <SmartLink
        //     fillWidth
        //     unstyled
        //     style={{ borderRadius: 'var(--radius-l)' }}
        //     key={post.slug}
        //     href={`/blog/${post.slug}`}>
        //     <Flex
        //         position="relative"
        //         transition="micro-medium"
        //         direction={direction}
        //         radius="l"
        //         className={styles.hover}
        //         mobileDirection="column"
        //         fillWidth>
        //         {post.metadata.image && thumbnail && (
        //             <Media
        //                 priority
        //                 className={styles.image}
        //                 sizes="(max-width: 768px) 100vw, 640px"
        //                 border="neutral-alpha-weak"
        //                 cursor="interactive"
        //                 radius="l"
        //                 src={post.metadata.image}
        //                 alt={'Thumbnail of ' + post.metadata.title}
        //                 aspectRatio="16 / 9"
        //             />
        //         )}
        //         <Column
        //             position="relative"
        //             fillWidth gap="4"
        //             padding="24"
        //             vertical="center">
        //             <Heading
        //                 as="h2"
        //                 variant="heading-strong-l"
        //                 wrap="balance">
        //                 {post.metadata.title}
        //             </Heading>
        //             <Text
        //                 variant="label-default-s"
        //                 onBackground="neutral-weak">
        //                 {formatDate(post.metadata.publishedAt, false)}
        //             </Text>
        //             { post.metadata.tag &&
        //                 <Tag
        //                     className="mt-12"
        //                     label={post.metadata.tag.join(', ')}
        //                     variant="neutral" />
        //             }
        //         </Column>
        //     </Flex>
        // </SmartLink>
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
            alt={"Thumbnail of " + post.metadata.title}
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
                {formatDate(post.metadata.publishedAt, false)}
              </Text>
            </Row>
            <Text variant="heading-strong-l" wrap="balance">
              {post.metadata.title}
            </Text>
            {post.metadata.tag && post.metadata.tag.length > 0 && (
                <Row wrap gap="8" paddingTop="8">
                {post.metadata.tag.map((tag: string) => (
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