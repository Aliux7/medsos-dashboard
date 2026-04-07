"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/number";
import { SocialMedia } from "@/types/SocialMedia";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  User,
  ScrollText,
  UsersIcon,
  EyeIcon,
  FileTextIcon,
} from "lucide-react";
import Image from "next/image";

interface SectionCardsProps {
  data: SocialMedia | null;
}

export function SectionCards({ data }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Profile</CardDescription>
          <CardTitle className="truncate text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.username ?? "-"}
          </CardTitle>
          <CardAction>
            <div className="size-14 p-1 border rounded-full overflow-hidden">
              <div className="rounded-full overflow-hidden flex justify-center items-center w-full h-full">
                {data?.thumbnail ? (
                  <img alt="" src={data.thumbnail} />
                ) : (
                  <User className="" />
                )}
              </div>
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm flex-1">
          <div className="line-clamp-1 flex gap-2 font-medium truncate w-full">
            {data?.description ?? "-"}
          </div>
          <div className="text-muted-foreground">{data?.type ?? "-"}</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Followers / Subscriber</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(data?.followers || 0)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm flex-1">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total audience size <UsersIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Your current follower count
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Following / Views</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(data?.viewCount || data?.following || 0)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong content visibility <EyeIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Your content is being widely seen
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Posts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(data?.videoCount || 0)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm flex-1">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Consistent content output <FileTextIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Total published posts</div>
        </CardFooter>
      </Card>
    </div>
  );
}
