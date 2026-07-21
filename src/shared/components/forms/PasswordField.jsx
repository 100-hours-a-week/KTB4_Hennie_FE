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
          className="rounded-sm p-1.5 text-app-primary hover:bg-app-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
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
