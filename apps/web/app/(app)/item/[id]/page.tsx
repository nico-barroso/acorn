'use client'

import { useEffect, useState } from 'react'
import { ItemDetail } from '@/features/item/screens/ItemDetail/ItemDetail'
import { AcornLoader } from '@/features/shared/components/AcornLoader/AcornLoader'
import { usePageLoader } from '@/hooks/usePageLoader'

export default function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const [itemId, setItemId] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => setItemId(p.id))
  }, [params])

  const { showLoader, exiting: loaderExiting } = usePageLoader(!itemId)

  if (showLoader) {
    return <AcornLoader label="Cargando recurso" fullScreen exiting={loaderExiting} />
  }

  return (
    <div className="page-enter">
      <ItemDetail itemId={itemId!} />
    </div>
  )
}
