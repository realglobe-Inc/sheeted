export const LocalStorageKeys = {
  TOKEN: 'sheeted:token',
}

class Storage {
  getToken(): string | null {
    return window.localStorage.getItem(LocalStorageKeys.TOKEN)
  }
  setToken(token: string): void {
    return window.localStorage.setItem(LocalStorageKeys.TOKEN, token)
  }
  removeToken(): void {
    return window.localStorage.removeItem(LocalStorageKeys.TOKEN)
  }
}

const storage = new Storage()

export const useLocalStorage = (): Storage => {
  return storage
}
