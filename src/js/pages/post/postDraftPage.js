import {
  deleteDraft,
  getDraft,
  getDraftList,
  saveDraft,
  saveReDraft,
} from "../../api/postApi.js";
import { handleApiError } from "../../utils/handleApiError.js";
import { openModal, closeModal } from "../../utils/modal.js";
import {
  clearPostWriteHelper,
  fillPostWriteForm,
  getPostWriteFormValues,
  renderDraftList,
  setPostWriteHelper,
  syncPostWriteFormState,
} from "../../views/post/postWriteView.js";

const MAX_DRAFT_COUNT = 10;

// 게시글 작성 페이지 내 임시저장
export const initPostDraft = () => {
  let draftPostId = null;

  const saveButton = document.querySelector("#postDraftSaveBtn");
  const countButton = document.querySelector("#postDraftCountBtn");
  const modal = document.querySelector("#postDraftModal");
  const closeButton = document.querySelector("#postDraftCloseBtn");

  if (!countButton) {
    return { getDraftId: () => draftPostId };
  }

  const updateDraftCount = async () => {
    try {
      const { totalCount } = await loadDraftList();

      countButton.textContent = String(totalCount);
    } catch (error) {
      console.error("임시저장 개수 조회 실패", error);
    }
  };

  const deleteDraftItem = async (deleteButton) => {
    const postId = deleteButton.dataset.postId;

    if (!postId) {
      return;
    }

    try {
      deleteButton.disabled = true;
      await deleteDraft(postId);

      if (String(draftPostId) === String(postId)) {
        draftPostId = null;
      }

      const { drafts, totalCount } = await loadDraftList();

      renderDraftList(drafts);
      countButton.textContent = String(totalCount);
    } catch (error) {
      handleApiError(error, {
        logLabel: "임시저장 삭제 실패",
        fallbackMessage: "임시저장 삭제에 실패했습니다.",
        forbiddenMessage: "임시저장 글을 삭제할 권한이 없습니다.",
        onNotFound: () => {
          alert("이미 삭제되었거나 존재하지 않는 임시저장 글입니다.");
          updateDraftCount();
        },
      });
    } finally {
      deleteButton.disabled = false;
    }
  };

  const loadDraftToForm = async (postId) => {
    if (!postId) {
      return;
    }

    try {
      const response = await getDraft(postId);
      const draft = response.data || response;

      draftPostId = draft.postId ?? draft.id ?? postId;
      fillPostWriteForm(draft);
      syncPostWriteFormState();

      if (modal) {
        closeModal(modal);
      }
    } catch (error) {
      handleApiError(error, {
        logLabel: "임시저장 조회 실패",
        fallbackMessage: "임시저장 글을 불러오지 못했습니다.",
        forbiddenMessage: "임시저장 글을 조회할 권한이 없습니다.",
        onNotFound: () => {
          alert("임시저장 글을 찾을 수 없습니다.");
          updateDraftCount();
        },
      });
    }
  };

  // 임시저장 (신규 저장 / 재저장)
  saveButton?.addEventListener("click", async () => {
    clearPostWriteHelper();

    const { title, content, imageUrl } = getPostWriteFormValues();

    if (!title && !content) {
      setPostWriteHelper("제목 또는 내용을 작성해주세요");
      return;
    }

    try {
      if (draftPostId === null) {
        const { totalCount } = await loadDraftList();

        if (totalCount >= MAX_DRAFT_COUNT) {
          alert(`임시저장은 최대 ${MAX_DRAFT_COUNT}개까지 가능합니다.`);
          return;
        }
      }

      const draftPayload = {
        title,
        content,
        image: imageUrl,
      };
      const response =
        draftPostId === null
          ? await saveDraft(draftPayload)
          : await saveReDraft(draftPostId, draftPayload);

      draftPostId = response.data?.postId ?? response.postId ?? null;
      updateDraftCount();
      alert("임시저장되었습니다.");
    } catch (error) {
      handleApiError(error, {
        logLabel: "임시저장 실패",
        fallbackMessage: "임시저장에 실패했습니다.",
        onBadRequest: () => setPostWriteHelper("제목 또는 내용을 작성해주세요"),
        forbiddenMessage: "임시저장 글을 수정할 권한이 없습니다.",
        onNotFound: () => {
          draftPostId = null;
          countButton.textContent = "0";
          alert("임시저장 글을 찾을 수 없습니다. 다시 임시저장해주세요.");
        },
      });
    }
  });

  // 임시저장 목록 열기
  countButton.addEventListener("click", async () => {
    try {
      const { drafts, totalCount } = await loadDraftList();

      renderDraftList(drafts);
      countButton.textContent = String(totalCount);

      if (modal) {
        openModal(modal);
      }
    } catch (error) {
      handleApiError(error, {
        logLabel: "임시저장 목록 조회 실패",
        fallbackMessage: "임시저장 목록을 불러오지 못했습니다.",
      });
    }
  });

  closeButton?.addEventListener("click", () => {
    if (modal) {
      closeModal(modal);
    }
  });

  // 모달 내부 위임: 배경 클릭 닫기 / 삭제 / 폼으로 불러오기
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
      return;
    }

    const deleteButton = event.target.closest(
      ".post-draft-list__delete-button"
    );

    if (deleteButton) {
      deleteDraftItem(deleteButton);
      return;
    }

    const draftContentButton = event.target.closest(
      ".post-draft-list__content"
    );

    if (draftContentButton) {
      loadDraftToForm(draftContentButton.dataset.postId);
    }
  });

  updateDraftCount();

  return { getDraftId: () => draftPostId };
};

const loadDraftList = async () => {
  const response = await getDraftList();
  const data = response.data || response;

  return normalizeDraftResponse(data);
};

const normalizeDraftResponse = (data) => {
  if (Array.isArray(data)) {
    return {
      drafts: data.slice(0, MAX_DRAFT_COUNT),
      totalCount: Math.min(data.length, MAX_DRAFT_COUNT),
    };
  }

  const drafts =
    data?.drafts ||
    data?.content ||
    data?.items ||
    data?.list ||
    data?.postDrafts ||
    [];
  const normalizedDrafts = Array.isArray(drafts) ? drafts : [];
  const totalCount = countPages(data?.totalCount) ?? normalizedDrafts.length;

  return {
    drafts: normalizedDrafts.slice(0, MAX_DRAFT_COUNT),
    totalCount: Math.min(totalCount, MAX_DRAFT_COUNT),
  };
};

const countPages = (value) => {
  const number = Number(value);

  return Number.isInteger(number) && number >= 0 ? number : null;
};
