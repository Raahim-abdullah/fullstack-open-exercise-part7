import axios from "axios"
const baseUrl = "/api/blogs"

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(`${baseUrl}/${newBlog.id}`, newBlog, config)
  return response.data
}

const deleteBlog = async (blog) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

const getAllComments = async (blogId) => {
  const response = await axios.get(`${baseUrl}/${blogId}/comments`)
  return await response.data
}

const addComment = async (blogId, comment) => {
  const body = {
    comment
  }
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, body)
  return await response.data
}

export default { getAll, create, update, deleteBlog, setToken, getAllComments, addComment }
