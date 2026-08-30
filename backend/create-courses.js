require("dotenv").config();

const courses = [
  {
    title: "Artificial Intelligence",
    description:
      "Learn the fundamentals of artificial intelligence and build intelligent applications.",
    category: "AI",
    level: "Beginner",
    duration: "10 weeks",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  },
  {
    title: "Machine Learning",
    description:
      "Learn supervised and unsupervised learning and build practical machine learning models.",
    category: "AI & ML",
    level: "Intermediate",
    duration: "10 weeks",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
  },
  {
    title: "Data Science",
    description:
      "Learn data analysis, statistics, visualization and machine learning for real-world problems.",
    category: "Data",
    level: "Advanced",
    duration: "12 weeks",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
  },
  {
    title: "Data Analytics",
    description:
      "Analyze business data using Python, SQL, statistics and visualization tools.",
    category: "Data",
    level: "Intermediate",
    duration: "8 weeks",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72",
  },
  {
    title: "SQL & Database Management",
    description:
      "Master SQL queries, joins, relationships and database management.",
    category: "Database",
    level: "Beginner",
    duration: "7 weeks",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d",
  },
  {
    title: "Power BI & Business Intelligence",
    description:
      "Create interactive dashboards and generate useful business insights with Power BI.",
    category: "Analytics",
    level: "Intermediate",
    duration: "6 weeks",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
  },
  {
    title: "Full Stack Web Development",
    description:
      "Build modern web applications using frontend, backend, databases and APIs.",
    category: "Development",
    level: "Advanced",
    duration: "12 weeks",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  },
  {
    title: "React.js",
    description:
      "Build interactive web applications using React components, hooks and APIs.",
    category: "Web Development",
    level: "Intermediate",
    duration: "7 weeks",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
  },
  {
    title: "Next.js",
    description:
      "Learn modern Next.js development including routing, server components and APIs.",
    category: "Web Development",
    level: "Advanced",
    duration: "7 weeks",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8",
  },
  {
    title: "Cloud Computing",
    description:
      "Learn cloud concepts, deployment, storage, networking and cloud services.",
    category: "Cloud",
    level: "Intermediate",
    duration: "8 weeks",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
  },
  {
    title: "Git & GitHub",
    description:
      "Learn version control, branching, merging and collaborative software development.",
    category: "Developer Tools",
    level: "Beginner",
    duration: "3 weeks",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1556075798-4825dfaaf498",
  },
  {
    title: "DevOps Engineering",
    description:
      "Learn CI/CD, containers, deployment automation and DevOps practices.",
    category: "DevOps",
    level: "Advanced",
    duration: "10 weeks",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    title: "Natural Language Processing",
    description:
      "Learn how computers process human language using modern NLP techniques.",
    category: "AI",
    level: "Advanced",
    duration: "8 weeks",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  },
  {
    title: "Computer Vision",
    description:
      "Build AI systems that understand images using computer vision and deep learning.",
    category: "AI",
    level: "Advanced",
    duration: "8 weeks",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },
];

async function createCourses() {
  const token = process.env.STRAPI_API_TOKEN;

  if (!token) {
    console.log("❌ STRAPI_API_TOKEN is missing from .env");
    return;
  }

  for (const course of courses) {
    try {
      const response = await fetch(
        "http://localhost:1337/api/courses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: course,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(`✅ Created: ${course.title}`);
      } else {
        console.log(`❌ Failed: ${course.title}`);
        console.log(result);
      }
    } catch (error) {
      console.log(`❌ Error: ${course.title}`);
      console.log(error.message);
    }
  }

  console.log("\n🎉 Course creation process completed!");
}

createCourses();