import axios from "axios"
const baseUrl = "/api/users"

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return await response.data
}

export default {
  getAll
}
