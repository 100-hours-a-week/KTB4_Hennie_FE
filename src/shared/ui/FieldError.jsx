function FieldError({ message }) {
  if (!message) {
    return null
  }

  return <p className="field__helper">{message}</p>
}

export default FieldError
