import React from "react"
import { FaExclamation } from "react-icons/fa"

function ErrorIcon() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-[100px] w-[100px] border-2 border-red-500 rotate-45">
        <div className="-rotate-45 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <FaExclamation className="text-red-500" size={50} />
        </div>
      </div>
    </div>
  )
}

export default ErrorIcon
