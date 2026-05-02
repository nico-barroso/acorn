'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FolderCard } from '@/features/shared/components/FolderCard/FolderCard'
import { useFolders } from '../../hooks/useFolders'
import { RenameFolderModal } from '../../components/RenameFolderModal/RenameFolderModal'
import { SmartFolderBuilder } from '../../components/SmartFolderBuilder/SmartFolderBuilder'
import { foldersScreenStyles as s } from './FoldersScreen.styles'

export function FoldersScreen() {
  const router = useRouter()
  const {
    folders,
    loading,
    error,
    renamingFolder,
    setRenamingFolder,
    deletingFolderId,
    renameFolder,
    deleteFolder,
    fetchFolders
  } = useFolders()

  const [showSmartBuilder, setShowSmartBuilder] = useState(false)

  const handleFolderClick = (folderId: string) => {
    router.push(`/folders/${folderId}`)
  }

  const handleDelete = async (folderId: string) => {
    if (confirm('¿Estas seguro de que quieres eliminar esta carpeta?')) {
      await deleteFolder(folderId)
    }
  }

  return (
    <main style={s.page}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={s.header}>
        <div style={s.titleRow}>
          <h1 style={s.title}>
            Tus<br />carpetas.
          </h1>
          <button
            type='button'
            style={s.newButton}
            onClick={() => setShowSmartBuilder(true)}
          >
            + Nueva carpeta
          </button>
        </div>
      </header>

      {/* ── Divider ────────────────────────────────────────── */}
      {!loading && !error && (
        <div style={s.divider}>
          <span style={s.dividerCount}>
            {folders.length === 0
              ? 'sin carpetas'
              : `${folders.length} carpeta${folders.length === 1 ? '' : 's'}`}
          </span>
          <div style={s.dividerLine} />
        </div>
      )}

      {/* ── Content ────────────────────────────────────────── */}
      {loading ? (
        <p style={s.loading}>Cargando carpetas...</p>
      ) : error ? (
        <p style={s.errorText}>{error}</p>
      ) : folders.length === 0 ? (
        <section style={s.emptyState}>
          <p style={s.emptyEyebrow}>Por aquí todo está tranquilo</p>
          <h2 style={s.emptyTitle}>Tu primera carpeta<br />te espera.</h2>
          <p style={s.emptyText}>
            Crea una carpeta inteligente y empieza a<br />organizar tu biblioteca.
          </p>
          <button
            type='button'
            style={s.emptyCtaButton}
            onClick={() => setShowSmartBuilder(true)}
          >
            Crear carpeta →
          </button>
        </section>
      ) : (
        <section style={s.list}>
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              id={folder.id}
              name={folder.name}
              subtitle={new Date(folder.createdAt).toLocaleDateString()}
              description={folder.description}
              isDeleting={deletingFolderId === folder.id}
              ruleCount={folder.ruleCount}
              onClick={() => handleFolderClick(folder.id)}
              onRename={() => setRenamingFolder(folder)}
              onDelete={() => handleDelete(folder.id)}
            />
          ))}
        </section>
      )}

      {renamingFolder ? (
        <RenameFolderModal
          currentName={renamingFolder.name}
          onClose={() => setRenamingFolder(null)}
          onRename={async (newName) => {
            const success = await renameFolder(renamingFolder.id, newName)
            if (success) setRenamingFolder(null)
            return success
          }}
        />
      ) : null}

      {showSmartBuilder ? (
        <SmartFolderBuilder
          onClose={() => setShowSmartBuilder(false)}
          onCreated={() => {
            setShowSmartBuilder(false)
            fetchFolders('silent')
          }}
        />
      ) : null}
    </main>
  )
}

