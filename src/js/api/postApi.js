import { del, get, patch, post, put } from "./client.js";

// 게시글 목록 조회
export const getPostList = ({ page = 1, size = 10 } = {}) =>
  get(`/posts?page=${page}&size=${size}`, {
    auth: "optional",
  });

// 게시글 상세 조회
export const getPost = (postId) =>
  get(`/posts/${postId}`, {
    auth: "optional",
  });

// 게시글 발행
export const createPost = ({ postId, title, content, imageUrl }) =>
  post(
    "/posts",
    {
      ...(postId ? { postId: Number(postId) } : {}),
      title,
      content,
      images: imageUrl ? [imageUrl] : [],
    },
    {
      auth: true,
    }
  );

// 게시글 수정
export const updatePost = (postId, { title, content, imageUrl }) =>
  patch(
    `/posts/${postId}`,
    {
      title,
      content,
      ...(imageUrl ? { imageUrl } : {}),
    },
    {
      auth: true,
    }
  );

// 게시글 삭제
export const deletePost = (postId) =>
  del(`/posts/${postId}`, {
    auth: true,
  });

// 게시글 좋아요 등록
export const likePost = (postId) =>
  post(`/posts/${postId}/likes`, undefined, {
    auth: true,
  });

// 게시글 좋아요 취소
export const unlikePost = (postId) =>
  del(`/posts/${postId}/likes`, {
    auth: true,
  });

// 게시글 신고
export const reportPost = (postId, { reason }) =>
  post(
    `/posts/${postId}/reports`,
    { reason },
    {
      auth: true,
    }
  );

// 임시저장 목록 조회
export const getDraftList = () =>
  get("/posts/drafts", {
    auth: true,
  });

// 처음 임시저장
export const saveDraft = ({ title, content, image }) =>
  post(
    "/posts/drafts",
    {
      title,
      content,
      ...(image ? { image } : {}),
    },
    {
      auth: true,
    }
  );

// 재임시저장
export const saveReDraft = (postId, { title, content, image }) =>
  put(
    `/posts/drafts/${postId}`,
    {
      title,
      content,
      ...(image ? { image } : {}),
    },
    {
      auth: true,
    }
  );

// 임시저장 삭제
export const deleteDraft = (postId) =>
  del(`/posts/drafts/${postId}`, {
    auth: true,
  });

// 임시저장 상세 조회
export const getDraft = (postId) =>
  get(`/posts/drafts/${postId}`, {
    auth: true,
  });
