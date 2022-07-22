import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: 'user/info',
    method: 'get'
  })
}

export function getProfile() {
  return request({
    url: 'user/profile',
    method: 'get'
  })
}

export function uploadAvatar(data) {
  return request({
    url: 'user/uploadAvatar',
    method: 'post',
    data
  })
}

export function profileEdit(data) {
  return request({
    url: 'user/profileEdit',
    method: 'put',
    data
  })
}

export function pwdEdit(data) {
  return request({
    url: 'user/pwdEdit',
    method: 'put',
    data
  })
}

export function logout() {
  return request({
    url: 'logout',
    method: 'post'
  })
}
