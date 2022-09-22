import React from "react"
import TransactionTypeMessages, { TxType } from "../../utils/txModalMessages"
import { Column } from "../Layout"
import Loading from "../Loading/Loading"
import Modal from "../Modal/Modal"
import TxHash from "./TxHash"

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

const PendingTx: React.FC<Props> = ({ type, hash }) => {
  return (
    <Modal>
      <Column spacing="m" alignment="center">
        <Loading variant="Layer" label={TransactionTypeMessages[type].PENDING.title} />
        {TransactionTypeMessages[type].PENDING.messages.map((message, index) => (
          <p key={index} className="text-white text-center">
            {message}
          </p>
        ))}
        {hash && <TxHash hash={hash} />}
      </Column>
    </Modal>
  )
}

export default PendingTx
