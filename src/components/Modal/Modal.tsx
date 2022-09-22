import React, { PropsWithChildren } from "react"

interface Props {
  /**
   * If Modal can be closed or not
   */
  closeable?: boolean

  /**
   * Callback when modal is closing
   */
  onClose?: () => void
}

const Modal: React.FC<PropsWithChildren<Props>> = ({ closeable, children, onClose }) => {
  const [isVisible, setIsVisible] = React.useState(true)

  /**
   * Hide the modal
   */
  const handleClose = React.useCallback(
    (e: React.SyntheticEvent) => {
      if (!closeable) return

      e.stopPropagation()

      setIsVisible(false)
      onClose?.()
    },
    [onClose, closeable]
  )

  return isVisible ? (
    <div
      className="fixed top-0 left-0 bottom-0 right-0 z-10 px-1 flex items-center justify-center bg-[linear-gradient(-45deg,_#010008,_#070526,_#3d3982,_#11054d)] bg-[length:400%_400%] animate-[gradientBG_15s_ease_infinite]"
      onClick={handleClose}
    >
      <div>{children}</div>
    </div>
  ) : null
}

export default Modal
