import request from '@/utils/request'

export function getClientOptions() {
  return request({
    url: 'auth/role/clientOptions',
    method: 'get'
  })
}

export function getRoleList(data) {
  return request({
    url: 'auth/role/list',
    method: 'get',
    params: data
  })
}

export function setRoleStatus(data) {
  return request({
    url: 'auth/role/setStatus',
    method: 'put',
    data
  })
}

export function setRoleDataScope(data) {
  return request({
    url: 'auth/role/setDataScope',
    method: 'put',
    data
  })
}

export function addRole(data) {
  return request({
    url: 'auth/role/add',
    method: 'post',
    data
  })
}

export function getRole(data) {
  return request({
    url: 'auth/role/info',
    method: 'get',
    params: data
  })
}

export function updateRole(data) {
  return request({
    url: 'auth/role/edit',
    method: 'put',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: 'auth/role/delete',
    method: 'delete',
    data
  })
}

export function getEnableRoles() {
  return request({
    url: 'auth/role/enableRoles',
    method: 'get'
  })
}
