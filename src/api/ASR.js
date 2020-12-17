import { get } from '../utils/http'

const prefix = '/ASR'

export function convertToText (requestParam) {
  return get(`${prefix}/convert`, requestParam)
}
