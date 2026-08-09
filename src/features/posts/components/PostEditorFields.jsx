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
      <div className="flex max-w-xs flex-col gap-1.5">
        <label className="app-field-label" htmlFor="category">
          유형
        </label>
        <select
          className="app-select"
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
        <div className="flex flex-col overflow-hidden rounded-md border border-app-border bg-app-surface transition-colors duration-100 focus-within:border-app-border-strong">
          <input
            className="border-b border-app-border bg-transparent p-4 text-lg font-bold text-app-text placeholder:font-normal placeholder:text-app-text-subtle focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-xl"
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
            className="min-h-[420px] resize-y bg-transparent p-4 text-[15px] leading-[1.8] text-app-text placeholder:text-app-text-subtle focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            id="content"
            name="content"
            placeholder="내용을 입력하세요."
            disabled={disabled}
            value={content}
            onChange={onContentChange}
          />
        </div>
        <p className="min-h-4 px-0.5 text-xs leading-[1.5] text-app-error">
          {helperMessage ? `* ${helperMessage}` : ''}
        </p>
      </div>
    </>
  )
}

export default PostEditorFields
