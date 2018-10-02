import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { default as Session, Field, httpClient, Authenticator } from 'restfulpy'

import { DOLPHIN_BASE_URL, CAS_BASE_URL, SCOPES, APPLICATION_ID } from './settings.js'

class MaestroAuthenticator extends Authenticator {
  // this token is cas token
  login (token) {
    this.token = token
  }
}

class CasAuthenticator extends Authenticator {
  // This should return cas token
  login (email, password) {
    return httpClient(`${CAS_BASE_URL}/apiv1/tokens`, {
      verb: 'CREATE',
      payload: {
        email: email,
        password: password
      }
    }).then(resp => {
      if (resp.status === 200) {
        this.token = resp.json.token
        return resp.json.token
      } else {
        this.deleteToken()
      }
    }).catch(() => {
      this.deleteToken()
    })
  }
}

let maestroAuthenticator = new MaestroAuthenticator()
let casAuthenticator = new CasAuthenticator()

const maestroErrorHandlers = {
  401: (status, redirectUrl) => {
    if (status === 401) {
      window
        .location
        .assign(CAS_BASE_URL +
          '/permissions?scopes=' + SCOPES.join(',') +
          '&applicationId=' + APPLICATION_ID +
          '&redirect=' + redirectUrl)
    }
  }
}

class MaestroServer extends Session {
  constructor () {
    super(`${DOLPHIN_BASE_URL}/apiv1`, undefined, maestroAuthenticator, maestroErrorHandlers)
  }
}

class CasServer extends Session {
  constructor () {
    super(`${CAS_BASE_URL}/apiv1`, undefined, casAuthenticator)
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

let maestroServer = new MaestroServer()
let casServer = new CasServer()
export { maestroServer as server, casServer }
