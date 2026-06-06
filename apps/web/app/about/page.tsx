import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4efe5] px-4 py-6 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,107,107,0.22),transparent_20%),radial-gradient(circle_at_82%_18%,rgba(255,217,61,0.3),transparent_18%),radial-gradient(circle_at_78%_82%,rgba(196,181,253,0.22),transparent_20%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="pointer-events-none absolute -left-10 top-24 h-36 w-36 rotate-12 border-4 border-black bg-neo-accent shadow-[8px_8px_0px_0px_#000]" />
      <div className="pointer-events-none absolute bottom-12 right-12 h-44 w-44 rounded-full border-4 border-black bg-neo-secondary shadow-[8px_8px_0px_0px_#000]" />
      <div className="pointer-events-none absolute bottom-28 left-16 h-20 w-56 -rotate-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000]" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col border-4 border-black bg-background shadow-[10px_10px_0px_0px_#000]">
        <header className="border-b-4 border-black bg-[#f4efe5] px-6 py-4">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center border-4 border-black bg-neo-secondary text-3xl font-black shadow-[4px_4px_0px_0px_#000]">
                A
              </div>
              <div className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
                ADORA.
              </div>
            </div>

            <nav
              aria-label="About navigation"
              className="flex flex-wrap items-center gap-6 text-lg font-black uppercase lg:gap-9"
            >
              <Link href="/" className="hover:text-neo-accent">
                Home
              </Link>
              <Link href="/get-started" className="hover:text-neo-accent">
                Get Started
              </Link>
            </nav>
          </div>
        </header>

        <section className="neo-dots relative flex flex-1 items-center overflow-hidden px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
          <div className="absolute left-8 top-10 h-20 w-20 rotate-[10deg] border-4 border-black bg-neo-accent shadow-[4px_4px_0px_0px_#000]" />
          <div className="absolute bottom-10 right-10 h-24 w-24 rounded-full border-4 border-black bg-neo-secondary shadow-[4px_4px_0px_0px_#000]" />

          <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-4">
              <div className="inline-block rotate-[-2deg] border-4 border-black bg-white px-4 py-3 shadow-[8px_8px_0px_0px_#000]">
                <p className="text-sm font-black uppercase tracking-[0.22em]">
                  About Adora
                </p>
              </div>

              <div className="neo-headline-card w-fit rotate-[1deg] border-4 border-black bg-neo-secondary px-5 py-4 shadow-[8px_8px_0px_0px_#000]">
                <h1 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.08em] sm:text-5xl lg:text-6xl">
                  Ads should understand the moment.
                </h1>
              </div>
            </div>

            <article className="rotate-[-1deg] border-4 border-black bg-white p-6 text-lg leading-relaxed shadow-[10px_10px_0px_0px_#000] sm:p-8 sm:text-xl">
              <p>
                Adora is an interactive AI video advertising experience designed
                to make ads feel less interruptive and more respectful.
              </p>
              <p className="mt-5">
                Instead of showing the same generic ad to every viewer,
                Adora understands the video context, introduces a
                Tavus-powered AI agent, listens to viewer
                feedback, and adapts the ad experience in real time.
              </p>
              <p className="mt-5">
                The goal is simple: ads should understand the moment, not
                interrupt it.
              </p>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
