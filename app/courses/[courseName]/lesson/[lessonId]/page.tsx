"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Lesson = {
  id: number;
  documentId?: string;
  title: string;
  content: string;
  videoUrl?: string;
  order?: number;
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();

  const courseName = String(params.courseName || "");
  const lessonId = Number(params.lessonId);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function createSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function youtubeUrl(url: string) {
    try {
      const parsed = new URL(url);

      if (parsed.hostname.includes("youtube.com")) {
        const videoId = parsed.searchParams.get("v");

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (parsed.hostname.includes("youtu.be")) {
        const videoId = parsed.pathname.substring(1);

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      return url;
    } catch {
      return url;
    }
  }

  useEffect(() => {
    async function getLesson() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
  "https://learnhub-backend-production-2413.up.railway.app/api/lessons?populate=*&pagination[pageSize]=100"
);

        if (!response.ok) {
          throw new Error("Failed to fetch lessons");
        }

        const result = await response.json();

        const lessons = result?.data || [];

        console.log("ALL LESSONS:", lessons);
        console.log("COURSE:", courseName);
        console.log("LESSON:", lessonId);

        const courseLessons = lessons
          .filter((item: any) => {
            const data = item.attributes || item;

            const course = data.course;

            if (!course) {
              return false;
            }

            const courseData = course.data || course;

            const courseAttributes =
              courseData.attributes || courseData;

            const courseTitle =
              courseAttributes.title || "";

            const courseSlug =
              courseAttributes.slug || "";

            const courseDocumentId =
              courseData.documentId || "";

            return (
              createSlug(courseTitle) === courseName ||
              courseSlug === courseName ||
              courseDocumentId === courseName
            );
          })
          .sort((a: any, b: any) => {
            const orderA = Number(
              (a.attributes || a).order || 0
            );

            const orderB = Number(
              (b.attributes || b).order || 0
            );

            return orderA - orderB;
          });

        console.log("COURSE LESSONS:", courseLessons);

        let selectedLesson = courseLessons.find(
          (item: any) => {
            const data = item.attributes || item;

            return Number(data.order) === lessonId;
          }
        );

        if (!selectedLesson) {
          selectedLesson = courseLessons[lessonId - 1];
        }

        if (!selectedLesson) {
          setError("Lesson not found");
          return;
        }

        const data =
          selectedLesson.attributes || selectedLesson;

        setLesson({
          id: selectedLesson.id,
          documentId: selectedLesson.documentId,
          title: data.title || "Untitled Lesson",
          content: data.content || "",
          videoUrl: data.videoUrl || "",
          order: Number(data.order) || lessonId,
        });
      } catch (error) {
        console.error("LESSON ERROR:", error);
        setError("Unable to load lesson");
      } finally {
        setLoading(false);
      }
    }

    getLesson();
  }, [courseName, lessonId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-xl text-slate-400">
          Loading lesson...
        </p>
      </main>
    );
  }

  if (error || !lesson) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <div className="text-6xl">📚</div>

          <h1 className="mt-6 text-3xl font-black">
            Lesson not found
          </h1>

          <p className="mt-4 text-slate-400">
            Course: {courseName}
          </p>

          <p className="mt-2 text-slate-400">
            Lesson: {lessonId}
          </p>

          <button
            onClick={() =>
              router.push(`/courses/${courseName}`)
            }
            className="mt-8 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950"
          >
            ← Back to Course
          </button>
        </div>
      </main>
    );
  }

  /*
   * Your requirement:
   * Lesson 1 → Lesson 2
   * Lesson 2 → Lesson 3
   * Lesson 3 → Course Completed → Quiz
   */
  const isLastLesson = lessonId >= 3;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}

      <nav className="border-b border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button
            onClick={() =>
              router.push(`/courses/${courseName}`)
            }
            className="text-2xl font-black"
          >
            Learn
            <span className="text-cyan-400">Hub</span>
          </button>

          <button
            onClick={() =>
              router.push(`/courses/${courseName}`)
            }
            className="rounded-xl border border-white/10 px-5 py-2 text-sm font-bold transition hover:border-cyan-400"
          >
            ← Back to Course
          </button>
        </div>
      </nav>

      {/* LESSON */}

      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="font-bold tracking-[0.2em] text-cyan-400">
          LESSON {lesson.order || lessonId}
        </p>

        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          {lesson.title}
        </h1>

        <p className="mt-4 text-slate-400">
          Course: {courseName}
        </p>

        {/* VIDEO */}

        {lesson.videoUrl && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-black">
            <div className="aspect-video">
              <iframe
                src={youtubeUrl(lesson.videoUrl)}
                title={lesson.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* CONTENT */}

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-black">
            About this lesson
          </h2>

          <p className="mt-5 whitespace-pre-line leading-8 text-slate-300">
            {lesson.content}
          </p>
        </div>

        {/* NAVIGATION */}

        {!isLastLesson ? (
          <div className="mt-10 flex items-center justify-between gap-4">
            {/* PREVIOUS */}

            {lessonId > 1 ? (
              <button
                onClick={() =>
                  router.push(
                    `/courses/${courseName}/lesson/${lessonId - 1}`
                  )
                }
                className="rounded-xl border border-white/10 px-6 py-3 font-bold transition hover:border-cyan-400 hover:text-cyan-400"
              >
                ← Previous Lesson
              </button>
            ) : (
              <button
                onClick={() =>
                  router.push(`/courses/${courseName}`)
                }
                className="rounded-xl border border-white/10 px-6 py-3 font-bold transition hover:border-cyan-400"
              >
                ← Course
              </button>
            )}

            {/* NEXT */}

            <button
              onClick={() =>
                router.push(
                  `/courses/${courseName}/lesson/${lessonId + 1}`
                )
              }
              className="rounded-xl bg-cyan-400 px-7 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
            >
              Complete Lesson → Next Lesson
            </button>
          </div>
        ) : (
          /* COURSE COMPLETED */
          <div className="mt-10 rounded-3xl border border-cyan-400/30 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 p-10 text-center">
            <div className="text-6xl">🎉</div>

            <h2 className="mt-5 text-3xl font-black md:text-4xl">
              Course Completed!
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
              Congratulations! You have completed all 3
              lessons in this course.
            </p>

            <p className="mx-auto mt-2 max-w-xl leading-7 text-slate-400">
              Now test your knowledge by taking the quiz.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() =>
                  router.push(`/courses/${courseName}`)
                }
                className="rounded-xl border border-white/10 px-7 py-3 font-bold transition hover:border-cyan-400"
              >
                ← Back to Course
              </button>

              <button
                onClick={() =>
                  router.push(
                    `/courses/${courseName}/quiz`
                  )
                }
                className="rounded-xl bg-cyan-400 px-8 py-3.5 font-black text-slate-950 transition hover:bg-cyan-300"
              >
                🧠 Take Quiz →
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}