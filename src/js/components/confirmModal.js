import { escapeHtml } from "../utils/escapeHtml.js";

export const ConfirmModal = ({
  id,
  title,
  description,
  cancelButton,
  confirmButton,
}) => {
  const titleId = `${id}Title`;

  return `
    <div
      class="modal"
      id="${escapeHtml(id)}"
      role="dialog"
      aria-modal="true"
      aria-labelledby="${escapeHtml(titleId)}"
    >
      <div class="modal__box">
        <p class="modal__title" id="${escapeHtml(titleId)}">
          ${escapeHtml(title)}
        </p>
        <p class="modal__desc">${escapeHtml(description)}</p>
        <div class="modal__actions">
          <button
            type="button"
            class="btn btn--dark"
            id="${escapeHtml(cancelButton.id)}"
          >
            ${escapeHtml(cancelButton.label)}
          </button>
          <button
            type="button"
            class="btn btn--primary"
            id="${escapeHtml(confirmButton.id)}"
          >
            ${escapeHtml(confirmButton.label)}
          </button>
        </div>
      </div>
    </div>`;
};
