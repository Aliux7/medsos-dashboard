export type Post = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
};

export type SocialMedia = {
  id: string;
  username: string;
  thumbnail: string;
  description: string;
  followers: number;
  videoCount: number;
  viewCount: number;
  latestPosts: Post[];
};
