'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { FolderDetailScreen } from '@/features/folders/screens/FolderDetailScreen/FolderDetailScreen'

export default function FolderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <FolderDetailScreen folderId={id} />
}