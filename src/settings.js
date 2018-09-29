export const DOLPHIN_BASE_URL = process.env.NODE_ENV === 'production'
  ? `${window.location.protocol}//${window.location.hostname}` : 'http://localhost:8081'

// FIXME: Fix URLs after deploying CAS

export const CAS_BASE_URL = process.env.NODE_ENV === 'production'
  ? `https://cas.carrene.com` : 'http://localhost:8082'
