import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/(auth)/login/page'

const mockSignInWithPassword = jest.fn().mockResolvedValue({ error: null })

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { signInWithPassword: mockSignInWithPassword },
  }),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

beforeEach(() => {
  mockSignInWithPassword.mockResolvedValue({ error: null })
})

describe('LoginPage', () => {
  it('renderiza el formulario correctamente', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('muestra error si el email es inválido', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    await user.type(screen.getByLabelText('Correo electrónico'), 'no-es-email')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    await waitFor(() => {
      expect(screen.getByText(/ingresa un email válido/i)).toBeInTheDocument()
    })
  })

  it('muestra error de credenciales incorrectas desde Supabase', async () => {
    const user = userEvent.setup()
    mockSignInWithPassword.mockResolvedValueOnce({ error: { message: 'Invalid credentials' } })
    render(<LoginPage />)
    await user.type(screen.getByLabelText('Correo electrónico'), 'test@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    await waitFor(() => {
      expect(screen.getByText(/correo o contraseña incorrectos/i)).toBeInTheDocument()
    })
  })

  it('tiene link a registro y a olvidé contraseña', () => {
    render(<LoginPage />)
    expect(screen.getByRole('link', { name: /regístrate gratis/i })).toHaveAttribute('href', '/register')
    expect(screen.getByRole('link', { name: /olvidaste tu contraseña/i })).toHaveAttribute('href', '/forgot-password')
  })
})
