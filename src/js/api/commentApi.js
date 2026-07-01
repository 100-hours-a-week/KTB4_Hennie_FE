import { del, patch, post } from "./client.js";

// 댓글 작성
export const createComment = (postId, { content }) =>
  post(`/posts/${postId}/comments`, { content });

// 댓글 수정
export const updateComment = (postId, commentId, { content }) =>
  patch(`/posts/${postId}/comments/${commentId}`, { content });

// 댓글 삭제
export const deleteComment = (postId, commentId) =>
  del(`/posts/${postId}/comments/${commentId}`);
