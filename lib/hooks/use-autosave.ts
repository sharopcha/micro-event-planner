import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useAutosave<T>(
  value: T,
  onSave: (value: T) => Promise<any>,
  delay: number = 2000,
  deps: any[] = []
) {
  const initialRender = useRef(true)
  const router = useRouter()
  const lastSavedValue = useRef<string>(JSON.stringify(value))

  const save = useCallback(async () => {
    const currentValue = JSON.stringify(value)
    if (currentValue === lastSavedValue.current) return

    try {
      await onSave(value)
      lastSavedValue.current = currentValue
      console.log('Autosaved')
      // router.refresh() // Optional: might cause focus loss if re-rendering too much
    } catch (error) {
      console.error('Autosave failed:', error)
      toast.error('Failed to save changes')
    }
  }, [value, onSave])

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }

    const handler = setTimeout(() => {
      save()
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [save, delay, ...deps])
}
