'use client'

import { useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark' | 'system'

/**
 * Custom hook for managing theme state with proper hydration handling.
 * 
 * IMPORTANT: Even though this project uses static export (output: 'export' in next.config.js),
 * we still need to handle React hydration properly. Here's why:
 * 
 * 1. Next.js pre-renders pages to static HTML at build time (without access to localStorage/window)
 * 2. This static HTML is sent to the browser
 * 3. React then "hydrates" the HTML - it runs your components and tries to match the initial render
 * 4. If the first render tries to read localStorage, it won't match the static HTML
 * 5. This causes hydration mismatch errors and visual flashing
 * 
 * The Solution:
 * - Always start with a default state ('system') that matches what was rendered in the static HTML
 * - Use the 'mounted' flag to detect when we're running in the browser
 * - Only access browser APIs (localStorage, window.matchMedia) after the component mounts
 * - This ensures the first render matches the static HTML, avoiding hydration errors
 * 
 * Without this pattern, users would see:
 * - Console errors about hydration mismatches
 * - Brief flash of wrong theme on page load
 * - Potential layout shifts
 */
export function useTheme() {
  // Start with 'system' to match the static HTML (no localStorage access during build)
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage AFTER mount (client-side only)
  // This runs after hydration is complete, so it's safe to access localStorage
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setThemeState(savedTheme)
    }
  }, [])

  // Wrapper function that updates state AND localStorage
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }, [])

  useEffect(() => {
    // Don't apply theme changes until mounted to avoid hydration mismatch
    // The 'mounted' check ensures we skip the first render (which must match static HTML)
    if (!mounted) return

    const root = window.document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')

    // Determine the actual theme to apply
    let appliedTheme: 'light' | 'dark'
    
    if (theme === 'system') {
      // Use system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      appliedTheme = systemTheme
    } else {
      appliedTheme = theme
    }

    // Apply the theme
    root.classList.add(appliedTheme)
    setResolvedTheme(appliedTheme)
  }, [theme, mounted])

  useEffect(() => {
    // Listen for system theme changes when in 'system' mode
    if (!mounted || theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      const newTheme = e.matches ? 'dark' : 'light'
      root.classList.add(newTheme)
      setResolvedTheme(newTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, mounted])

  return {
    theme,
    resolvedTheme,
    setTheme,
  }
}

