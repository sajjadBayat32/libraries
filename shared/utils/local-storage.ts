export type LocalStorage =
  'JWT_Token' |
  'Refresh_Token' |
  'SelectedComplex' |
  'SelectedField'

export function setLocalStorage(key: LocalStorage, value: string) {
  localStorage.setItem(key, value);
}

export function getLocalStorage(key: LocalStorage): string {
  return localStorage.getItem(key);
}

export function removeLocalStorage(key: LocalStorage) {
  localStorage.removeItem(key);
}
