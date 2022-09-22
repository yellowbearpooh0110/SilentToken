import React from "react"
import ErrorIcon from "../ErrorIcon/ErrorIcon"
import { Column } from "../Layout"
import Modal from "../Modal/Modal"
import TxHash from "./TxHash"

interface Props {
  /**
   * Transaction hash
   */
  hash?: string
}

const RevertedTx: React.FC<Props> = ({ hash }) => {
  return (
    <Modal closeable>
      <Column spacing="m" alignment="center">
        <ErrorIcon />
        <p className="text-4xl text-center text-white font-bold">Transaction was reverted.</p>
        <p className="text-white text-center">
          For some reason, the transaction did not make it's way on the blockchain.
        </p>
        <p className="text-white text-center">Check the transaction logs for any clues on what happened.</p>
        {hash && <TxHash hash={hash} />}
      </Column>
    </Modal>
  )
}

export default RevertedTx
