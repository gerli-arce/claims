import React, { useEffect } from "react"

interface ModalProps {
  show: boolean
  onClose: () => void
  title?: string
  size?: "sm" | "lg" | "xl"
  children: React.ReactNode
}

export default function Modal({ show, onClose, title, size = "xl", children }: ModalProps) {
  useEffect(() => {
    if (show) {
      document.body.classList.add("modal-open")
    } else {
      document.body.classList.remove("modal-open")
    }
    return () => {
      document.body.classList.remove("modal-open")
    }
  }, [show])

  if (!show) return null

  const sizeClass = size ? `modal-${size}` : ""

  return (
    <>
      <div className="modal fade show" style={{ display: "block" }} tabIndex={-1}>
        <div className={`modal-dialog ${sizeClass} modal-dialog-scrollable modal-dialog-centered`}>
          <div className="modal-content">
            <div className="modal-header">
              {title && <h5 className="modal-title">{title}</h5>}
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </>
  )
}
