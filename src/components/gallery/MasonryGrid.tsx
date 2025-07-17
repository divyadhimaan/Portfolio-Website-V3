"use client";

import Masonry from "react-masonry-css";
import { Media } from "@once-ui-system/core";
import styles from "./Gallery.module.scss";
import { GalleryImage } from "@/components/types/GalleryImage";


type MasonryGridProps = {
  images: GalleryImage[];
};

export default function MasonryGrid({ images }: MasonryGridProps) {
  const breakpointColumnsObj = {
    default: 3,
    900: 2,
    600: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className={styles.masonryGrid}
      columnClassName={styles.masonryGridColumn}
    >
      {images.map((image, index) => (
        <Media
          priority={index < 10}
          sizes="(max-width: 350px) 100vw, 50vw"
          key={index}
          radius="m"
          aspectRatio={image.orientation === "horizontal" ? "16 / 9" : "3 / 4"}
          src={image.src}
          alt={image.alt}
          className={styles.gridItem}
        />
      ))}
    </Masonry>
  );
}
