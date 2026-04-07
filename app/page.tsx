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

export default function Home() {
  const [socialMediaData, setSocialMediaData] = useState<SocialMedia | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/youtube/${encodeURIComponent("suli")}`);
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
          createdAt: v.publishedAt,
        }));

      const result = {
        id: json.channel.id,
        username: json.channel.title,
        thumbnail: json.channel.thumbnails?.default ?? "",
        description: json.channel.description,
        followers: Number(json.channel.subscriberCount ?? 0),
        videoCount: Number(json.channel.videoCount ?? 0),
        viewCount: Number(json.channel.viewCount ?? 0),
        latestPosts,
      };

      setSocialMediaData(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstagram = async () => {
    const url = "https://instagram120.p.rapidapi.com/api/instagram/posts";
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-host": "instagram120.p.rapidapi.com",
        "x-rapidapi-key": "8fbd109620msh6a39966d21e438cp1278fejsn7cf233b72259",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "estefaniawijaya",
        maxId: "",
      }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(
          `HTTP ${response.status} – ${response.statusText}\n${errText}`,
        );
      }

      const result = await response.json();
      console.log("id:", result?.result?.edges[0]?.node?.user?.id);
      console.log("username:", result?.result?.edges[0]?.node?.user?.username);
      console.log("thumbnail:", result?.result?.edges[0]?.node?.user?.hd_profile_pic_url_info?.url);
      console.log("thumbnail:", result?.result?.edges[0]?.node?.user?.hd_profile_pic_url_info?.url);

      console.log("✅ Instagram single post:", result?.result?.edges[0]?.node);
      console.log("✅ Instagram single post:", result?.result?.edges[6]?.node);
      console.log("✅ Instagram single post:", result?.result?.edges[11]?.node);
    } catch (error) {
      console.error("❌ Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchInstagram();
    // fetchInfo();
  }, []);

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
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards data={socialMediaData} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
