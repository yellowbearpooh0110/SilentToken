import React from "react"
import { Column } from "../Layout"
import Loading from "../Loading/Loading"
import Modal from "../Modal/Modal"

const RequestedTx: React.FC = () => {
  return (
    <Modal>
      <Column spacing="m" alignment="center">
        <Loading variant="Scan" label="Transaction requested" />
        <p className="text-white text-center">Check your wallet in order to approve the transaction.</p>
      </Column>
    </Modal>
  )
}

export default RequestedTx
