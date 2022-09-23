import React from "react"
import { shortenAddress } from "../../utils/format"
import { FiExternalLink } from "react-icons/fi"
import { getTxUrl } from "../../utils/explorer"

interface Props {
  /**
   * Transaction hash
   */
  hash: string
}

const TxHash: React.FC<Props> = ({ hash }) => {
  return (
    <p className="text-sm text-white">
      Transaction hash:{" "}
      <a href={getTxUrl(hash)} target="_blank" rel="noreferrer" className="hover:text-green-300 transition-all">
        {shortenAddress(hash)} <FiExternalLink className="inline" />
      </a>
    </p>
  )
}

export default React.memo(TxHash)
