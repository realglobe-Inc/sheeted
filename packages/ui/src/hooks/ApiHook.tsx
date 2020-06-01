import { Sheeted } from '../Sheeted'
import { ApiRequest } from '../ApiRequest'

class ApiContainer {
  private api?: ApiRequest

  getInstance(): ApiRequest {
    if (this.api) {
      return this.api
    } else {
      const api = new ApiRequest(Sheeted.apiUrl)
      this.api = api
      return api
    }
  }
}

const container = new ApiContainer()

export const useApi = (): ApiRequest => {
  return container.getInstance()
}
