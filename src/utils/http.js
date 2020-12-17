import axios from 'axios'
import * as qs from 'qs'

const http = axios.create({
  baseURL: '/api',
  timeout: 300000,
  withCredentials: false
})

http.interceptors.request.use(
  requestConfig => {
    return requestConfig
  },
  error => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export function post (url, data = {}) {
  return http({
    method: 'post',
    url,
    data
  })
}

export function get (url, params = {}) {
  return http({
    method: 'get',
    url,
    params,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

export function _delete (url) {
  return http({
    method: 'delete',
    url
  })
}
