export default {
  get: (key: string) => {
    let v:any = localStorage.getItem(key)
    return v
  },
  set: (key: string, value: any) => {
    return localStorage.setItem(key, value)
  },
  remove: (key: string) => {
    return localStorage.removeItem(key)
  },
  clear: localStorage.clear
}
