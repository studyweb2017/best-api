export default {
  get: (key: string) => {
<<<<<<< HEAD
    let v:any = localStorage.getItem(key)
    return v
  },
  set: (key: string, value: any) => {
    return localStorage.setItem(key, value)
=======
    return JSON.parse(JSON.stringify(localStorage.getItem(key)))
  },
  set: (key: string, value: any) => {
    return localStorage.setItem(key,JSON.stringify(value))
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
  },
  remove: (key: string) => {
    return localStorage.removeItem(key)
  },
  clear: localStorage.clear
}
