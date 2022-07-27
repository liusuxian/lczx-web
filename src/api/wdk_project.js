import request from '@/utils/request'
import myFetchRequest from '@/utils/my-fetch-request'

export function getClientOptions() {
  return request({
    url: 'wdk/project/clientOptions',
    method: 'get'
  })
}

export function getProjectList(data) {
  return request({
    url: 'wdk/project/list',
    method: 'get',
    params: data
  })
}

export function addProject(data) {
  return request({
    url: 'wdk/project/add',
    method: 'post',
    data
  })
}

export function getProject(data) {
  return request({
    url: 'wdk/project/info',
    method: 'get',
    params: data
  })
}

export function updateProject(data) {
  return request({
    url: 'wdk/project/edit',
    method: 'put',
    data
  })
}

export function deleteProject(data) {
  return request({
    url: 'wdk/project/delete',
    method: 'delete',
    data
  })
}

export function getExportProject(data) {
  return myFetchRequest('wdk/project/export', {
    body: data
  })
}
