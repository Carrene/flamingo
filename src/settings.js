export const DOLPHIN_BASE_URL = process.env.NODE_ENV === 'production'
  ? `${window.location.protocol}//${window.location.hostname}` : 'http://localhost:8081'

export const JAGUAR_BASE_URL = process.env.NODE_ENV === 'production'
  ? `${window.location.protocol}//${window.location.hostname.split('.')[0]}.cucumber.carrene.com`
  : 'http://192.168.1.85:8082'

export const CAS_BACKEND_URL = process.env.NODE_ENV === 'production'
  ? `${window.location.protocol}//${window.location.hostname.split('.')[0]}.cas.carrene.com`
  : 'http://192.168.1.85:8081/apiv1'

export const CAS_FRONTEND_BASE_URL = process.env.NODE_ENV === 'production'
  ? `${window.location.protocol}//${window.location.hostname.split('.')[0]}.cas.carrene.com`
  : 'http://localhost:8082'

export const SCOPES = ['title', 'email']

export const APPLICATION_ID = 1
