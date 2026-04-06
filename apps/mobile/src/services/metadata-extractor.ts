import { getFilenameFromPath } from "../utils/path-utils";

export interface TrackMetadata {
  title: string;
  artist: string | null;
  album: string | null;
  duration: number;
}

export async function extractMetadata(
  filePath: string,
): Promise<TrackMetadata | null> {
  try {
    const title = getFilenameFromPath(filePath);

    return {
      title,
      artist: null,
      album: null,
      duration: 0,
    };
  } catch (error) {
    console.error(`Error extracting metadata from ${filePath}:`, error);
    return null;
  }
}

export async function extractMetadataWithFallback(
  filePath: string,
  fallbackMetadata?: Partial<TrackMetadata>,
): Promise<TrackMetadata> {
  const metadata = await extractMetadata(filePath);

  if (metadata) {
    return {
      ...metadata,
      ...fallbackMetadata,
    };
  }

  return {
    title: getFilenameFromPath(filePath),
    artist: null,
    album: null,
    duration: 0,
    ...fallbackMetadata,
  };
}
