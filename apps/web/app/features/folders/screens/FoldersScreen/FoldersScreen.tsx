'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FolderCard } from '@/features/shared/components/FolderCard/FolderCard'
import { useFolders } from '../../hooks/useFolders'
import { NewFolderModal } from '../../components/NewFolderModal/NewFolderModal'
import { RenameFolderModal } from '../../components/RenameFolderModal/RenameFolderModal'
import { SmartFolderBuilder } from '../../components/SmartFolderBuilder/SmartFolderBuilder'
import { foldersScreenStyles } from './FoldersScreen.styles'

export function FoldersScreen() {
  const router = useRouter()
  const {
    folders,
    loading,
    error,
    showNewModal,
    setShowNewModal,
    renamingFolder,
    setRenamingFolder,
    deletingFolderId,
    createFolder,
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
    <main style={foldersScreenStyles.page}>
      <header style={foldersScreenStyles.header}>
        <h1 style={foldersScreenStyles.title}>Carpetas</h1>
        <p style={foldersScreenStyles.subtitle}>
          Organiza tus recursos en carpetas. Las carpetas inteligentes filtran automaticamente segun reglas que definas.
        </p>

        <div style={foldersScreenStyles.actionsRow}>
          <button
            type='button'
            style={foldersScreenStyles.newButton}
            onClick={() => setShowNewModal(true)}
          >
            + Nueva carpeta
          </button>
          <button
            type='button'
            style={foldersScreenStyles.smartButton}
            onClick={() => setShowSmartBuilder(true)}
          >
            Crear inteligente
          </button>
        </div>
      </header>

      {loading ? (
        <p style={foldersScreenStyles.loading}>Cargando carpetas...</p>
      ) : error ? (
        <p style={foldersScreenStyles.errorText}>{error}</p>
      ) : folders.length === 0 ? (
        <section style={foldersScreenStyles.emptyState}>
          <h2 style={foldersScreenStyles.emptyTitle}>Aun no tienes carpetas</h2>
          <p style={foldersScreenStyles.emptyText}>
            Crea tu primera carpeta para organizar tus recursos.
          </p>
          <button
            type='button'
            style={foldersScreenStyles.emptyCtaButton}
            onClick={() => setShowNewModal(true)}
          >
            Crear carpeta
          </button>
        </section>
      ) : (
        <section style={foldersScreenStyles.list}>
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

      {showNewModal ? (
        <NewFolderModal
          onClose={() => setShowNewModal(false)}
          onCreate={async (data) => {
            const success = await createFolder(data)
            if (success) setShowNewModal(false)
            return success
          }}
        />
      ) : null}

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
          onCreated={() => { setShowSmartBuilder(false); fetchFolders('silent') }}
        />
      ) : null}
    </main>
  )
}