export const queryKeys = {
  tags: (userId: string) => ['tags', userId] as const,
  items: (userId: string) => ['items', userId] as const,
  folders: (userId: string) => ['folders', userId] as const,
  folderDetail: (userId: string, folderId: string) => ['folders', userId, folderId] as const,
  profile: (userId: string) => ['profile', userId] as const,
  avatarUrl: (userId: string) => ['profile', userId, 'avatarUrl'] as const,
};
