import React from "react"
import { FaCheck } from "react-icons/fa"

function SuccessIcon() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-[100px] w-[100px] border-2 border-green-500 rotate-45">
        <div className="-rotate-45 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <FaCheck className="text-green-500" size={60} />
        </div>
      </div>
    </div>
  )
}

export default SuccessIcon
