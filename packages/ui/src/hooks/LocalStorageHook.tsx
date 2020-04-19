export const LocalStorageKeys = {
  TOKEN: 'sheeted:token',
}

class Storage {
  getToken() {
    return localStorage.getItem(LocalStorageKeys.TOKEN)
  }
  setToken(token: string) {
    return localStorage.setItem(LocalStorageKeys.TOKEN, token)
  }
  removeToken() {
    return localStorage.removeItem(LocalStorageKeys.TOKEN)
  }
}

const storage = new Storage()

export const useLocalStorage = () => {
  return storage
}
