import React from 'react'
import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { OptimizedImage, DecorativeImage, Avatar } from '../shared/OptimizedImage'

// Mock do next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onLoad, onError, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // Simula o evento onLoad quando a imagem é renderizada
    React.useEffect(() => {
      if (onLoad) onLoad({} as any)
    }, [onLoad])

    return <img src={src} alt={alt} {...props} data-testid="next-image" />
  }
}))

describe('OptimizedImage Component', () => {
  it('renders with correct props', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    )

    const image = screen.getByTestId('next-image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveAttribute('alt', 'Test image')
  })

  it('shows loading state initially', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    )

    const container = screen.getByTestId('next-image').parentElement
    expect(container).toHaveAttribute('aria-busy', 'true')
  })

  it('hides loading state after image loads', async () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    )

    await waitFor(() => {
      const container = screen.getByTestId('next-image').parentElement
      expect(container).toHaveAttribute('aria-busy', 'false')
    })
  })

  it('uses priority loading when specified', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        priority={true}
      />
    )

    const image = screen.getByTestId('next-image')
    expect(image).toHaveAttribute('loading', 'eager')
    expect(image).toHaveAttribute('fetchPriority', 'high')
  })
})

describe('DecorativeImage Component', () => {
  it('renders with empty alt text', () => {
    render(
      <DecorativeImage
        src="/decorative-image.jpg"
        width={300}
        height={200}
      />
    )

    const image = screen.getByTestId('next-image')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('Avatar Component', () => {
  it('renders with name as alt text', () => {
    render(
      <Avatar
        name="John Doe"
        src="/avatar.jpg"
        size={50}
      />
    )

    const image = screen.getByTestId('next-image')
    expect(image).toHaveAttribute('alt', 'Foto de John Doe')

    const container = image.closest('div')
    expect(container).toHaveAttribute('aria-label', 'Avatar de John Doe')
  })

  it('shows initials when no image is provided', () => {
    render(
      <Avatar
        name="John Doe"
        size={50}
      />
    )

    const initials = screen.getByText('JD')
    expect(initials).toBeInTheDocument()
  })
})
