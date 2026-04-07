export type Post = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  type: string;
};

export type SocialMedia = {
  id: string;
  username: string;
  thumbnail: string;
  description: string;
  followers: number;
  following?: number;
  type?: string;
  videoCount: number;
  viewCount: number;
  latestPosts: Post[];
};
