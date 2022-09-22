import React from "react"
import ErrorIcon from "../ErrorIcon/ErrorIcon"
import { Column } from "../Layout"
import Modal from "../Modal/Modal"

const UserDeniedTx: React.FC = () => {
  return (
    <Modal closeable>
      <Column spacing="m" alignment="center">
        <ErrorIcon />
        <p className="text-4xl text-center text-white font-bold">Transaction denied.</p>
        <p className="text-white text-center">Wallet provider denied the transaction.</p>
      </Column>
    </Modal>
  )
}

export default UserDeniedTx
