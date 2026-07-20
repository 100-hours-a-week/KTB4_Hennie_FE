function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  pending = false,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null
  }

  return (
    <div className="modal is-open" role="dialog" aria-modal="true">
      <div className="modal__backdrop" onClick={onCancel} />
      <div className="modal__content">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        <div className="modal__actions">
          <button type="button" onClick={onCancel} disabled={pending}>
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} disabled={pending}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
