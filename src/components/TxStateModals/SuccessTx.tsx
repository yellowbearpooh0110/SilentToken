import React from "react"
import Modal from "../Modal/Modal"
import TxHash from "./TxHash"
import { Column } from "../Layout"
import SuccessIcon from "../SuccessIcon/SuccessIcon"
import TransactionTypeMessages, { TxType } from "../../utils/txModalMessages"

interface Props {
  /**
   * Transaction type
   */
  type: TxType

  /**
   * Transaction hash
   */
  hash?: string
}

const SuccessTx: React.FC<Props> = ({ type, hash }) => {
  return (
    <Modal closeable>
      <Column spacing="m" alignment="center">
        <SuccessIcon />
        <p className="text-4xl text-center text-white font-bold">{TransactionTypeMessages[type].SUCCESS.title}</p>
        {TransactionTypeMessages[type].SUCCESS.messages.map((message, index) => (
          <p key={index} className="text-white text-center">
            {message}
          </p>
        ))}
        {hash && <TxHash hash={hash} />}
      </Column>
    </Modal>
  )
}

export default SuccessTx
