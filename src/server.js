import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { default as Session, Field, httpClient, Authenticator } from 'restfulpy'

import { BASE_URL } from './settings.js'

class MyAuthenticator extends Authenticator {
  login () {
    return httpClient(`${BASE_URL}/apiv1/`, {
      verb: '',
      payload: {
      }
    }).then().catch()
  }
}

class Server extends Session {
  constructor () {
    super(`${BASE_URL}/apiv1`, undefined, new MyAuthenticator())
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

// Creating a single instance of restfulpy-client naming it server!
export default new Server()
