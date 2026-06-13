import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterPage from '@/app/(auth)/register/page'

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { signUp: jest.fn().mockResolvedValue({ error: null }) },
  }),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

describe('RegisterPage', () => {
  it('renderiza el formulario correctamente', () => {
    render(<RegisterPage />)
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument()
  })

  it('muestra errores si el formulario está vacío', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))
    await waitFor(() => {
      expect(screen.getByText(/el nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument()
    })
  })

  it('muestra error si las contraseñas no coinciden', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)
    await user.type(screen.getByLabelText('Nombre completo'), 'Juan Pérez')
    await user.type(screen.getByLabelText('Correo electrónico'), 'juan@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'diferente123')
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))
    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
    })
  })

  it('muestra error si la contraseña tiene menos de 8 caracteres', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)
    await user.type(screen.getByLabelText('Contraseña'), 'corta')
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))
    await waitFor(() => {
      expect(screen.getByText(/la contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument()
    })
  })
})
