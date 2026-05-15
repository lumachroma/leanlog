import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { createAppViewModel } from '@/hooks/app-view-model-sections'
import { selectAppViewModelState, useAppStore } from '@/store/useAppStore'

export function useAppViewModel() {
  const state = useAppStore(useShallow(selectAppViewModelState))
  const { hydrateApp } = state

  useEffect(() => {
    void hydrateApp()
  }, [hydrateApp])

  return createAppViewModel(state)
}