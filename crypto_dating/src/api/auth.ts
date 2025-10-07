import api from './axios'

export interface RegisterData {
  email: string
  password: string
  password_confirmation: string
  name?: string
}

export const register = async (data: RegisterData) => {
  const res = await api.post('/register', data)
  return res.data
}

export const login = async (email: string, password: string) => {
  const res = await api.post('/login', { email, password })
  return res.data
}

export const getUser = async (token: string) => {
  const res = await api.get('/user', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const logout = async (token: string) => {
  await api.post(
    '/logout',
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
}

// Example API call to increment correct answers when a user answers correctly
export const incrementCorrectAnswers = async (token: string) => {
  const res = await api.post(
    '/quiz/correct',
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
}
