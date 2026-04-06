import { Directory, File } from "expo-file-system";

export const SUPPORTED_AUDIO_EXTENSIONS = [
  ".mp3",
  ".m4a",
  ".flac",
  ".wav",
  ".aac",
  ".ogg",
  ".opus",
  ".wma",
  ".ape",
  ".m4b",
];

export interface ScannedFile {
  path: string;
  name: string;
  size: number;
  lastModified: number;
}

export function isAudioFile(file: File): boolean {
  const ext = file.extension?.toLowerCase();
  return ext ? SUPPORTED_AUDIO_EXTENSIONS.includes(ext) : false;
}

export async function scanDirectoryRecursive(
  directory: Directory,
  onProgress?: (current: string) => void,
): Promise<ScannedFile[]> {
  const files: ScannedFile[] = [];

  if (!directory.exists) {
    console.warn(`Directory does not exist: ${directory.uri}`);
    return files;
  }

  try {
    const items = directory.list();

    for (const item of items) {
      if (item instanceof File) {
        if (isAudioFile(item)) {
          if (onProgress) {
            onProgress(item.name);
          }

          const info = item.info();

          files.push({
            path: item.uri,
            name: item.name,
            size: item.size,
            lastModified: info.modificationTime ?? Date.now(),
          });
        }
      } else {
        const subDirFiles = await scanDirectoryRecursive(item, onProgress);
        files.push(...subDirFiles);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${directory.uri}:`, error);
  }

  return files;
}

export async function scanLibraryPath(
  path: string,
  onProgress?: (current: string) => void,
): Promise<ScannedFile[]> {
  const directory = new Directory(path);
  return scanDirectoryRecursive(directory, onProgress);
}

export async function getFileInfo(path: string): Promise<{
  exists: boolean;
  size?: number;
  lastModified?: number;
}> {
  try {
    const file = new File(path);

    if (!file.exists) {
      return { exists: false };
    }

    const info = file.info();

    return {
      exists: true,
      size: file.size,
      lastModified: info.modificationTime ?? Date.now(),
    };
  } catch (error) {
    console.error(`Error getting file info for ${path}:`, error);
    return { exists: false };
  }
}
