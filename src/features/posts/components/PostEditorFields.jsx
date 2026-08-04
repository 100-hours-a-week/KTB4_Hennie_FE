import { POST_CATEGORY_OPTIONS } from '../utils/postCategory'
import { TITLE_MAX_LENGTH } from '../../../shared/utils/constants'

function PostEditorFields({
  title,
  content,
  category = '',
  helperMessage,
  disabled = false,
  onTitleChange,
  onContentChange,
  onCategoryChange,
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="category">
          유형
        </label>
        <select
          className="h-11 rounded-sm border border-[#3a3e44] bg-app-surface px-3 text-sm text-app-text focus:border-app-primary focus:outline-none disabled:cursor-not-allowed disabled:text-app-text-muted"
          id="category"
          name="category"
          disabled={disabled}
          value={category}
          onChange={onCategoryChange}
        >
          <option value="" disabled>
            직무를 선택해주세요
          </option>
          {POST_CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden rounded-md border border-app-border bg-app-surface">
          <input
            className="border-b border-app-border bg-transparent p-4 text-[22px] font-bold text-app-text placeholder:font-normal placeholder:text-[#6b7178] focus:outline-none"
            id="title"
            name="title"
            type="text"
            maxLength={TITLE_MAX_LENGTH}
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
    </>
  )
}

export default PostEditorFields
