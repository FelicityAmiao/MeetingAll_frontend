import { post } from '../utils/http';

export function login (requestBody) {
  return post(`/auth`, requestBody);
}
