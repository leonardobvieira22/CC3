// Imports para estender o Jest com matchers personalizados
import '@testing-library/jest-dom'

// Configurações globais
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

// Mock da função window.scrollTo
Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true })

// Mock para IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
})
window.IntersectionObserver = mockIntersectionObserver

// Mock para matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Console de erros personalizado para testes mais limpos
const originalConsoleError = console.error
console.error = (...args) => {
  // Filtrar alguns erros esperados durante os testes
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render') ||
     args[0].includes('Warning: useLayoutEffect') ||
     args[0].includes('Not implemented: navigation'))
  ) {
    return
  }
  originalConsoleError(...args)
}
