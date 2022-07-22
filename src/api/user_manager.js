import request from '@/utils/request'

export function getClientOptions() {
  return request({
    url: 'auth/user/clientOptions',
    method: 'get'
  })
}

export function getUserList(data) {
  return request({
    url: 'auth/user/list',
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: 'auth/user/add',
    method: 'post',
    data
  })
}

export function getUserEdit(data) {
  return request({
    url: 'auth/user/getEdit',
    method: 'get',
    params: data
  })
}

export function updateUser(data) {
  return request({
    url: 'auth/user/edit',
    method: 'put',
    data
  })
}

export function resetUserPwd(data) {
  return request({
    url: 'auth/user/resetPwd',
    method: 'put',
    data
  })
}

export function setUserStatus(data) {
  return request({
    url: 'auth/user/setStatus',
    method: 'put',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: 'auth/user/delete',
    method: 'delete',
    data
  })
}

export function searchByRealname(data) {
  return request({
    url: 'auth/user/searchByRealname',
    method: 'get',
    params: data
  })
}
