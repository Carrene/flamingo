import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { default as Session, Field, httpClient, Authenticator, Response } from 'restfulpy'

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
      // FIXME: FIX THIS
      window.localStorage.removeItem('token')
      window
        .location
        .assign(window.location.origin +
          '/login?redirect=' + redirectUrl)
    }
  }
}

Field.prototype.createValidator = function (options) {
  options = Object.assign({}, this, options || {})
  let result = {}

  if (!options.optional) {
    result['required'] = required
  }

  if (options.minLength) {
    result['minLength'] = minLength(options.minLength)
  }

  if (options.maxLength) {
    result['maxLength'] = maxLength(options.maxLength)
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

export default new Session(`${DOLPHIN_BASE_URL}/apiv1`, undefined, new LocalAuthenticator(), errorHandlers)
