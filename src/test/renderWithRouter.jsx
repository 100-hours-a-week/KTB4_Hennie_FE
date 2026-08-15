import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

export const renderWithRouter = (
  ui,
  { initialEntries = ['/'], ...renderOptions } = {},
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>,
    renderOptions,
  )
}
