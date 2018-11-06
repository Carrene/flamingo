import { required, minLength, maxLength, minValue, maxValue } from 'vuelidate/lib/validators'
import { BrowserSession, Field, httpClient, Authenticator, Response } from 'restfulpy'

import { DOLPHIN_BASE_URL } from './settings.js'

class LocalAuthenticator extends Authenticator {
  // this token is cas token
  login (token) {
    return httpClient(`${DOLPHIN_BASE_URL}/apiv1/oauth2/tokens`, {
      verb: 'OBTAIN',
      payload: {
        authorizationCode: token
      }
    }, (...args) => {
      return new Response(null, ...args)
    }).then(resp => {
      this.token = resp.json.token
      return Promise.resolve(resp)
    }).catch((resp) => {
      this.deleteToken()
      return Promise.reject(resp)
    })
  }
}

const errorHandlers = {
  401: (status, redirectUrl) => {
    if (status === 401) {
      window.localStorage.removeItem('token')
      window
        .location
        .assign(window.location.origin +
          '/login?redirectUri=' + redirectUrl)
    }
  }
}

Field.prototype.createValidator = function (options) {
  options = Object.assign({}, this, options || {})
  let result = {}

  if (options.required) {
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

export default new BrowserSession(`${DOLPHIN_BASE_URL}/apiv1`, undefined, new LocalAuthenticator(), errorHandlers)
