import type React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeSwitch } from '../shared/ThemeSwitch'
import { useTheme } from 'next-themes'

// Mock do next-themes useTheme hook
jest.mock('next-themes', () => ({
  useTheme: jest.fn()
}))

// Mock do framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    )
  }
}))

describe('ThemeSwitch Component', () => {
  // Setup inicial para cada teste
  beforeEach(() => {
    // Reset do mock entre testes
    jest.clearAllMocks()

    // Mock da implementação do useTheme
    const mockUseTheme = useTheme as jest.Mock
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: jest.fn()
    })

    // Mock de window.matchMedia para SSR
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  it('renders in light mode correctly', () => {
    render(<ThemeSwitch />)

    // Verifica se o texto correto está presente (para mudar para tema escuro)
    expect(screen.getByText('Tema Escuro')).toBeInTheDocument()

    // Verifica se o botão tem o label correto para acessibilidade
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Mudar para tema escuro')
  })

  it('renders in dark mode correctly', () => {
    // Altera o mock para retornar tema escuro
    const mockUseTheme = useTheme as jest.Mock
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn()
    })

    render(<ThemeSwitch />)

    // Verifica se o texto correto está presente (para mudar para tema claro)
    expect(screen.getByText('Tema Claro')).toBeInTheDocument()

    // Verifica se o botão tem o label correto para acessibilidade
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Mudar para tema claro')
  })

  it('switches theme when clicked', () => {
    const setThemeMock = jest.fn()

    // Mock do useTheme com a função setTheme mockada
    const mockUseTheme = useTheme as jest.Mock
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock
    })

    render(<ThemeSwitch />)

    // Clicar no botão
    fireEvent.click(screen.getByRole('button'))

    // Verificar se setTheme foi chamado com o valor correto
    expect(setThemeMock).toHaveBeenCalledWith('dark')
  })

  it('renders in compact mode correctly', () => {
    render(<ThemeSwitch compact />)

    // Não deve mostrar texto no modo compacto
    expect(screen.queryByText('Tema Escuro')).not.toBeInTheDocument()

    // Deve ter a classe para tornir o botão redondo
    const button = screen.getByRole('button')
    expect(button).toHaveClass('rounded-full')
  })
})
