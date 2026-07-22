function PostEditorFields({
  title,
  content,
  selectedFileName,
  helperMessage,
  disabled = false,
  onTitleChange,
  onContentChange,
  onImageChange,
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden rounded-md border border-app-border bg-app-surface">
          <input
            className="border-b border-app-border bg-transparent p-4 text-[22px] font-bold text-app-text placeholder:font-normal placeholder:text-[#6b7178] focus:outline-none"
            id="title"
            name="title"
            type="text"
            maxLength={26}
            placeholder="제목을 입력하세요."
            disabled={disabled}
            value={title}
            onChange={onTitleChange}
          />
          <textarea
            className="min-h-[420px] resize-y bg-transparent p-4 text-base leading-[1.7] text-app-text placeholder:text-[#6b7178] focus:outline-none"
            id="content"
            name="content"
            placeholder="내용을 입력하세요."
            disabled={disabled}
            value={content}
            onChange={onContentChange}
          />
        </div>
        <p className="min-h-4 text-xs leading-[1.4] text-app-error">
          {helperMessage ? `* ${helperMessage}` : ''}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="image">
          이미지
        </label>
        <div className="flex items-center gap-3">
          <label
            className="shrink-0 cursor-pointer rounded-sm border border-[#3a3e44] bg-app-surface px-3 py-2 text-sm hover:bg-app-bg focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-app-primary"
            htmlFor="image"
          >
            파일 선택
            <input
              className="sr-only"
              id="image"
              name="image"
              type="file"
              accept="image/*"
              disabled={disabled}
              onChange={onImageChange}
            />
          </label>
          <span className="min-w-0 truncate text-sm text-app-text-muted">
            {selectedFileName || '파일을 선택해주세요.'}
          </span>
        </div>
      </div>
    </>
  )
}

export default PostEditorFields
