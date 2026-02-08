import { useCallback, useEffect, useRef, useState } from "react"

import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"
import type { Theme } from "@/providers"
import { Sun } from "../animate-ui/icons/sun"
import { MoonStar } from "../animate-ui/icons/moon-star"
import { SunMoon } from "../animate-ui/icons/sun-moon"

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const AnimatedThemeToggler = ({
  setTheme,
  theme,
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const [isDark, setIsDark] = useState(false)
  
  const buttonRef = useRef<HTMLButtonElement>(null)

  const getTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return theme;
  }

  const rotateTheme = () => {
    switch (theme) {
      case 'dark':
        setTheme('light');
        break;
      case 'light':
        setTheme('system');
        break;
      case 'system':
        setTheme('dark');
        break;
    }
  }


  useEffect(() => {
    const updateTheme = () => {
      setIsDark(getTheme() === 'dark')
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [theme])

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    await document.startViewTransition(() => {
      flushSync(() => {
        const newTheme = getTheme() === 'dark'
        setIsDark(newTheme)
        rotateTheme()
        document.documentElement.classList.toggle("dark")
        
      })
    }).ready

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [isDark, theme, duration])

  return (
    <button
      ref={buttonRef}
      // variant={'outline'}
      onClick={toggleTheme}
      className={cn('cursor-pointer',className)}
      {...props}
    >
          
        {theme === 'dark' && <MoonStar animate animateOnHover className='w-5! h-5!'/> }
        {theme === 'light' && <Sun animate animateOnHover className='w-5! h-5!'/> }
        {theme === 'system' && <SunMoon animate animateOnHover className='w-5! h-5!'/> }
     
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
