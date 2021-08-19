import Cookies from 'js-cookie'

export function getToken() {
  // return Cookies.get(TokenKey);
  let data = sessionStorage.getItem('vuexStorage')
  data = data ? JSON.parse(data) : null
  if (data == null) {
    return ''
  }
  return data.user ? data.user.token : ''
}
// 获取cas ticket
export function getTicket() {
  let data = sessionStorage.getItem('vuexStorage')
  data = data ? JSON.parse(data) : null
  if (data == null) {
    return ''
  }
  return data.user ? data.user.ticket : ''
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

