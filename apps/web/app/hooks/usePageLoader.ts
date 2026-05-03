import { useEffect, useState } from 'react'

export function usePageLoader(loading: boolean) {
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'done'>(
    loading ? 'loading' : 'done'
  )

  // Cuando loading termina, dispara la animación de salida
  useEffect(() => {
    if (!loading) {
      setPhase(p => p === 'loading' ? 'exiting' : p)
    }
  }, [loading])

  // Cuando phase llega a 'exiting', espera 300ms y pasa a 'done'
  useEffect(() => {
    if (phase !== 'exiting') return
    const t = setTimeout(() => setPhase('done'), 300)
    return () => clearTimeout(t)
  }, [phase])

  return {
    showLoader: phase !== 'done',
    exiting: phase === 'exiting',
  }
}
