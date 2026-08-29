"use client";

import { useMemo, useState } from "react";

type Course = {
  icon: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  description: string;
  thumbnail: string;
};

const courses: Course[] = [
  {
    icon: "🐍",
    title: "Python Programming",
    category: "Programming",
    level: "Beginner",
    duration: "8 weeks",
    description:
      "Learn Python from the basics to advanced concepts, including variables, functions, OOP, and practical programming.",
    thumbnail:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🤖",
    title: "Artificial Intelligence",
    category: "AI",
    level: "Beginner",
    duration: "10 weeks",
    description:
      "Learn the fundamentals of artificial intelligence and build intelligent applications.",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🧠",
    title: "Machine Learning",
    category: "AI",
    level: "Intermediate",
    duration: "10 weeks",
    description:
      "Learn supervised and unsupervised learning and build practical machine learning models.",
    thumbnail:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "📈",
    title: "Data Science",
    category: "Data",
    level: "Advanced",
    duration: "12 weeks",
    description:
      "Learn data analysis, statistics, visualization and machine learning for real-world problems.",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "📊",
    title: "Data Analytics",
    category: "Data",
    level: "Intermediate",
    duration: "8 weeks",
    description:
      "Analyze business data using Python, SQL, statistics and visualization tools.",
    thumbnail:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🗄️",
    title: "SQL & Database Management",
    category: "Database",
    level: "Beginner",
    duration: "7 weeks",
    description:
      "Master SQL queries, joins, relationships and database management.",
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "📉",
    title: "Power BI & Business Intelligence",
    category: "Analytics",
    level: "Intermediate",
    duration: "6 weeks",
    description:
      "Create interactive dashboards and generate useful business insights with Power BI.",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "💻",
    title: "Full Stack Web Development",
    category: "Development",
    level: "Advanced",
    duration: "12 weeks",
    description:
      "Build modern web applications using frontend, backend, databases and APIs.",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "⚛️",
    title: "React.js",
    category: "Web Development",
    level: "Intermediate",
    duration: "7 weeks",
    description:
      "Build interactive web applications using React components, hooks and APIs.",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "▲",
    title: "Next.js",
    category: "Web Development",
    level: "Advanced",
    duration: "7 weeks",
    description:
      "Learn modern Next.js development including routing, server components and APIs.",
    thumbnail:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "☁️",
    title: "Cloud Computing",
    category: "Cloud",
    level: "Intermediate",
    duration: "8 weeks",
    description:
      "Learn cloud concepts, deployment, storage, networking and cloud services.",
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🐙",
    title: "Git & GitHub",
    category: "Developer Tools",
    level: "Beginner",
    duration: "3 weeks",
    description:
      "Learn version control, branching, merging and collaborative software development.",
    thumbnail:
      "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🚀",
    title: "DevOps Engineering",
    category: "DevOps",
    level: "Advanced",
    duration: "10 weeks",
    description:
      "Learn CI/CD, containers, deployment automation and DevOps practices.",
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "💬",
    title: "Natural Language Processing",
    category: "AI",
    level: "Advanced",
    duration: "8 weeks",
    description:
      "Learn how computers process human language using modern NLP techniques.",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "👁️",
    title: "Computer Vision",
    category: "AI",
    level: "Advanced",
    duration: "8 weeks",
    description:
      "Build AI systems that understand images using computer vision and deep learning.",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
];

const categories: string[] = [
  "All",
  "AI",
  "Programming",
  "Data",
  "Database",
  "Analytics",
  "Development",
  "Web Development",
  "Cloud",
  "Developer Tools",
  "DevOps",
];

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CoursesPage() {
  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] =
    useState<string>("All");

  const filteredCourses = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return courses.filter((course) => {
      const matchesCategory =
        activeCategory === "All" ||
        course.category === activeCategory;

      const matchesSearch =
        searchText === "" ||
        course.title.toLowerCase().includes(searchText) ||
        course.category.toLowerCase().includes(searchText) ||
        course.description.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 px-6 py-5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <a
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            Learn<span className="text-cyan-400">Hub</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">

            <a
              href="/"
              className="transition hover:text-cyan-400"
            >
              Home
            </a>

            <a
              href="/courses"
              className="font-bold text-cyan-400"
            >
              Courses
            </a>

            <a
              href="#about"
              className="transition hover:text-cyan-400"
            >
              About
            </a>

            <a
              href="/login"
              className="rounded-full bg-cyan-400 px-6 py-2.5 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Login
            </a>

          </div>

        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 py-24 text-center md:px-10">

        <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative">

          <p className="font-bold tracking-[0.25em] text-cyan-400">
            LEARN • BUILD • CERTIFY
          </p>

          <h1 className="mx-auto mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
            Upgrade Your Skills.
            <br />

            <span className="text-cyan-400">
              Build Your Future.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">
            Explore industry-focused courses, gain practical knowledge,
            complete projects and earn certificates with LearnHub.
          </p>

          {/* SEARCH */}
          <div className="mx-auto mt-10 flex max-w-2xl items-center rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl">

            <span className="px-4 text-xl">
              🔎
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search for courses..."
              className="w-full bg-transparent px-2 py-3 text-white outline-none placeholder:text-slate-500"
            />

            <button
              type="button"
              onClick={() =>
                setSearch(search.trim())
              }
              className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Search
            </button>

          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 md:grid-cols-4 md:px-10">

        {[
          ["15+", "Courses"],
          ["10K+", "Learners"],
          ["50+", "Projects"],
          ["100%", "Certificate"],
        ].map(([number, label]) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition hover:border-cyan-400/30"
          >
            <h2 className="text-3xl font-black text-cyan-400">
              {number}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {label}
            </p>
          </div>
        ))}

      </section>

      {/* COURSES */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">

        <div className="mb-10">

          <p className="font-bold tracking-[0.2em] text-cyan-400">
            EXPLORE COURSES
          </p>

          <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <h2 className="text-4xl font-black md:text-5xl">
                Learn Skills That Matter
              </h2>

              <p className="mt-3 text-slate-400">
                Choose your path and start learning today.
              </p>

            </div>

            <span className="w-fit rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2.5 text-sm font-bold text-yellow-300">
              🏆 Certification Available
            </span>

          </div>

        </div>

        {/* CATEGORY BUTTONS */}
        <div className="mb-10 flex flex-wrap gap-3">

          {categories.map((category: string) => (

            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={
                activeCategory === category
                  ? "rounded-full border border-cyan-400 bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950"
                  : "rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-400"
              }
            >
              {category}
            </button>

          ))}

        </div>

        {/* COURSE COUNT */}
        <div className="mb-7 flex items-center justify-between">

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-300">
              {filteredCourses.length}
            </span>{" "}
            course
            {filteredCourses.length !== 1 ? "s" : ""}
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Clear search
            </button>
          )}

        </div>

        {/* COURSE GRID */}
        {filteredCourses.length > 0 ? (

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

            {filteredCourses.map((course: Course) => {

              const courseSlug = createSlug(course.title);

              return (

                <article
                  key={course.title}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-white/[0.08]"
                >

                  {/* IMAGE */}
                  <div className="relative h-52 overflow-hidden">

                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-slate-950/70 text-3xl backdrop-blur">
                      {course.icon}
                    </div>

                    <span className="absolute right-5 top-5 rounded-full border border-cyan-400/30 bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-cyan-300 backdrop-blur">
                      {course.category}
                    </span>

                  </div>

                  {/* CONTENT */}
                  <div className="p-7">

                    <h3 className="text-2xl font-black transition group-hover:text-cyan-400">
                      {course.title}
                    </h3>

                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-400">
                      {course.description}
                    </p>

                    {/* INFO */}
                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">

                        <p className="text-xs text-slate-500">
                          LEVEL
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-200">
                          📚 {course.level}
                        </p>

                      </div>

                      <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">

                        <p className="text-xs text-slate-500">
                          DURATION
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-200">
                          ⏱️ {course.duration}
                        </p>

                      </div>

                    </div>

                    {/* CERTIFICATE */}
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-3">

                      <span className="text-lg">
                        🏆
                      </span>

                      <span className="text-sm font-bold text-yellow-300">
                        Certificate Included
                      </span>

                    </div>

                    {/* VIEW COURSE */}
                    <a
                      href={`/courses/${courseSlug}`}
                      className="mt-6 block w-full rounded-xl bg-cyan-400 py-3.5 text-center font-black text-slate-950 transition hover:bg-cyan-300"
                    >
                      View Course →
                    </a>

                  </div>

                </article>

              );

            })}

          </div>

        ) : (

          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-20 text-center">

            <div className="text-6xl">
              🔎
            </div>

            <h3 className="mt-6 text-2xl font-black">
              No courses found
            </h3>

            <p className="mt-3 text-slate-400">
              Try another course name or select a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-7 rounded-xl bg-cyan-400 px-7 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Show All Courses
            </button>

          </div>

        )}

      </section>

      {/* CERTIFICATION CTA */}
      <section className="px-6 pb-24 md:px-10">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 p-10 md:p-16">

          <div className="grid gap-12 md:grid-cols-2 md:items-center">

            <div>

              <p className="font-bold tracking-[0.2em] text-cyan-400">
                GET CERTIFIED
              </p>

              <h2 className="mt-4 text-4xl font-black md:text-5xl">
                Learn Today.
                <br />
                Get Certified Tomorrow.
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-slate-400">
                Complete your course, pass the assessment and earn a
                professional certificate that showcases your new skills.
              </p>

              <a
                href="/login"
                className="mt-8 inline-block rounded-full bg-cyan-400 px-8 py-3.5 font-black text-slate-950 transition hover:bg-cyan-300"
              >
                Start Learning 🚀
              </a>

            </div>

            {/* CERTIFICATE PREVIEW */}
            <div className="flex justify-center">

              <div className="w-full max-w-sm rounded-3xl border border-yellow-400/30 bg-slate-950 p-8 text-center shadow-2xl">

                <div className="text-6xl">
                  🏆
                </div>

                <p className="mt-4 text-sm font-bold tracking-[0.2em] text-cyan-400">
                  LEARNHUB
                </p>

                <h3 className="mt-3 text-2xl font-black">
                  Certificate of Completion
                </h3>

                <div className="mx-auto my-6 h-px bg-white/10" />

                <p className="text-xs text-slate-500">
                  This certificate is proudly presented to
                </p>

                <p className="mt-3 text-xl font-black text-cyan-400">
                  Your Name
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  Successfully completed the course
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer
        id="about"
        className="border-t border-white/10 px-6 py-12 text-center"
      >

        <h2 className="text-2xl font-black">
          Learn<span className="text-cyan-400">Hub</span>
        </h2>

        <p className="mt-3 text-slate-500">
          Learn. Grow. Succeed.
        </p>

        <div className="mt-6 flex justify-center gap-6 text-sm text-slate-600">
          <span>📚 Courses</span>
          <span>🧠 Quizzes</span>
          <span>🏆 Certificates</span>
        </div>

        <p className="mt-6 text-sm text-slate-600">
          © 2026 LearnHub. All rights reserved.
        </p>

      </footer>

    </main>
  );
}