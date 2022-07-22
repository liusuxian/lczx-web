import request from '@/utils/request'

export function getClientOptions() {
  return request({
    url: 'auth/dept/clientOptions',
    method: 'get'
  })
}

export function getRoleDeptTree(data) {
  return request({
    url: 'auth/dept/roleDeptTree',
    method: 'get',
    params: data
  })
}

export function getDeptTree() {
  return request({
    url: 'auth/dept/tree',
    method: 'get'
  })
}

export function getDeptList(data) {
  return request({
    url: 'auth/dept/list',
    method: 'get',
    params: data
  })
}

export function addDept(data) {
  return request({
    url: 'auth/dept/add',
    method: 'post',
    data
  })
}

export function getDept(data) {
  return request({
    url: 'auth/dept/info',
    method: 'get',
    params: data
  })
}

export function updateDept(data) {
  return request({
    url: 'auth/dept/edit',
    method: 'put',
    data
  })
}

export function deleteDept(data) {
  return request({
    url: 'auth/dept/delete',
    method: 'delete',
    data
  })
}
