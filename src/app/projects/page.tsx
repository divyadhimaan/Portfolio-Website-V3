import { Column, Meta, Schema } from "@once-ui-system/core";
import { baseURL, about, person, projects } from "@/resources";
import { Projects as ProjectWork } from "@/components/projects/Projects";

export async function generateMetadata() {
  return Meta.generate({
    title: projects.title,
    description: projects.description,
    baseURL: baseURL,
    image: `/generate-og?title=${encodeURIComponent(projects.title)}`,
    path: projects.path,
  });
}

export default function Projects() {
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={projects.path}
        title={projects.title}
        description={projects.description}
        image={`/generate-og?title=${encodeURIComponent(projects.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <ProjectWork />
    </Column>
  );
}
