import { get } from '../utils/http'

const prefix = '/test'

export function getTest () {
  return get(`${prefix}/hello`)
}
