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
  if (!fs.existsSync(dir)) {
    console.error("Directory does not exist:", dir);
    return [];
  }

  const files =  fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
  return files;
}

function readMDXFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
      console.error("File does not exist:", filePath);
      return null;
    }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  if (!content) {
    return notFound();
  }

  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    
    const { data, content } = matter(rawContent);

    if (!content || typeof content !== 'string') {
      console.error("Invalid content in file:", filePath);
      return null;
    }

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
  } catch (error) {
    console.error("Error reading/parsing MDX file:", filePath);
    console.error("Error details:", error);
    return null;
  }
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);

  const results = [];
  
  for (const file of mdxFiles) {
    try {
      const fileData = readMDXFile(path.join(dir, file));

      if (!fileData) {
        console.error("Failed to read file:", file);
        continue; // Skip this file instead of throwing
      }

      const { metadata, content } = fileData;
      const slug = path.basename(file, path.extname(file));
      
      if (!content || typeof content !== 'string') {
        console.error("Invalid content for file:", file);
        console.error("Content type:", typeof content);
        continue;
      }

      const result = {
        metadata,
        slug,
        content,
      };
      
      results.push(result);
    } catch (error) {
      console.error("Error processing file:", file);
      console.error("Error details:", error);
      throw error;
    }
  }
  
  return results;
}

export function getPosts(customPath: string[] = []) {
  try {
    const postsDir = path.join(process.cwd(), ...customPath);
    
    const posts = getMDXData(postsDir);
    
    // Final validation
    const validPosts = posts.filter(post => {
      if (!post.content || typeof post.content !== 'string') {
        console.error("Filtering out invalid post:", post.slug);
        return false;
      }
      return true;
    });
    
    return validPosts;
  } catch (error) {
    console.error("Error in getPosts:", error);
    return [];
  }
}
