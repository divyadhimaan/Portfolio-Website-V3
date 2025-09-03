import { Column, Row, Meta, Schema, Text } from "@once-ui-system/core";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import { baseURL, gallery, person } from "@/resources";
import imagesData from "@/resources/data/gallery.json";
import { GalleryImage } from "@/components/types/GalleryImage";
import styles from "@/components/gallery/Gallery.module.scss";


export async function generateMetadata() {
  return Meta.generate({
    title: gallery.title,
    description: gallery.description,
    baseURL: baseURL,
    image: `/generate-og?title=${encodeURIComponent(gallery.title)}`,
    path: gallery.path,
  });
}

export default function Gallery() {
  const images = imagesData as GalleryImage[];
  return (
    <Column maxWidth="l" gap="32">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={gallery.title}
        description={gallery.description}
        path={gallery.path}
        image={`/generate-og?title=${encodeURIComponent(gallery.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${gallery.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Row>
      <Text
          className={styles.textAlign}
          variant="display-default-xs"
          onBackground="neutral-weak"
        >
          Frames of My World
        </Text>
      </Row>
        
      <MasonryGrid images={images}/>
    </Column>
  );
}
