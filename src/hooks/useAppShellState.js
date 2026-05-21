import { useEffect, useState } from 'react'

const PAGE_STORAGE_KEY = 'leanlog.active-page'

const VALID_PAGES = new Set([
  'dashboard',
  'weekly-averages',
  'monthly-averages',
  'history',
  'about',
  'settings',
])

const getDefaultPage = () => 'dashboard'

const readPersistedPage = () => {
  if (typeof window === 'undefined') {
    return getDefaultPage()
  }

  const persistedPage = window.localStorage.getItem(PAGE_STORAGE_KEY)

  return VALID_PAGES.has(persistedPage) ? persistedPage : getDefaultPage()
}

export function useAppShellState() {
  const [activePage, setActivePage] = useState(readPersistedPage)

  useEffect(() => {
    window.localStorage.setItem(PAGE_STORAGE_KEY, activePage)
  }, [activePage])

  return {
    activePage,
    setActivePage,
    openSettings: () => setActivePage('settings'),
  }
}