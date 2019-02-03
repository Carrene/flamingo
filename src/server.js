import {
  required,
  minLength,
  maxLength,
  minValue,
  maxValue
} from 'vuelidate/lib/validators'
import {
  BrowserSession,
  Field,
  httpClient,
  Authenticator,
  Response
} from 'restfulpy'
import router from './router'
import {
  DOLPHIN_BASE_URL,
  CAS_BACKEND_URL,
  JAGUAR_BASE_URL
} from './settings.js'

class LocalAuthenticator extends Authenticator {
  // this token is cas token
  login (token, organizationId) {
    return httpClient(
      `${DOLPHIN_BASE_URL}/apiv1/oauth2/tokens`,
      {
        verb: 'OBTAIN',
        payload: {
          authorizationCode: token,
          organizationId: organizationId
        }
      },
      (...args) => {
        return new Response(null, ...args)
      }
    )
      .then(resp => {
        this.token = resp.json.token
        return Promise.resolve(resp)
      })
      .catch(resp => {
        this.deleteToken()
        return Promise.reject(resp)
      })
  }

  logout () {
    this.deleteToken()
  }

  canAssign (project) {
    return (
      this.isInRole('manager') && this.member.referenceId === project.memberId
    )
  }
}

let authenticator = new LocalAuthenticator()

const dolphinErrorHandlers = {
  401: (response, redirectUrl) => {
    window.localStorage.removeItem('token')
    router.push({
      name: 'Login',
      query: {
        redirectUri: redirectUrl
      }
    })
  },
  404: (response, redirectUrl) => {
    router.push({
      name: '404'
    })
  },
  500: (response, redirectUrl) => {
    router.push({
      name: '500',
      params: {
        response: response,
        repository: 'dolphin'
      }
    })
  }
}

const pandaErrorHandlers = {
  401: (response, redirectUrl) => {
    window.localStorage.removeItem('token')
    router.push({
      name: 'Login',
      query: {
        redirectUri: redirectUrl
      }
    })
  },
  404: (response, redirectUrl) => {
    router.push({
      name: '404'
    })
  },
  500: (response, redirectUrl) => {
    router.push({
      name: '500',
      params: {
        response: response,
        repository: 'panda'
      }
    })
  }
}

const jaguarErrorHandlers = {
  401: (response, redirectUrl) => {
    window.localStorage.removeItem('token')
    router.push({
      name: 'Login',
      query: {
        redirectUri: redirectUrl
      }
    })
  },
  404: (response, redirectUrl) => {
    router.push({
      name: '404'
    })
  },
  500: (response, redirectUrl) => {
    router.push({
      name: '500',
      params: {
        response: response,
        repository: 'jaguar'
      }
    })
  }
}

Field.prototype.createValidator = function (options) {
  options = Object.assign({}, this, options || {})
  let result = {}

  if (options.notNone) {
    result['required'] = required
  }

  if (options.minLength) {
    result['minLength'] = minLength(options.minLength)
  }

  if (options.maxLength) {
    result['maxLength'] = maxLength(options.maxLength)
  }

  if (options.minimum) {
    result['minValue'] = minValue(options.minimum)
  }

  if (options.maximum) {
    result['maxValue'] = maxValue(options.maximum)
  }

  if (options.pattern) {
    result['pattern'] = function (value) {
      if (!value || value === '') {
        return true
      }
      return value.match(new RegExp(options.pattern)) !== null
    }
  }
  return result
}

let server = new BrowserSession(
  `${DOLPHIN_BASE_URL}/apiv1`,
  undefined,
  authenticator,
  dolphinErrorHandlers
)

let casServer = new BrowserSession(
  `${CAS_BACKEND_URL}`,
  undefined,
  authenticator,
  pandaErrorHandlers
)

let jaguarServer = new BrowserSession(
  `${JAGUAR_BASE_URL}/apiv1`,
  undefined,
  authenticator,
  jaguarErrorHandlers
)

export { server as default, casServer, jaguarServer }
