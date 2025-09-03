"use client";

import {
  AvatarGroup,
  Carousel,
  Column,
  Row,
  Heading,
  SmartLink,
  Text,
  Badge,
} from "@once-ui-system/core";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
  sourceCodeLink: string
  languages: string[];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  avatars,
  link,
  sourceCodeLink, 
  languages
}) => {

  return (
    <Column fillWidth gap="m">
      <Carousel
        sizes="(max-width: 960px) 100vw, 960px"
        items={images.map((image) => ({
          slide: image,
          alt: title,
        }))}
      />
      <Row
        s={{ direction: "column" }}
        fillWidth
        paddingX="s"
        paddingTop="12"
        paddingBottom="24"
        gap="l"
      >
          {title && (
            <Row flex={5} direction="column"  gap="12">
              <Heading as="h2" wrap="balance" variant="heading-strong-xl">
                {title}
              </Heading>
              <Row gap="8" wrap>
              {languages?.length > 0 && ( 
                  languages.map((lang, index) => (
                  <Badge key={index} background="brand-alpha-weak" paddingX="12" paddingY="4" onBackground="neutral-strong" textVariant="label-default-s" arrow={false}>
                    <Row paddingY="2">{lang}</Row>
                  </Badge>
                ))
              )}
              </Row>
            </Row>
          )}
        {(avatars?.length > 0 || description?.trim() || content?.trim()) && (
          <Column flex={7} gap="16">
            {avatars?.length > 0 && <AvatarGroup avatars={avatars} size="m" reverse />}
            {description?.trim() && (
              <Text wrap="balance" variant="body-default-s" onBackground="neutral-weak">
                {description}
              </Text>
            )}
            <Row gap="24" wrap>
              {/* {content?.trim() && (
                <SmartLink
                  suffixIcon="arrowRight"
                  style={{ margin: "0", width: "fit-content" }}
                  href={href}
                >
                  <Text variant="body-default-s">Read case study</Text>
                </SmartLink>
              )} */}
              {link && (
                <SmartLink
                  suffixIcon="arrowUpRightFromSquare"
                  style={{ margin: "0", width: "fit-content" }}
                  href={link}
                >
                  <Text variant="body-default-s">Live project</Text>
                </SmartLink>
              )}
              {sourceCodeLink && (
                <SmartLink
                  suffixIcon="code"
                  style={{ margin: "0", width: "fit-content" }}
                  href={sourceCodeLink}
                >
                  <Text variant="body-default-s">Source Code</Text>
                </SmartLink>
              )}
            </Row>
            
            
            
          </Column>
        )}
      </Row>
    </Column>
  );
};
