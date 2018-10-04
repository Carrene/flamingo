export const DOLPHIN_BASE_URL = process.env.NODE_ENV === 'production'
  ? `${window.location.protocol}//${window.location.hostname}` : 'http://192.168.1.85'

// FIXME: Fix URLs after deploying CAS and Jaguar

export const JAGUAR_BASE_URL = process.env.NODE_ENV === 'production'
  ? `https://jaguar.carrene.com` : 'http://192.168.1.85:8082'

export const CAS_FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? `https://cas.carrene.com` : 'http://localhost:8084'

export const SCOPES = ['title', 'email']

export const APPLICATION_ID = 1
