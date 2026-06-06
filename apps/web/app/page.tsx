import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1 bg-background">
      <section className="mx-auto flex h-screen w-full flex-col overflow-hidden border-4 border-black bg-background">
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

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-14">
              <nav
                aria-label="Primary navigation"
                className="flex flex-wrap items-center gap-6 text-lg font-black uppercase lg:gap-9"
              >
                <a href="/about" className="hover:text-neo-accent">
                  About
                </a>
              </nav>

              <div className="flex items-center gap-6 lg:gap-10">
                <a
                  href="/get-started"
                  className="neo-button bg-neo-accent px-8 py-4 text-base shadow-[8px_8px_0px_0px_#000]"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </header>

        <section className="neo-dots relative flex-1 overflow-hidden px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
          <div className="absolute left-6 top-14 flex h-18 w-18 rotate-[11deg] items-center justify-center border-4 border-black bg-neo-accent shadow-[4px_4px_0px_0px_#000]">
            <Image
              src="/redis.png"
              alt="Redis logo"
              width={50}
              height={50}
              className="h-12 w-12 object-contain"
              priority
            />
          </div>
          <div className="absolute right-8 top-36 flex h-24 w-24 items-center justify-center rounded-full border-4 border-black bg-neo-secondary sm:right-12 sm:top-40 lg:h-28 lg:w-28">
            <Image
              src="/tavus.png"
              alt="Tavus logo"
              width={58}
              height={58}
              className="h-14 w-14 object-contain"
              priority
            />
          </div>

          <div className="relative z-10 mx-auto flex h-full max-w-[1380px] flex-col justify-center">
            <div className="neo-headline-card w-fit rotate-[-0.8deg] border-4 border-black bg-white px-4 py-3 shadow-[8px_8px_0px_0px_#000] sm:px-7 sm:py-4">
              <h1 className="text-[3rem] font-black uppercase leading-[0.9] tracking-[-0.08em] sm:text-[5rem] lg:text-[7rem] xl:text-[8rem]">
                <span className="neo-headline-text">Transform</span>
              </h1>
            </div>

            <div className="neo-headline-card neo-headline-card--yellow w-fit rotate-[2deg] border-4 border-black bg-neo-secondary px-4 py-4 shadow-[8px_8px_0px_0px_#000] sm:-mt-2 sm:px-7 sm:py-4 lg:ml-24 lg:px-9">
              <h2 className="text-[3.15rem] font-black uppercase leading-[0.88] tracking-[-0.08em] sm:text-[5.25rem] lg:text-[7.15rem] xl:text-[8.35rem]">
                <span className="neo-headline-text block">The Way Your</span>
                <span className="neo-headline-text block">ADs Works</span>
              </h2>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
