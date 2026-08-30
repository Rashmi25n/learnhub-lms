require("dotenv").config();

const API_URL = "http://localhost:1337/api";
const TOKEN = process.env.STRAPI_API_TOKEN;

const courses = [
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Data Analytics",
  "SQL & Database Management",
  "Power BI & Business Intelligence",
  "Full Stack Web Development",
  "React.js",
  "Next.js",
  "Cloud Computing",
  "Git & GitHub",
  "DevOps Engineering",
  "Natural Language Processing",
  "Computer Vision",
];

async function getCourses() {
  const response = await fetch(
    `${API_URL}/courses?pagination[pageSize]=100`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(result));
  }

  return result.data;
}

const lessonTemplates = {
  "Artificial Intelligence": [
    {
      title: "Introduction to Artificial Intelligence",
      content:
        "Learn what Artificial Intelligence is, its history, applications, benefits and limitations.",
      videoUrl: "https://www.youtube.com/watch?v=ad79nYk2keg",
      order: 1,
    },
    {
      title: "AI Fundamentals",
      content:
        "Understand intelligent agents, problem solving, search algorithms and knowledge representation.",
      videoUrl: "https://www.youtube.com/watch?v=JMUxmLyrhSk",
      order: 2,
    },
    {
      title: "Building AI Applications",
      content:
        "Learn how AI models are used to create practical intelligent applications.",
      videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
      order: 3,
    },
  ],

  "Machine Learning": [
    {
      title: "Introduction to Machine Learning",
      content:
        "Understand machine learning, its types and real-world applications.",
      videoUrl: "https://www.youtube.com/watch?v=ukzFI9rgwfU",
      order: 1,
    },
    {
      title: "Supervised Learning",
      content:
        "Learn regression, classification and important supervised learning algorithms.",
      videoUrl: "https://www.youtube.com/watch?v=Gv9_4yMHFhI",
      order: 2,
    },
    {
      title: "Model Evaluation",
      content:
        "Learn training, testing, accuracy, precision, recall and model evaluation techniques.",
      videoUrl: "https://www.youtube.com/watch?v=0Lt9w-BxKFQ",
      order: 3,
    },
  ],

  "Data Science": [
    {
      title: "Introduction to Data Science",
      content:
        "Learn the data science lifecycle, tools and real-world applications.",
      videoUrl: "https://www.youtube.com/watch?v=ua-CiDNNj30",
      order: 1,
    },
    {
      title: "Data Analysis with Python",
      content:
        "Learn data cleaning, manipulation and analysis using Python.",
      videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
      order: 2,
    },
    {
      title: "Data Visualization",
      content:
        "Create meaningful charts and visualizations to understand data.",
      videoUrl: "https://www.youtube.com/watch?v=3Xc3CA655Y4",
      order: 3,
    },
  ],

  "Data Analytics": [
    {
      title: "Introduction to Data Analytics",
      content:
        "Understand data analytics, business intelligence and analytical thinking.",
      videoUrl: "https://www.youtube.com/watch?v=VQ2qJ0Q4m7Q",
      order: 1,
    },
    {
      title: "Data Cleaning",
      content:
        "Learn how to identify missing values, duplicates and incorrect data.",
      videoUrl: "https://www.youtube.com/watch?v=YQ6dQx7M9mQ",
      order: 2,
    },
    {
      title: "Business Data Analysis",
      content:
        "Analyze business datasets and extract useful insights for decision making.",
      videoUrl: "https://www.youtube.com/watch?v=7T9Q0mQ8K5M",
      order: 3,
    },
  ],

  "SQL & Database Management": [
    {
      title: "SQL Fundamentals",
      content:
        "Learn databases, tables, rows, columns and basic SQL queries.",
      videoUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
      order: 1,
    },
    {
      title: "SQL Joins",
      content:
        "Understand INNER JOIN, LEFT JOIN, RIGHT JOIN and relationships between tables.",
      videoUrl: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
      order: 2,
    },
    {
      title: "Advanced SQL Queries",
      content:
        "Learn subqueries, grouping, aggregation and advanced SQL techniques.",
      videoUrl: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
      order: 3,
    },
  ],

  "Power BI & Business Intelligence": [
    {
      title: "Introduction to Power BI",
      content:
        "Learn Power BI fundamentals, reports, dashboards and business intelligence.",
      videoUrl: "https://www.youtube.com/watch?v=3JkK7k2q8YQ",
      order: 1,
    },
    {
      title: "Data Modeling in Power BI",
      content:
        "Learn relationships, tables and data models in Power BI.",
      videoUrl: "https://www.youtube.com/watch?v=5A1n5n7K8qQ",
      order: 2,
    },
    {
      title: "Power BI Dashboards",
      content:
        "Create interactive dashboards and communicate business insights.",
      videoUrl: "https://www.youtube.com/watch?v=AGrl-H87pRU",
      order: 3,
    },
  ],

  "Full Stack Web Development": [
    {
      title: "Frontend Development",
      content:
        "Learn HTML, CSS and JavaScript fundamentals for modern web development.",
      videoUrl: "https://www.youtube.com/watch?v=G3e-cpL7ofc",
      order: 1,
    },
    {
      title: "Backend Development",
      content:
        "Understand servers, APIs, authentication and backend application development.",
      videoUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE",
      order: 2,
    },
    {
      title: "Database & APIs",
      content:
        "Learn how frontend, backend, databases and APIs work together.",
      videoUrl: "https://www.youtube.com/watch?v=4cWkVbC2bNE",
      order: 3,
    },
  ],

  "React.js": [
    {
      title: "React Fundamentals",
      content:
        "Learn components, JSX and the basic concepts of React.",
      videoUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
      order: 1,
    },
    {
      title: "React Hooks",
      content:
        "Learn useState, useEffect and other important React hooks.",
      videoUrl: "https://www.youtube.com/watch?v=O6P86uwfdR0",
      order: 2,
    },
    {
      title: "React APIs",
      content:
        "Learn how React applications communicate with backend APIs.",
      videoUrl: "https://www.youtube.com/watch?v=mbsmsi7l3r4",
      order: 3,
    },
  ],

  "Next.js": [
    {
      title: "Next.js Fundamentals",
      content:
        "Learn Next.js project structure, routing and modern application development.",
      videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA",
      order: 1,
    },
    {
      title: "Next.js Pages and Routing",
      content:
        "Learn dynamic routes, navigation and page organization.",
      videoUrl: "https://www.youtube.com/watch?v=1WmNXEVia8I",
      order: 2,
    },
    {
      title: "Next.js API Integration",
      content:
        "Learn how Next.js applications communicate with backend APIs.",
      videoUrl: "https://www.youtube.com/watch?v=vwSlYG7hFk0",
      order: 3,
    },
  ],

  "Cloud Computing": [
    {
      title: "Cloud Computing Fundamentals",
      content:
        "Understand cloud computing, its benefits and major cloud service models.",
      videoUrl: "https://www.youtube.com/watch?v=M988_fsOSWo",
      order: 1,
    },
    {
      title: "Cloud Services",
      content:
        "Learn compute, storage, networking and database services in the cloud.",
      videoUrl: "https://www.youtube.com/watch?v=mxT233EdY5c",
      order: 2,
    },
    {
      title: "Cloud Deployment",
      content:
        "Learn the basic process of deploying applications to cloud platforms.",
      videoUrl: "https://www.youtube.com/watch?v=Ia-UEYYR44s",
      order: 3,
    },
  ],

  "Git & GitHub": [
    {
      title: "Git Fundamentals",
      content:
        "Learn repositories, commits, branches and basic Git commands.",
      videoUrl: "https://www.youtube.com/watch?v=RGOj5yH7evk",
      order: 1,
    },
    {
      title: "Git Branching",
      content:
        "Learn branches, merging and resolving common Git conflicts.",
      videoUrl: "https://www.youtube.com/watch?v=e9lnsKot_SQ",
      order: 2,
    },
    {
      title: "GitHub Collaboration",
      content:
        "Learn repositories, pull requests and collaborative development.",
      videoUrl: "https://www.youtube.com/watch?v=apGV9Kg7ics",
      order: 3,
    },
  ],

  "DevOps Engineering": [
    {
      title: "Introduction to DevOps",
      content:
        "Understand DevOps culture, practices and continuous delivery.",
      videoUrl: "https://www.youtube.com/watch?v=0yWAtQ6wYNM",
      order: 1,
    },
    {
      title: "CI/CD Pipelines",
      content:
        "Learn continuous integration, continuous delivery and deployment automation.",
      videoUrl: "https://www.youtube.com/watch?v=scEDHsr3APg",
      order: 2,
    },
    {
      title: "Containers and Deployment",
      content:
        "Understand containers and how modern applications are deployed.",
      videoUrl: "https://www.youtube.com/watch?v=3c-iBn73dDE",
      order: 3,
    },
  ],

  "Natural Language Processing": [
    {
      title: "NLP Fundamentals",
      content:
        "Learn how computers process and understand human language.",
      videoUrl: "https://www.youtube.com/watch?v=fOvTtapxa9c",
      order: 1,
    },
    {
      title: "Text Processing",
      content:
        "Learn tokenization, stemming, lemmatization and text preprocessing.",
      videoUrl: "https://www.youtube.com/watch?v=6C0sLtw5ctc",
      order: 2,
    },
    {
      title: "NLP Applications",
      content:
        "Explore sentiment analysis, text classification and language applications.",
      videoUrl: "https://www.youtube.com/watch?v=8rXD5-xhemo",
      order: 3,
    },
  ],

  "Computer Vision": [
    {
      title: "Computer Vision Fundamentals",
      content:
        "Understand images, pixels and the fundamentals of computer vision.",
      videoUrl: "https://www.youtube.com/watch?v=01sAkU_NvOY",
      order: 1,
    },
    {
      title: "Image Processing",
      content:
        "Learn image preprocessing, transformations and feature extraction.",
      videoUrl: "https://www.youtube.com/watch?v=oXlwWbU8l2o",
      order: 2,
    },
    {
      title: "Deep Learning for Vision",
      content:
        "Learn how neural networks and CNNs are used for image understanding.",
      videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
      order: 3,
    },
  ],
};

async function createLessons() {
  if (!TOKEN) {
    console.log("❌ STRAPI_API_TOKEN is missing from .env");
    return;
  }

  console.log("🔎 Loading courses from Strapi...");

  const strapiCourses = await getCourses();

  for (const courseName of courses) {
    const course = strapiCourses.find(
      (item) => item.title === courseName
    );

    if (!course) {
      console.log(`❌ Course not found: ${courseName}`);
      continue;
    }

    const lessons = lessonTemplates[courseName];

    for (const lesson of lessons) {
      try {
        const response = await fetch(`${API_URL}/lessons`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              ...lesson,
              course: course.documentId,
            },
          }),
        });

        const result = await response.json();

        if (response.ok) {
          console.log(
            `✅ Created: ${courseName} → ${lesson.title}`
          );
        } else {
          console.log(
            `❌ Failed: ${courseName} → ${lesson.title}`
          );
          console.log(result);
        }
      } catch (error) {
        console.log(
          `❌ Error: ${courseName} → ${lesson.title}`
        );
        console.log(error.message);
      }
    }
  }

  console.log("\n🎉 Lesson creation completed!");
}

createLessons();