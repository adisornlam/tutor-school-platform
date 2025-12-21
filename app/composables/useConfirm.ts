export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  showInput?: boolean
  inputLabel?: string
  inputPlaceholder?: string
}

export const useConfirm = () => {
  const isOpen = useState<boolean>('confirmModal:isOpen', () => false)
  const options = useState<ConfirmOptions | null>('confirmModal:options', () => null)
  const resolveRef = useState<((value: string | boolean) => void) | null>('confirmModal:resolve', () => null)

  const confirm = (opts: ConfirmOptions | string): Promise<string | boolean> => {
    return new Promise((resolve) => {
      const confirmOptions: ConfirmOptions = typeof opts === 'string'
        ? { message: opts }
        : opts

      options.value = confirmOptions
      isOpen.value = true
      resolveRef.value = resolve
    })
  }

  const handleConfirm = async (value?: string) => {
    if (resolveRef.value) {
      if (options.value?.showInput) {
        resolveRef.value(value || '')
      } else {
        resolveRef.value(true)
      }
    }
    // Close modal first, then clear options after transition completes
    isOpen.value = false
    // Wait for transition to complete before clearing options
    await new Promise(resolve => setTimeout(resolve, 300))
    options.value = null
    resolveRef.value = null
  }

  const handleCancel = async () => {
    if (resolveRef.value) {
      if (options.value?.showInput) {
        resolveRef.value(false)
      } else {
        resolveRef.value(false)
      }
    }
    // Close modal first, then clear options after transition completes
    isOpen.value = false
    // Wait for transition to complete before clearing options
    await new Promise(resolve => setTimeout(resolve, 300))
    options.value = null
    resolveRef.value = null
  }

  return {
    isOpen: readonly(isOpen),
    options: readonly(options),
    confirm,
    handleConfirm,
    handleCancel
  }
}

