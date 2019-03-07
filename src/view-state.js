export default class ViewState {
  constructor (pageOptions) {
    this.page = pageOptions.page || 1
    this.pageSize = pageOptions.pageSize || 24
    this.pageCount = pageOptions.pageCount || 1
    this.relatedIssueId = pageOptions.relatedIssueId
  }

  generateString () {
    let params = []
    if (this.page !== 1) {
      params.push(`page=${this.page}`)
    }
    if (this.pageSize !== 100) {
      params.push(`pageSize=${this.pageSize}`)
    }
    if (this.relatedIssueId) {
      params.push(`relatedIssueId=${this.relatedIssueId}`)
    }
    return params.join('&')
  }

  get query () {
    let query = {}
    if (this.page !== 1) {
      query.page = this.page
    }
    if (this.pageSize !== 24) {
      query.pageSize = this.pageSize
    }
    if (this.relatedIssueId) {
      query.relatedIssueId = this.relatedIssueId
    }
    return query
  }

  static createFromString (string) {
    let parts = string.split('&')
    let options = {}
    for (let part in parts) {
      let key = part.split['='][0]
      let value = part.split['='][1]
      options[key] = value
    }
    return new this(options)
  }
}
