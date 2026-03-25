import request from '@/utils/request'

export const getArticleCateListAPI = () => {
  return request({
    url: '/my/cate/list',
    method: 'GET'
  })
}

export const addArticleCateAPI = (data) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data
  })
}

export const getArticleCateInfoAPI = (id) => {
  return request({
    url: '/my/cate/info',
    method: 'GET',
    params: { id }
  })
}

export const updateArticleCateAPI = (data) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data
  })
}

export const deleteArticleCateAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: { id }
  })
}

export const getArticleListAPI = (params) => {
  return request({
    url: '/my/article/list',
    method: 'GET',
    params
  })
}

export const addArticleAPI = (data) => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    data
  })
}

export const getArticleInfoAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'GET',
    params: { id }
  })
}

export const deleteArticleAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: { id }
  })
}

export const updateArticleAPI = (data) => {
  return request({
    url: '/my/article/info',
    method: 'PUT',
    data
  })
}
