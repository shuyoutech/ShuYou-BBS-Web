export const useShareStore = defineStore(
  // 唯一ID
  'share',
  () => {
    const code = ref('')
    const state = ref('')
    const bindCode = ref('')
    const bindState = ref('')
    return {
      code,
      state,
      bindCode,
      bindState,
    }
  },
)
