import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.YOUTUBE_API_KEY; ;
if (!API_KEY) {
  throw new Error("You must define NEXT_PUBLIC_YOUTUBE_API_KEY in .env.local");
}

export async function ytFetch<T>(url: string): Promise<T> {
  const fullUrl = `${url}${url.includes("?") ? "&" : "?"}key=${API_KEY}`;
  const res = await fetch(fullUrl);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `YouTube API error (${res.status}): ${JSON.stringify(err)}`,
    );
  }
  return (await res.json()) as T;
}

export interface ChannelSearchItem {
  id: { channelId: string };
}
export interface ChannelSnippet {
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
    medium?: { url: string };
    high?: { url: string };
  };
}
export interface ChannelStatistics {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
}
export interface ChannelInfo {
  id: string;
  snippet: ChannelSnippet;
  statistics: ChannelStatistics;
}

export async function getChannelIdByUsername(
  username: string,
): Promise<string | null> {
  const data = await ytFetch<{
    items: ChannelSearchItem[];
  }>(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(
      username,
    )}`,
  );

  if (data.items?.length === 0) return null;
  return data.items[0].id.channelId;
}

export async function getChannelInfo(channelId: string): Promise<ChannelInfo> {
  const data = await ytFetch<{
    items: ChannelInfo[];
  }>(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}`,
  );
  return data.items[0];
}

export async function getLatestVideoIds(
  channelId: string,
  maxResults = 5,
): Promise<string[]> {
  const data = await ytFetch<{
    items: { id: { videoId: string } }[];
  }>(
    `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&order=date&type=video&maxResults=${maxResults}`,
  );
  return data.items.map((v) => v.id.videoId);
}

export async function getVideosInfo(videoIds: string[]): Promise<
  {
    id: string;
    snippet: any;
    statistics: any;
  }[]
> {
  if (videoIds.length === 0) return [];

  const ids = videoIds.join(",");
  const data = await ytFetch<{
    items: {
      id: string;
      snippet: any;
      statistics: any;
    }[];
  }>(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids}`,
  );

  return data.items;
}
