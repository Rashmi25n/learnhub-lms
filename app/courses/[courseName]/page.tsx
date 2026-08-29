import Link from "next/link";
import { notFound } from "next/navigation";

type Course = {
  slug: string;
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
    slug: "python-programming",
    icon: "🐍",
    title: "Python Programming",
    category: "Programming",
    level: "Beginner",
    duration: "8 weeks",
    description:
      "Learn Python from the basics to advanced concepts, including variables, functions, OOP, and practical programming.",
    thumbnail:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "artificial-intelligence",
    icon: "🤖",
    title: "Artificial Intelligence",
    category: "AI",
    level: "Beginner",
    duration: "10 weeks",
    description:
      "Learn the fundamentals of artificial intelligence and build intelligent applications.",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "machine-learning",
    icon: "🧠",
    title: "Machine Learning",
    category: "AI",
    level: "Intermediate",
    duration: "10 weeks",
    description:
      "Learn supervised and unsupervised learning and build practical machine learning models.",
    thumbnail:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "data-science",
    icon: "📈",
    title: "Data Science",
    category: "Data",
    level: "Advanced",
    duration: "12 weeks",
    description:
      "Learn data analysis, statistics, visualization and machine learning for real-world problems.",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "data-analytics",
    icon: "📊",
    title: "Data Analytics",
    category: "Data",
    level: "Intermediate",
    duration: "8 weeks",
    description:
      "Analyze business data using Python, SQL, statistics and visualization tools.",
    thumbnail:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "sql-and-database-management",
    icon: "🗄️",
    title: "SQL & Database Management",
    category: "Database",
    level: "Beginner",
    duration: "7 weeks",
    description:
      "Master SQL queries, joins, relationships and database management.",
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "power-bi-and-business-intelligence",
    icon: "📉",
    title: "Power BI & Business Intelligence",
    category: "Analytics",
    level: "Intermediate",
    duration: "6 weeks",
    description:
      "Create interactive dashboards and generate useful business insights with Power BI.",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "full-stack-web-development",
    icon: "💻",
    title: "Full Stack Web Development",
    category: "Development",
    level: "Advanced",
    duration: "12 weeks",
    description:
      "Build modern web applications using frontend, backend, databases and APIs.",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "reactjs",
    icon: "⚛️",
    title: "React.js",
    category: "Web Development",
    level: "Intermediate",
    duration: "7 weeks",
    description:
      "Build interactive web applications using React components, hooks and APIs.",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "nextjs",
    icon: "▲",
    title: "Next.js",
    category: "Web Development",
    level: "Advanced",
    duration: "7 weeks",
    description:
      "Learn modern Next.js development including routing, server components and APIs.",
    thumbnail:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "cloud-computing",
    icon: "☁️",
    title: "Cloud Computing",
    category: "Cloud",
    level: "Intermediate",
    duration: "8 weeks",
    description:
      "Learn cloud concepts, deployment, storage, networking and cloud services.",
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "git-and-github",
    icon: "🐙",
    title: "Git & GitHub",
    category: "Developer Tools",
    level: "Beginner",
    duration: "3 weeks",
    description:
      "Learn version control, branching, merging and collaborative software development.",
    thumbnail:
      "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "devops-engineering",
    icon: "🚀",
    title: "DevOps Engineering",
    category: "DevOps",
    level: "Advanced",
    duration: "10 weeks",
    description:
      "Learn CI/CD, containers, deployment automation and DevOps practices.",
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "natural-language-processing",
    icon: "💬",
    title: "Natural Language Processing",
    category: "AI",
    level: "Advanced",
    duration: "8 weeks",
    description:
      "Learn how computers process human language using modern NLP techniques.",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "computer-vision",
    icon: "👁️",
    title: "Computer Vision",
    category: "AI",
    level: "Advanced",
    duration: "8 weeks",
    description:
      "Build AI systems that understand images using computer vision and deep learning.",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  },
];

type PageProps = {
  params: Promise<{
    courseName: string;
  }>;
};

export function generateStaticParams() {
  return courses.map((course) => ({
    courseName: course.slug,
  }));
}

export default async function CoursePage({ params }: PageProps) {
  const { courseName } = await params;

  const course = courses.find(
    (item) => item.slug === courseName.toLowerCase()
  );

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 px-6 py-5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            Learn<span className="text-cyan-400">Hub</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-semibold text-slate-300 transition hover:text-cyan-400"
            >
              Home
            </Link>

            <Link
              href="/courses"
              className="font-bold text-cyan-400"
            >
              Courses
            </Link>

            <Link
              href="/login"
              className="rounded-full bg-cyan-400 px-6 py-2.5 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 transition hover:text-cyan-300"
          >
            ← Back to Courses
          </Link>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-2">
            {/* LEFT */}
            <div>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/10 text-5xl">
                  {course.icon}
                </div>

                <div>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">
                    {course.category}
                  </span>
                </div>
              </div>

              <h1 className="text-5xl font-black leading-tight md:text-7xl">
                {course.title}
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
                {course.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-xs font-bold text-slate-500">
                    LEVEL
                  </p>
                  <p className="mt-1 font-bold">
                    📚 {course.level}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-xs font-bold text-slate-500">
                    DURATION
                  </p>
                  <p className="mt-1 font-bold">
                    ⏱️ {course.duration}
                  </p>
                </div>

                <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 px-5 py-4">
                  <p className="text-xs font-bold text-yellow-500">
                    BENEFIT
                  </p>
                  <p className="mt-1 font-bold text-yellow-300">
                    🏆 Certificate
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={`/courses/${course.slug}/lesson/1`}
                  className="rounded-xl bg-cyan-400 px-8 py-4 font-black text-slate-950 transition hover:bg-cyan-300"
                >
                  Start Learning 🚀
                </Link>

                <Link
                  href="/courses"
                  className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-white transition hover:bg-white/10"
                >
                  Explore More Courses
                </Link>
              </div>
            </div>

            {/* IMAGE */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-[420px] w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500">
                      COURSE STATUS
                    </p>
                    <p className="mt-1 font-black text-cyan-400">
                      Ready to Learn
                    </p>
                  </div>

                  <div className="text-3xl">🎯</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSE CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* LESSONS */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:border-cyan-400/30">
            <div className="text-4xl">📚</div>

            <h2 className="mt-5 text-2xl font-black">
              Lessons
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Learn step by step through structured lessons designed
              to build your knowledge from the fundamentals.
            </p>

            <Link
              href={`/courses/${course.slug}/lesson/1`}
              className="mt-6 inline-block font-bold text-cyan-400 hover:text-cyan-300"
            >
              Start Lesson 1 →
            </Link>
          </div>

          {/* QUIZ */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:border-cyan-400/30">
            <div className="text-4xl">🧠</div>

            <h2 className="mt-5 text-2xl font-black">
              Quiz
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Test your understanding after completing the lessons
              and measure your learning progress.
            </p>

            <Link
              href={`/courses/${course.slug}/quiz`}
              className="mt-6 inline-block font-bold text-cyan-400 hover:text-cyan-300"
            >
              Take Quiz →
            </Link>
          </div>

          {/* CERTIFICATE */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:border-cyan-400/30">
            <div className="text-4xl">🏆</div>

            <h2 className="mt-5 text-2xl font-black">
              Certificate
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Complete the course and assessment to earn your
              LearnHub certificate.
            </p>

            <Link
              href={`/certificate/${course.slug}`}
              className="mt-6 inline-block font-bold text-cyan-400 hover:text-cyan-300"
            >
              View Certificate →
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT YOU WILL LEARN */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 p-8 md:p-12">
          <p className="font-bold tracking-[0.2em] text-cyan-400">
            YOUR LEARNING JOURNEY
          </p>

          <h2 className="mt-4 text-4xl font-black">
            What You&apos;ll Get
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Structured course lessons",
              "Practical learning experience",
              "Course assessment",
              "Progress tracking",
              "Hands-on learning",
              "Certificate of completion",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 font-black text-slate-950">
                  ✓
                </span>

                <span className="font-semibold text-slate-200">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href={`/courses/${course.slug}/lesson/1`}
              className="inline-block rounded-xl bg-cyan-400 px-8 py-4 font-black text-slate-950 transition hover:bg-cyan-300"
            >
              Begin {course.title} →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-12 text-center">
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