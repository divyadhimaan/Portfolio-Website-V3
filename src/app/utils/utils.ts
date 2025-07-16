import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  link?: string;
  sourceCodeLink?: string;
  languages?: string[];
};

import { notFound } from 'next/navigation';

function getMDXFiles(dir: string) {
  console.log("Checking if directory exists:", dir);
  console.log("Directory exists:", fs.existsSync(dir));
  if (!fs.existsSync(dir)) {
    throw new Error("Not Found");
    // notFound();
  }

  const files =  fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
  console.log("MDX files found:", files);
  return files;
}

function readMDXFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
        notFound();
    }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    publishedAt: data.publishedAt,
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || [],
    team: data.team || [],
    link: data.link || "",
    sourceCodeLink: data.sourceCodeLink || "",
    languages: data.languages || [],
  };

  return { metadata, content };
}

function getMDXData(dir: string) {
  console.log("Starting getMDXData for directory:", dir);
  const mdxFiles = getMDXFiles(dir);
  console.log("Processing files:", mdxFiles);

  const results = [];
  
  for (const file of mdxFiles) {
    try {
      console.log("Processing file:", file);
      const { metadata, content } = readMDXFile(path.join(dir, file));
      const slug = path.basename(file, path.extname(file));
      console.log("Generated slug:", slug, "from file:", file);
      
      const result = {
        metadata,
        slug,
        content,
      };
      
      results.push(result);
      console.log("Successfully processed file:", file);
    } catch (error) {
      console.error("Error processing file:", file);
      console.error("Error details:", error);
      throw error;
    }
  }
  
  console.log("getMDXData completed successfully, processed", results.length, "files");
  return results;
}

export function getPosts(customPath: string[] = []) {
  const postsDir = path.join(process.cwd(), ...customPath);
  console.log("Resolved posts directory:", postsDir);
  console.log("Current working directory:", process.cwd());
  
  return getMDXData(postsDir);
}
