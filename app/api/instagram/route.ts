// app/api/instagram/album/route.ts
import { IgApiClient, IgCheckpointError, PostingAlbumItem, PostingAlbumPhotoItem } from 'instagram-private-api';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME!);

  try {
    // Login (with checkpoint handling)
    await ig.account.login(process.env.IG_USERNAME!, process.env.IG_PASSWORD!);

    // Get files from request body
    const { items, caption, location }: {
      items: Array<{ url: string, type: 'photo' | 'video' }>,
      caption?: string,
      location?: { lat: number, lng: number, name: string }
    } = await request.json();

    // Prepare album items
    const albumItems = await Promise.all(items.map(async (item) => {
      const { data: fileBuffer } = await axios.get(item.url, {
        responseType: 'arraybuffer'
      });

      if (item.type === 'photo') {
        return {
          file: Buffer.from(fileBuffer),
          width: 1080,  // Recommended dimensions
          height: 1350
        } as PostingAlbumPhotoItem;
      } else {
        return {
          file: Buffer.from(fileBuffer),
          coverImage: Buffer.from(fileBuffer.slice(0, 1024)), // Simple thumbnail
          audioMuted: false
        } as PostingAlbumVideoItem;
      }
    }));

    // Post the album
    const publishResult = await ig.publish.album({
      caption: caption || '',
      items: albumItems,
      location: location ? {
        name: location.name,
        lat: location.lat,
        lng: location.lng,
        external_id: `${location.lat}_${location.lng}`, // Generate simple ID
        external_id_source: 'facebook_places',
        address: location.name
      } : undefined
    });

    return NextResponse.json({
      success: true,
      mediaId: publishResult.media.id
    });

  } catch (error) {
    if (error instanceof IgCheckpointError) {
      return NextResponse.json(
        { error: 'Instagram requires additional verification' },
        { status: 403 }
      );
    }
    console.error('Album posting error:', error);
    return NextResponse.json(
      { error: 'Failed to post album to Instagram' },
      { status: 500 }
    );
  }
}

// Define the missing interfaces for TypeScript
interface PostingAlbumVideoItem extends PostingAlbumItem {
  file: Buffer;
  coverImage: Buffer;
  audioMuted?: boolean;
}

interface PostingLocation {
  name: string;
  lat: number;
  lng: number;
  external_id: string;
  external_id_source: string;
}

interface PostingUsertags {
  in: Array<{
    user_id: number;
    position: [number, number];
  }>;
}