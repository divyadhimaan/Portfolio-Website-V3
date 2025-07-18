export const person = {
    firstName: "Divya",
    lastName: "Dhiman",
    get name() {
      return `${this.firstName} ${this.lastName}`;
    },
    role: "Software Engineer",
    avatar: "/images/avatar.jpeg",
    email: "dhimandivya713@gmail.com",
    location: "India/Bengaluru",
    languages: [], 
  };
  
  export const projects = {
    path: "/projects",
    label: "Projects",
    title: `${person.firstName}'s Projects`,
    description: `Design and dev projects by ${person.firstName}`,
    // Create new project pages by adding a new .mdx file to resources/projectwork
    // All projects will be listed on the /home and /work routes
  };

  export const home = {
    path: "/",
    image: "/images/og/home.jpg",
    label: "Home",
    title: `${person.firstName}'s Portfolio`,
    description: `Portfolio website showcasing my work as a ${person.role}`,
    headline: <>Turning Ideas into Implementation</>,
    featured: {
      display: false,
      title: <>Recent project: <strong className="ml-4">DSA assistant - Dbot</strong></>,
      href: "/projects/chat-assisstant-using-llama3",
    },
    subline: (
      <>
        I'm Divya, a Software Engineer.  <br />
        This is more than a portfolio — it’s a playground of ideas. Take a stroll, and let’s build what’s next.
      </>
    ),
  };

  export const contactMe = {
    display: false,
    title: <>Tell me about your Idea {person.firstName}'s Newsletter</>,
    description: (
      <>
        I occasionally write about design, technology, and share thoughts on the intersection of
        creativity and engineering.
      </>
    ),
  };

  export const social = [
    // Links are automatically displayed.
    // Import new icons in /once-ui/icons.ts
    {
      name: "GitHub",
      icon: "github",
      link: "https://github.com/divyadhimaan",
    },
    {
      name: "LinkedIn",
      icon: "linkedin",
      link: "https://www.linkedin.com/in/divya-dhiman/",
    },
    {
      name: "Email",
      icon: "email",
      link: `mailto:${person.email}`,
    },
  ];
  
  export const about = {
    path: "/about",
    label: "About",
    title: `About – ${person.name}`,
    description: `Meet ${person.name}, ${person.role} from ${person.location}`,
    tableOfContent: {
      display: true,
      subItems: false,
    },
    avatar: {
      display: true,
    },
    calendar: {
      display: true,
      link: "https://cal.com",
    },
    intro: {
      display: true,
      title: "Introduction",
      description: (
        <>
          I'm a software developer with a passion for crafting thoughtful digital experiences through clean, functional code.
          <br />
          With a strong foundation in full-stack development, I blend design sense with engineering precision 
          to build intuitive web applications, interactive interfaces, and scalable systems.

          <br />
          My work bridges creativity and technology,  from hackathon prototypes to production-ready platforms.
        </>
      ),
    },
    work: {
      display: true, // set to false to hide this section
      title: "Work Experience",
      experiences: [
        {
          company: "JPMorgan Chase",
          timeframe: "2023 - Present",
          role: "Software Developer Engineer",
          link: "https://www.jpmorganchase.com",
          achievements: [
            <>
              Engineered an LLM-powered tool using Python and React that translated natural language into SQL,
allowing business users to define 100+ data quality rules and accelerated data validation processes.
            </>,
            <>
              Implemented a robust version control framework for data ingestion, enabling real-time status updates
via REST APIs that enhanced consumer access to ACTIVE datasets by 40%, improving overall usability.
            </>,
            <>
            Optimized automated pipelines leveraging AWS Lambda functions and Databricks, processing over 1
million records daily, and integrated telemetry and event distribution, completely eliminating the need
for manual intervention.
            </>,
            <>
            Created a ReactJS-based Event and Webinar Management tool, reducing manual effort by 60% and
improving event discoverability and registration.
            </>,
            <>
            Implemented an automated end-to-end functional test suite using Cucumber with a Java back-end,
allowing early detection of critical defects and achieving a 97% reduction in production defect rates.
            </>,
            <>
            Led the migration from Jenkins to Spinnaker, establishing a robust CI/CD pipeline to accelerate
software delivery.
            </>,
          ],
          // images: [
          //   // optional: leave the array empty if you don't want to display images
          //   {
          //     src: "/images/projects/project-01/cover-01.jpg",
          //     alt: "Once UI Project",
          //     width: 16,
          //     height: 9,
          //   },
          // ],
        },
        {
          company: "JPMorgan Chase",
          timeframe: "Summer 2022 & Fall 2023",
          role: "SDE Intern",
          link: "https://www.jpmorganchase.com",
          achievements: [
            <>
              Executed a Java Spring Boot application deployed on AWS ECS, reducing deployment time by 60%.
            </>,
            <>
              Curated a DataDog monitoring dashboard to track and optimize the health and performance of AWS
Kubernetes clusters, reducing incident response time by 45%.
            </>,
            <>
              Built an intuitive React-based interface for uploading files to AWS S3 landing zones, triggering automated ingestion pipelines via cloud-native services.            
            </>,
            <>
              Implemented Splunk log filtering to streamline log analysis and enable early and efficient detection of errors and failures.
            </>
          ],
          images: [],
        },
      ],
    },
    studies: {
      display: true, // set to false to hide this section
      title: "Studies",
      institutions: [
        {
          name: "Thapar Institute of Engineering and Technology",
          link: "https://www.thapar.edu/",
          description: <>Studied software engineering.</>,
        },
      ],
    },
    technical: {
      display: false, // set to false to hide this section
      title: "Technical skills",
      skills: [
        {
          title: "Figma",
          description: <>Able to prototype in Figma with Once UI with unnatural speed.</>,
          // optional: leave the array empty if you don't want to display images
          images: [
            {
              src: "/images/projects/project-01/cover-02.jpg",
              alt: "Project image",
              width: 16,
              height: 9,
            },
            {
              src: "/images/projects/project-01/cover-03.jpg",
              alt: "Project image",
              width: 16,
              height: 9,
            },
          ],
        },
        {
          title: "Next.js",
          description: <>Building next gen apps with Next.js + Once UI + Supabase.</>,
          // optional: leave the array empty if you don't want to display images
          images: [
            {
              src: "/images/projects/project-01/cover-04.jpg",
              alt: "Project image",
              width: 16,
              height: 9,
            },
          ],
        },
      ],
    },
  };

  
export const blog = {
  path: "/blog",
  label: "Blog",
  title: `${person.firstName}'s Blogs`,
  description: `Read what ${person.firstName} has been up to recently`,
  // Create new project pages by adding a new .mdx file to resources/blogs
  // All projects will be listed on the /blogs routes
};

export const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
};