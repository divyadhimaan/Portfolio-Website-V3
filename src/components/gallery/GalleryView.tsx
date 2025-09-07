"use client";

import { Media, MasonryGrid } from "@once-ui-system/core";
import imagesData from "@/resources/data/gallery.json";
export type GalleryImage = {
  src: string;
  alt: string;
  orientation: "horizontal" | "vertical";
};

export default function GalleryView() {
  const images = imagesData as GalleryImage[];
  return (
    <MasonryGrid columns={3} s={{ columns: 1 }}>
      {images.map((image, index) => (
        <Media
          enlarge
          priority={index < 10}
          sizes="(max-width: 560px) 100vw, 50vw"
          key={`${image.alt}-index`}
          radius="m"
          aspectRatio={image.orientation === "horizontal" ? "16 / 9" : "3 / 4"}
          src={image.src}
          alt={image.alt}
        />
      ))}
    </MasonryGrid>
  );
}
