export const DOLPHIN_BASE_URL = process.env.NODE_ENV === 'production'
  ? `${window.location.protocol}//${window.location.hostname}` : 'http://localhost:8081'

// FIXME: Fix URLs after deploying CAS and Jaguar

export const CAS_BASE_URL = process.env.NODE_ENV === 'production'
  ? `https://cas.carrene.com` : 'http://localhost:8082'

export const JAGUAR_BASE_URL = process.env.NODE_ENV === 'production'
  ? `https://jaguar.carrene.com` : 'http://localhost:8083'

export const SCOPES = ['title', 'email']

export const APPLICATION_ID = 1
