// app/api/youtube/[username]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  getChannelIdByUsername,
  getChannelInfo,
  getLatestVideoIds,
  getVideosInfo,
} from "@/lib/youtube";

/* -----------------------------------------------------------------
   Types – the shape we will return to the client
   ----------------------------------------------------------------- */
type CombinedResponse = {
  channel: null | {
    id: string;
    title: string;
    description: string;
    thumbnails: {
      default: string;
      medium?: string;
      high?: string;
    };
    subscriberCount: string;
    viewCount: string;
    videoCount: string;
  };
  latestVideos: {
    id: string;
    title: string;
    description: string;
    thumbnails: {
      default: string;
      medium?: string;
      high?: string;
    };
    viewCount: string;
    likeCount?: string;
    commentCount?: string;
    publishedAt: string;
  }[];
  error: null | string;
};

/* -----------------------------------------------------------------
   Helper – builds the JSON payload we send back
   ----------------------------------------------------------------- */
function buildSuccess(
  channelInfo: any,
  videosInfo: any[]
): CombinedResponse {
  return {
    channel: {
      id: channelInfo.id,
      title: channelInfo.snippet.title,
      description: channelInfo.snippet.description,
      thumbnails: {
        default: channelInfo.snippet.thumbnails.default.url,
        medium: channelInfo.snippet.thumbnails.medium?.url,
        high: channelInfo.snippet.thumbnails.high?.url,
      },
      subscriberCount: channelInfo.statistics.subscriberCount,
      viewCount: channelInfo.statistics.viewCount,
      videoCount: channelInfo.statistics.videoCount,
    },
    latestVideos: videosInfo.map((v) => ({
      id: v.id,
      title: v.snippet.title,
      description: v.snippet.description,
      thumbnails: {
        default: v.snippet.thumbnails?.default?.url,
        medium: v.snippet.thumbnails?.medium?.url,
        high: v.snippet.thumbnails?.high?.url,
      },
      viewCount: v.statistics?.viewCount,
      likeCount: v.statistics?.likeCount,
      commentCount: v.statistics?.commentCount,
      publishedAt: v.snippet.publishedAt,
    })),
    error: null,
  };
}

/* -----------------------------------------------------------------
   GET handler – the only HTTP verb we support
   ----------------------------------------------------------------- */
export async function GET(request: NextRequest) {
  // --------------------------------------------------------------
  // 1️⃣  Extract the dynamic segment (username)
  // --------------------------------------------------------------
  const { pathname } = new URL(request.url);
  // pathname is like "/api/youtube/astronacciinternational"
  const username = pathname.split("/").pop(); // last part

  if (!username) {
    return NextResponse.json(
      {
        channel: null,
        latestVideos: [],
        error: "Missing username in URL",
      },
      { status: 400 }
    );
  }

  try {
    // --------------------------------------------------------------
    // 2️⃣  Resolve channelId from the custom URL (username)
    // --------------------------------------------------------------
    const channelId = await getChannelIdByUsername(username);

    if (!channelId) {
      return NextResponse.json(
        {
          channel: null,
          latestVideos: [],
          error: `Channel with username "${username}" not found`,
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------------------
    // 3️⃣  Parallel‑fetch channel details + latest video ids
    // --------------------------------------------------------------
    const [channelInfo, latestIds] = await Promise.all([
      getChannelInfo(channelId),
      getLatestVideoIds(channelId, 5), // change 5 if you want more/less
    ]);

    // --------------------------------------------------------------
    // 4️⃣  Get full video details
    // --------------------------------------------------------------
    const videosInfo = await getVideosInfo(latestIds);

    // --------------------------------------------------------------
    // 5️⃣  Build & return the combined payload
    // --------------------------------------------------------------
    const payload = buildSuccess(channelInfo, videosInfo);
    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    console.error("YouTube API route error:", err);
    return NextResponse.json(
      {
        channel: null,
        latestVideos: [],
        error: err.message ?? "Unexpected server error",
      },
      { status: 500 }
    );
  }
}

/* -----------------------------------------------------------------
   OPTIONAL: Disallow other methods (POST, PUT, DELETE …)
   ----------------------------------------------------------------- */
export const POST = () =>
  NextResponse.json(
    {
      channel: null,
      latestVideos: [],
      error: "Method Not Allowed – only GET is supported",
    },
    { status: 405 }
  );
export const PUT = POST;
export const DELETE = POST;
export const PATCH = POST;