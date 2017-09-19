export default {
  get: (key: string) => {
    return JSON.parse(JSON.stringify(localStorage.getItem(key)))
  },
  set: (key: string, value: any) => {
    return localStorage.setItem(key,JSON.stringify(value))
  },
  remove: (key: string) => {
    return localStorage.removeItem(key)
  },
  clear: localStorage.clear
}
