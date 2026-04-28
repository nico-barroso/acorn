'use client'

import { useEffect, useState } from 'react'
import { ItemDetail } from '@/features/item/screens/ItemDetail/ItemDetail'

export default function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const [itemId, setItemId] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => setItemId(p.id))
  }, [params])

  if (!itemId) {
    return (
      <main style={{ padding: '20px 24px' }}>
        <p style={{ color: '#48392A' }}>Cargando recurso...</p>
      </main>
    )
  }

  return <ItemDetail itemId={itemId} />
}