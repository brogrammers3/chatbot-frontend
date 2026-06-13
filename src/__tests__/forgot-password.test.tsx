import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ForgotPasswordPage from '@/app/(auth)/forgot-password/page'

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }) },
  }),
}))

describe('ForgotPasswordPage', () => {
  it('renderiza el formulario correctamente', () => {
    render(<ForgotPasswordPage />)
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar enlace/i })).toBeInTheDocument()
  })

  it('muestra error si el email es inválido', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordPage />)
    await user.type(screen.getByLabelText('Correo electrónico'), 'no-es-email')
    await user.click(screen.getByRole('button', { name: /enviar enlace/i }))
    await waitFor(() => {
      expect(screen.getByText(/ingresa un email válido/i)).toBeInTheDocument()
    })
  })

  it('muestra confirmación después de enviar', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordPage />)
    await user.type(screen.getByLabelText('Correo electrónico'), 'test@test.com')
    await user.click(screen.getByRole('button', { name: /enviar enlace/i }))
    await waitFor(() => {
      expect(screen.getByText(/revisa tu correo/i)).toBeInTheDocument()
    })
  })
})
