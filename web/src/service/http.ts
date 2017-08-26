import axios from 'axios'


export default {
  get: (url: string, param?: object) => new Promise(async(resolve, reject) => {
    try {
      let response = await axios.get(url, param)
      resolve(response.data)
    } catch(e) {
      reject(e)
    } 
  }),
  put: axios.put,
  post: axios.post,
  delete: axios.delete
}