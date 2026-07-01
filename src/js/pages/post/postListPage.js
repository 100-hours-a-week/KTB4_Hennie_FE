import { getPostList } from "../../api/postApi.js";
import { handleApiError } from "../../utils/handleApiError.js";
import {
  getPostListSentinel,
  renderPostList,
  setPostListStatus,
} from "../../views/post/postListView.js";

const POST_LIST_PAGE_SIZE = 10;
let postListObserver = null; // 무한 스크롤용 변수
let currentPostPage = 1;
let isPostListLoading = false;
let hasNextPostPage = true;

// 게시글 목록 페이지 컨트롤러
export const initPostListPage = () => {
  resetPostListInfiniteScroll();

  loadPostListPage(1, { append: false }).then(() => {
    observePostListSentinel();
  });
};

const resetPostListInfiniteScroll = () => { // 게시글 무한 스크롤 상태 초기화
  postListObserver?.disconnect();
  postListObserver = null;
  currentPostPage = 1;
  isPostListLoading = false;
  hasNextPostPage = true;
};

const loadPostListPage = async (page, { append }) => {
  if (isPostListLoading || !hasNextPostPage) {
    return;
  }

  isPostListLoading = true;
  setPostListStatus("게시글을 불러오는 중입니다.");

  try {
    const response = await getPostList({
      page,
      size: POST_LIST_PAGE_SIZE,
    });
    const data = response.data || response;
    const posts = normalizePosts(data);

    renderPostList(posts, { append });

    currentPostPage = page;
    hasNextPostPage = getHasNextPostPage({
      data,
      posts,
      currentPage: page,
    });
    setPostListStatus(
      getPostListEndMessage({ page, hasNext: hasNextPostPage })
    );
  } catch (error) {
    handleApiError(error, {
      logLabel: "게시글 목록 조회 실패",
      fallbackMessage: "게시글 목록을 불러오지 못했습니다.",
    });
  } finally {
    isPostListLoading = false;
  }
};

const observePostListSentinel = () => {
  const sentinel = getPostListSentinel(); // IntersectionObserver observe 대상용

  if (!sentinel) {
    return;
  }

  postListObserver = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;

      if (!entry.isIntersecting) {
        return;
      }

      loadPostListPage(currentPostPage + 1, { append: true });
    },
    {
      rootMargin: "180px 0px",
    }
  );

  postListObserver.observe(sentinel);
};

const normalizePosts = (data) => {
  const posts =
    data?.posts ||
    data?.content ||
    data?.items ||
    data?.list ||
    data?.postList ||
    data?.postResponses ||
    [];

  return Array.isArray(posts) ? posts : [];
};

const getHasNextPostPage = ({ data, posts, currentPage }) => {
  const hasNext =
    data?.hasNext ??
    data?.hasNextPage ??
    data?.pageInfo?.hasNext ??
    data?.pageInfo?.hasNextPage;

  if (typeof hasNext === "boolean") {
    return hasNext;
  }

  const isLast = data?.last ?? data?.pageInfo?.last;

  if (typeof isLast === "boolean") {
    return !isLast;
  }

  const totalPages = countPages(
    data?.totalPages ??
      data?.totalPage ??
      data?.pageInfo?.totalPages ??
      data?.pageInfo?.totalPage
  );

  if (totalPages) {
    return currentPage < totalPages;
  }

  return posts.length >= POST_LIST_PAGE_SIZE;
};

// 무한 스크롤 끝 안내는 2페이지 이상 불러온 뒤 더 없을 때만 표시.
// (빈 목록이나 첫 페이지에서 다 들어온 경우엔 표시하지 않음)
const getPostListEndMessage = ({ page, hasNext }) => {
  if (hasNext || page <= 1) {
    return "";
  }

  return "더 불러올 게시글이 없습니다.";
};

const countPages = (value) => {
  const number = Number(value);

  return Number.isInteger(number) && number > 0 ? number : null;
};
