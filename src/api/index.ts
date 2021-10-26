import { createAPI } from './http'
const project = {
  index: (params?: any) => createAPI('/project/index', 'get', params),
  batchEnable: (params?: any) => createAPI(`/project/batchEnable/${params.id}`, 'post', params, { isJson: true })
}
export {
  project
}
