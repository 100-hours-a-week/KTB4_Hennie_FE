import { useState } from 'react'
import FormField from './FormField'
import { ViewIcon, ViewOffIcon } from '../IconsList'

function PasswordField(fieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((isVisible) => !isVisible)
  }

  const toggleLabel = isPasswordVisible ? '숨기기' : '표시'

  return (
    <FormField
      {...fieldProps}
      type={isPasswordVisible ? 'text' : 'password'}
      endAdornment={
        <button
          className="flex size-8 items-center justify-center rounded-lg text-app-text-muted transition-colors hover:bg-app-surface-hover hover:text-app-primary"
          type="button"
          aria-label={`비밀번호 ${toggleLabel}`}
          aria-pressed={isPasswordVisible}
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? (
            <ViewIcon className="size-5" />
          ) : (
            <ViewOffIcon className="size-5" />
          )}
        </button>
      }
    />
  )
}

export default PasswordField
