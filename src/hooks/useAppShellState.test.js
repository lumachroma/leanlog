import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAppShellState } from './useAppShellState'

describe('useAppShellState', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('defaults to dashboard when no valid persisted page exists', () => {
    window.localStorage.setItem('leanlog.active-page', 'invalid-page')

    const { result } = renderHook(() => useAppShellState())

    expect(result.current.activePage).toBe('dashboard')
    expect(window.localStorage.getItem('leanlog.active-page')).toBe('dashboard')
  })

  it('restores persisted page changes and supports opening settings', () => {
    window.localStorage.setItem('leanlog.active-page', 'monthly-averages')

    const { result } = renderHook(() => useAppShellState())

    expect(result.current.activePage).toBe('monthly-averages')

    act(() => {
      result.current.setActivePage('history')
    })

    expect(result.current.activePage).toBe('history')
    expect(window.localStorage.getItem('leanlog.active-page')).toBe('history')

    act(() => {
      result.current.openSettings()
    })

    expect(result.current.activePage).toBe('settings')
    expect(window.localStorage.getItem('leanlog.active-page')).toBe('settings')
  })
})