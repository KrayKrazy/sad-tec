import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: {
    regular: string
    gradient: string
  }
  description?: string
  ctaText?: string
  ctaHref?: string
  bottomImage?: {
    light: string
    dark: string
  }
  gridOptions?: {
    angle?: number
    cellSize?: number
    opacity?: number
    lightLineColor?: string
    darkLineColor?: string
  }
}

const RetroGrid = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lightLineColor = "gray",
  darkLineColor = "gray",
}) => {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor,
  } as React.CSSProperties

  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        `opacity-[var(--opacity)]`,
      )}
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div className="animate-grid [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] [height:300vh] [inset:0%_0px] [margin-left:-200%] [transform-origin:100%_0_0] [width:600vw] dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-[#0B0D13]" />
    </div>
  )
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      title = "SAD Tec Premium",
      subtitle = {
        regular: "Assistência Técnica em ",
        gradient: "TVs Borda Infinita.",
      },
      description = "Conserto especializado, laudo técnico avançado e garantia de 12 meses. O laboratório de microeletrônica mais avançado da cidade.",
      ctaText = "Emitir Ordem de Serviço",
      ctaHref = "#admin",
      bottomImage = {
        light: "https://farmui.vercel.app/dashboard-light.png",
        dark: "https://cdn.21st.dev/assets/mirror/46/46904d9ee222c3e5bedbf3f2f56d7bcc97f3a9b2ecd8331ad43b3518e72ad799.png",
      },
      gridOptions,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("relative overflow-hidden", className)} ref={ref} {...props}>
        <div className="absolute top-0 z-[0] h-screen w-screen bg-cyan-950/10 dark:bg-cyan-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(0,229,255,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(0,229,255,0.3),rgba(255,255,255,0))]" />
        <section className="relative max-w-full mx-auto z-10 pt-10">
          <RetroGrid {...gridOptions} />
          <div className="max-w-screen-xl z-10 mx-auto px-4 py-28 gap-12 md:px-8">
            <div className="space-y-5 max-w-3xl leading-0 lg:leading-5 mx-auto text-center">
              <h1 className="text-sm text-gray-600 dark:text-cyan-400 group font-geist mx-auto px-5 py-2 bg-gradient-to-tr from-zinc-300/20 via-gray-400/20 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5 border-[2px] border-black/5 dark:border-cyan-500/20 rounded-3xl w-fit">
                {title}
                <ChevronRight className="inline w-4 h-4 ml-2 group-hover:translate-x-1 duration-300" />
              </h1>
              <h2 className="text-4xl tracking-tighter font-geist bg-clip-text text-transparent mx-auto md:text-6xl bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]">
                {subtitle.regular}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500">
                  {subtitle.gradient}
                </span>
              </h2>
              <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                {description}
              </p>
              <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0 mt-8">
                <span className="relative inline-block overflow-hidden rounded-full p-[1.5px] mt-6">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00E5FF_0%,#0055FF_50%,#00E5FF_100%)]" />
                  <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white dark:bg-[#0B0D13] text-xs font-medium backdrop-blur-3xl">
                    <button
                      onClick={() => {
                        const target = document.getElementById('admin');
                        if(target) target.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex rounded-full text-center group items-center w-full justify-center bg-gradient-to-tr from-zinc-300/20 via-cyan-400/30 to-transparent dark:from-zinc-300/5 dark:via-cyan-400/20 text-gray-900 dark:text-white border-input border-[1px] hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-cyan-400/40 hover:to-transparent dark:hover:from-zinc-300/10 dark:hover:via-cyan-400/30 transition-all sm:w-auto py-4 px-10 text-base font-bold"
                    >
                      {ctaText}
                    </button>
                  </div>
                </span>
              </div>
            </div>
            {bottomImage && (
              <div className="mt-32 mx-10 relative z-10 flex justify-center">
                <img
                  src={bottomImage.light}
                  className="w-full max-w-5xl shadow-2xl rounded-xl border border-gray-200 dark:hidden"
                  alt="SAD Tec Laboratório"
                />
                <img
                  src={bottomImage.dark}
                  className="hidden w-full max-w-5xl shadow-[0_0_40px_rgba(0,229,255,0.2)] rounded-xl border border-cyan-900/30 dark:block"
                  alt="SAD Tec Laboratório Dark Mode"
                />
              </div>
            )}
          </div>
        </section>
      </div>
    )
  },
)
HeroSection.displayName = "HeroSection"

export { HeroSection }
