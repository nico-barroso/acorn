import { FoldersScreen } from '@screens/FolderScreen/FoldersScreen';
import { useFolders } from '@screens/FolderScreen/hooks/useFolders';

export default function FoldersRoute() {
  const props = useFolders();
  return <FoldersScreen {...props} />;
}
