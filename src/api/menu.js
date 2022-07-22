import request from '@/utils/request'

export function getMenuTree() {
  return request({
    url: 'auth/menu/tree',
    method: 'get'
  })
}

export function getIsMenus(data) {
  return request({
    url: 'auth/menu/isMenus',
    method: 'get',
    params: data
  })
}
