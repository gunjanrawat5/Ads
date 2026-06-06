import Link from "next/link";

export default function GetStartedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1b1b1b] px-4 py-6 text-[#fff8d6]">
      <section className="w-full max-w-5xl border-2 border-[#f3e8a6] bg-[#1b1b1b] p-3 font-mono shadow-[10px_10px_0px_0px_#000]">
        <div className="border-2 border-[#f3e8a6]">
          <div className="flex items-center justify-between gap-4 border-b-2 border-[#f3e8a6] px-3 py-3 text-sm sm:text-lg">
            <div className="flex items-center gap-2">
              <span>MomentSense Ads</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-5">
              <span>Memory: On</span>
              <button
                type="button"
                className="border-l-2 border-[#f3e8a6] pl-3 text-[#fff8d6] transition-colors duration-150 hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid min-h-[18rem] grid-cols-1 border-b-2 border-[#f3e8a6] md:grid-cols-[1.65fr_1fr]">
            <div className="border-b-2 border-[#f3e8a6] px-5 py-8 md:border-b-0 md:border-r-2 md:border-[#f3e8a6]">
              <div className="flex h-full flex-col items-start justify-center gap-4 text-lg sm:text-2xl">
                <p>Video Player</p>
                <p className="max-w-md leading-relaxed">
                  Tavus Agent pops up here
                </p>
                <p className="max-w-md leading-relaxed">
                  as floating picture-in-picture
                </p>
              </div>
            </div>

            <aside className="flex flex-col justify-start px-3 py-4 text-lg sm:px-4 sm:text-2xl">
              <div className="space-y-3 border-l-2 border-[#7bdff6] pl-3">
                <p>Context Intelligence</p>
                <p>Preference Memory</p>
                <p>Next Ad Strategy</p>
              </div>
            </aside>
          </div>

          <div className="px-3 py-4 sm:px-4 sm:py-5">
            <div className="flex flex-col gap-4 text-sm sm:text-lg">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span>Timeline: 00:00</span>
                <div className="relative h-4 flex-1 min-w-[12rem]">
                  <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-[#f3e8a6]" />
                  <span className="absolute left-[18%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white" />
                  <span className="absolute left-[55%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white" />
                </div>
                <span>03:00</span>
                <span className="ml-auto hidden text-[#ff7a7a] sm:inline">|</span>
              </div>

              <div className="flex items-center gap-8 pl-32 text-sm sm:gap-10 sm:text-lg">
                <button
                  type="button"
                  className="transition-colors duration-150 hover:text-white"
                >
                  Ad 1
                </button>
                <button
                  type="button"
                  className="transition-colors duration-150 hover:text-white"
                >
                  Ad 2
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 font-sans text-xs font-black uppercase tracking-[0.18em] text-white sm:text-sm">
          <Link href="/" className="hover:text-[#ffd93d]">
            Back
          </Link>
          <button
            type="button"
            className="border-2 border-[#f3e8a6] bg-[#ff6b6b] px-4 py-2 text-black transition-transform duration-150 hover:-translate-y-0.5"
          >
            Start Session
          </button>
        </div>
      </section>
    </main>
  );
}
