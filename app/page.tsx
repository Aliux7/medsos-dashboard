"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import data from "./data.json";
import { useEffect, useState } from "react";
import { Post, SocialMedia } from "@/types/SocialMedia";
import Loading from "@/components/loading";

export default function Home() {
  const [platform, setPlatform] = useState("youtube");
  const [username, setUsername] = useState("suliantoindriaputra");
  const [socialMediaData, setSocialMediaData] = useState<SocialMedia | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchYouTube = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/youtube/${encodeURIComponent(username)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unknown error");
      const latestPosts: Post[] = (json.latestVideos ?? [])
        .slice(0, 5)
        .map((v: any) => ({
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnails?.default ?? "",
          description: v.description,
          likeCount: Number(v.likeCount ?? 0),
          commentCount: Number(v.commentCount ?? 0),
          viewCount: Number(v.viewCount ?? 0),
          type: "Video",
          createdAt: v.publishedAt,
        }));

      const result = {
        id: json.channel.id,
        username: json.channel.title,
        thumbnail: json.channel.thumbnails?.default ?? "",
        description: json.channel.description,
        followers: Number(json.channel.subscriberCount ?? 0),
        following: Number(0),
        type: "Instagram",
        videoCount: Number(json.channel.videoCount ?? 0),
        viewCount: Number(json.channel.viewCount ?? 0),
        latestPosts,
      };
 
      setSocialMediaData(result);
    } catch (e: any) {
      setError(e.message);
      console.log(e.message)
    } finally {
      setLoading(false);
    }
  };

  const fetchInstagram = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/instagram/${username}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error ?? "Unknown error"); 
      const latestPosts: Post[] = (data.latestPosts ?? [])
        .slice(0, 5)
        .map((v: any) => ({
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail ?? "",
          description: v.description,
          likeCount: Number(v.likeCount ?? 0),
          commentCount: Number(v.commentCount ?? 0),
          viewCount: Number(v.viewCount ?? 0),
          type: v.type,
          createdAt: v.createdAt,
        }));

      const result = {
        id: data.id,
        username: data.username,
        thumbnail: data.thumbnail ?? "",
        description: data.description,
        followers: Number(data.followers ?? 0),
        following: Number(data.following ?? 0),
        type: "Instagram",
        videoCount: Number(data.videoCount ?? 0),
        viewCount: Number(data.viewCount ?? 0),
        latestPosts,
      };

      setSocialMediaData(result);
    } catch (e: any) {
      setError(e.message);
      console.log(e.message)
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    
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
    console.log(rapidJson?.result?.edges)

    if (platform === "youtube") fetchYouTube();
    else fetchInstagram();
  };

  useEffect(() => {
    handleSearch();
  }, [platform]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* <AppSidebar variant="inset" /> */} 
      <SidebarInset>
        <SiteHeader
          username={username}
          onUsernameChange={setUsername}
          selectedPlatform={platform}
          onPlatformChange={setPlatform}
          onSearch={handleSearch}
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards data={socialMediaData} />
              <DataTable data={socialMediaData} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      {loading && <Loading />}
    </SidebarProvider>
  );
}
