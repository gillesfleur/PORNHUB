export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (password.length < 8) errors.push('Le mot de passe doit contenir au moins 8 caractères.')
  if (!/[A-Z]/.test(password)) errors.push('Le mot de passe doit contenir au moins une majuscule.')
  if (!/[a-z]/.test(password)) errors.push('Le mot de passe doit contenir au moins une minuscule.')
  if (!/[0-9]/.test(password)) errors.push('Le mot de passe doit contenir au moins un chiffre.')

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateUsername(username: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (username.length < 3) errors.push('Le nom d’utilisateur doit contenir au moins 3 caractères.')
  if (username.length > 20) errors.push('Le nom d’utilisateur ne doit pas dépasser 20 caractères.')
  
  const usernameRegex = /^[a-zA-Z0-9_]+$/
  if (!usernameRegex.test(username)) {
    errors.push('Le nom d’utilisateur ne peut contenir que des lettres, des chiffres et des underscores.')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function sanitizeInput(input: string, stripHtmlTags: boolean = false): string {
  if (!input) return ''
  let sanitized = input.trim()
  
  if (stripHtmlTags) {
    sanitized = sanitized.replace(/<[^>]*>?/gm, '')
  }

  return sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export function validateId(id: string): boolean {
  // Support CUID and UUID
  const cuidRegex = /^c[a-z0-9]{24}$/
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return cuidRegex.test(id) || uuidRegex.test(id)
}

export function validateLength(input: string, min: number, max: number): boolean {
  return input.length >= min && input.length <= max
}
