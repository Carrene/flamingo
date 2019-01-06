export const DOLPHIN_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? `${window.location.protocol}//${window.location.hostname}`
    : 'http://localhost:8081'

export const JAGUAR_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? `${window.location.protocol}//${
      window.location.hostname.split('.')[0]
    }.cucumber.carrene.com`
    : 'http://localhost:8084'

// TODO: Revise the protocol
export const JAGUAR_WEBSOCKET_URL =
  process.env.NODE_ENV === 'production'
    ? `ws://${window.location.hostname.split('.')[0]}.cucumber.carrene.com`
    : 'ws://localhost:8085'

export const CAS_BACKEND_URL =
  process.env.NODE_ENV === 'production'
    ? `${window.location.protocol}//${
      window.location.hostname.split('.')[0]
    }.cas.carrene.com/apiv1`
    : 'http://localhost:8083/apiv1'

export const CAS_FRONTEND_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? `${window.location.protocol}//${
      window.location.hostname.split('.')[0]
    }.cas.carrene.com`
    : 'http://localhost:8082'

export const SCOPES = ['title', 'email', 'avatar', 'name']

export const APPLICATION_ID = 1
