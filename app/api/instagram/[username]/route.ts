import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const username = url.pathname.split("/").pop();

    if (!username) {
      return NextResponse.json(
        { error: "No username provided" },
        { status: 400 },
      );
    }

    const response = await axios.get(`https://www.instagram.com/${username}/`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-User": "?1",
        "Sec-Fetch-Dest": "document",
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const profilePic =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      null;

    const raw = $('meta[property="og:description"]').attr("content") || "";

    const followers = Number(
      raw.match(/([\d,.]+)\sFollowers/)?.[1]?.replace(/,/g, "") ?? 0,
    );
    const following = Number(
      raw.match(/Followers,\s([\d,.]+)\sFollowing/)?.[1]?.replace(/,/g, "") ??
        0,
    );
    const posts = Number(
      raw.match(/Following,\s([\d,.]+)\sPosts/)?.[1]?.replace(/,/g, "") ?? 0,
    );

    const rapid = await fetch(
      "https://instagram120.p.rapidapi.com/api/instagram/posts",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "instagram120.p.rapidapi.com",
          "x-rapidapi-key":
            "8fbd109620msh6a39966d21e438cp1278fejsn7cf233b72259",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, maxId: "" }),
      },
    );

    const rapidJson = await rapid.json();

    const edges = rapidJson?.result?.edges ?? [];

    // console.log(edges[4]?.node.video_versions)

    console.log(edges)
    const latestPosts =
      edges.slice(0, 10).map((p: any) => {
        const n = p?.node; 
        return {
          id: n.id,
          title: "",
          thumbnail: n?.image_versions2?.candidates[0]?.url ?? "",
          description: n?.caption?.text ?? "",
          likeCount: Number(n?.like_count ?? 0),
          commentCount: Number(n?.comment_count ?? 0),
          viewCount: Number(n?.view_count ?? 0),
          type: n?.video_versions ? "Video" : "Image",
          createdAt: n?.taken_at
            ? new Date(n?.taken_at * 1000).toISOString()
            : null,
        };
      }) ?? [];

    const result = {
      id: username,
      username,
      thumbnail: profilePic,
      description: "",
      followers,
      following,
      videoCount: posts,
      viewCount: 0,
      latestPosts,
    };

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Error:", err.message);
    return NextResponse.json({ error: "Scraping failed" }, { status: 500 });
  }
}

export const POST = () =>
  NextResponse.json(
    { error: "Method Not Allowed - only GET is supported" },
    { status: 405 },
  );
export const PUT = POST;
export const DELETE = POST;
export const PATCH = POST;
