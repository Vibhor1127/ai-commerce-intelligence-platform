const TOKEN = 'aci.token'
const USER = 'aci.user'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN)
}

export function getUsername(): string | null {
  return localStorage.getItem(USER)
}

export function persistSession(token: string, username: string) {
  localStorage.setItem(TOKEN, token)
  localStorage.setItem(USER, username)
}

export function clearSession() {
  localStorage.removeItem(TOKEN)
  localStorage.removeItem(USER)
}

export function isAuthenticated(): boolean {
  return Boolean(getToken())
}
