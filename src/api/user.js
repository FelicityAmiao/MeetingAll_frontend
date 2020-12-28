import { _delete, get, post } from '../utils/http';

/*
* Using example:
import { getUser, postUser, deleteUser } from './api/user.js'

postUser({ 'abc': 'abc' }).then(res => {
    console.log(res.data.bc)
})
getUser({ 'abc': 'abc' }).then(res => {
    console.log(res.data.bc)
})
deleteUser('123').then(res => {
    console.log(res.data.bc)
})
* */

const prefix = '/user';

export function getUser (requestParam) {
  return get(`${prefix}/path1`, requestParam);
}

export function postUser (requestBody) {
  return post(`${prefix}/path2`, requestBody);
}

export function deleteUser (id) {
  return _delete(`${prefix}/path3/${id}`);
}
