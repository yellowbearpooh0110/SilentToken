/**
 * Types of transactions: ERC20 token approval,
 * fundraise participation, staking, restaking, etc.
 */
export enum TxType {
  GENERIC = "GENERIC",
  APPROVE = "APPROVE",
  SWAPIN = "SWAPIN",
  SWAPOUT = "SWAPOUT",
  TRANSFER = "TRANSFER",
}

/**
 * State of a transaction.
 *
 * NONE: No transaction initiated.
 * REQUESTED: dApp requested a transaction and is waiting for wallet interaction.
 * USER_DENIED: Transaction was rejected from the wallet.
 * PENDING: Transaction was approved from the wallet and is waiting to be mined.
 * SUCCESS: Transaction was mined and confirmed onto the blockchain.
 * REVERTED: Transaction was mined but was not successful.
 */
export enum TxState {
  NONE = "NONE",
  REQUESTED = "REQUESTED",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  REVERTED = "REVERTED",
  USER_DENIED = "USER_DENIED",
}

type ModalMessage = {
  /**
   * Modal title
   */
  title: string

  /**
   * Modal body. Each string will be rendered on a separate line.
   */
  messages: Array<string>
}

/**
 * Modal messages for different transaction types and states.
 *
 * Example: TxTypeMessages.APPROVE.SUCCESS.message
 */
type TxTypeMessages = {
  [key in TxType]: {
    [key in Exclude<TxState, TxState.NONE | TxState.USER_DENIED | TxState.REQUESTED | TxState.REVERTED>]: ModalMessage
  }
}

const TransactionTypeMessages: TxTypeMessages = {
  [TxType.GENERIC]: {
    [TxState.PENDING]: {
      title: "Transaction approved and pending",
      messages: ["Waiting for the transaction to make its way onto the blockchain."],
    },
    [TxState.SUCCESS]: {
      title: "Transaction was successful!",
      messages: ["Success!! The transaction made its way onto the blockchain!"],
    },
  },
  [TxType.APPROVE]: {
    [TxState.PENDING]: {
      title: "Transaction approved and pending",
      messages: ["Waiting for the approval transaction (1/2) to make its way onto the blockchain."],
    },
    [TxState.SUCCESS]: {
      title: "Transaction was successful!",
      messages: [
        "Success!! Approval transaction (1/2) is completed. The next transaction (2/2) is ready to be signed.",
      ],
    },
  },
  [TxType.SWAPIN]: {
    [TxState.PENDING]: {
      title: "Transaction approved and pending",
      messages: ["Waiting for the stake transaction (2/2) to make its way onto the blockchain."],
    },
    [TxState.SUCCESS]: {
      title: "Transaction was successful!",
      messages: ["Success!! Stake transaction (2/2) is completed."],
    },
  },
  [TxType.SWAPOUT]: {
    [TxState.PENDING]: {
      title: "Transaction approved and pending",
      messages: ["Waiting for the stake transaction (2/2) to make its way onto the blockchain."],
    },
    [TxState.SUCCESS]: {
      title: "Transaction was successful!",
      messages: ["Success!! Stake transaction (2/2) is completed."],
    },
  },
  [TxType.TRANSFER]: {
    [TxState.PENDING]: {
      title: "Transaction approved and pending",
      messages: ["Waiting for the stake transaction (2/2) to make its way onto the blockchain."],
    },
    [TxState.SUCCESS]: {
      title: "Transaction was successful!",
      messages: ["Success!! Stake transaction (2/2) is completed."],
    },
  },
}

export default TransactionTypeMessages
