import { useEffect, useState } from 'react'

interface UseAnimationStateOptions {
  duration?: number
  trackDirection?: boolean
}

interface AnimationState {
  animating: boolean
  lastAction: 'increase' | 'decrease' | null
}

interface AnimationStateReturn extends AnimationState {
  setLastAction: (action: 'increase' | 'decrease') => void
  setAnimating: (animating: boolean) => void
}

export function useAnimationState(
  watchValue: any,
  options: UseAnimationStateOptions = {}
): AnimationStateReturn {
  const { duration = 200, trackDirection = true } = options
  
  const [animating, setAnimating] = useState<boolean>(false)
  const [lastAction, setLastAction] = useState<'increase' | 'decrease' | null>(null)

  useEffect(() => {
    setAnimating(true)
    const timer = setTimeout(() => {
      setAnimating(false)
      if (trackDirection) {
        setLastAction(null)
      }
    }, duration)
    return () => clearTimeout(timer)
  }, [watchValue, duration, trackDirection])

  return {
    animating,
    lastAction,
    setLastAction,
    setAnimating
  }
}

