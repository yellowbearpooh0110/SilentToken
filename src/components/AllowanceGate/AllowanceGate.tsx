import { BigNumber, ethers } from "ethers"
import React from "react"
import useERC20 from "../../hooks/useERC20"
import useWaitTx from "../../hooks/useWaitTx"
import { TxType } from "../../utils/txModalMessages"

interface Props
  extends Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "onClick"> {
  spender: string
  amount?: BigNumber
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>
  onSuccess?: () => void
}

/**
 * HOC for requesting the approval for spending a token
 * before another action
 */
const AllowanceGate: React.FC<Props> = ({ className, spender, amount, disabled, onSuccess, onClick, ...restProps }) => {
  const [allowance, setAllowance] = React.useState<BigNumber>()
  const [isSuccess, setIsSuccess] = React.useState(false)

  const { getAllowance, approve } = useERC20("USD")
  const { waitForTx } = useWaitTx()

  /**
   * Fetch latest allowance
   */
  const handleFetchAllowance = React.useCallback(
    async (invalidateCache: boolean = false) => {
      const latestAllowance = await getAllowance(spender, invalidateCache)
      setAllowance(latestAllowance)
    },
    [spender, getAllowance]
  )

  /**
   * Approve spending
   */
  const handleOnApprove = React.useCallback(async () => {
    if (!amount || !spender) {
      return
    }

    await waitForTx(
      async () =>
        (await approve(spender, BigNumber.from(2).pow(BigNumber.from(256)).sub(1))) as ethers.ContractTransaction,
      {
        transactionType: TxType.APPROVE,
      }
    )

    handleFetchAllowance(true)
  }, [approve, spender, amount, handleFetchAllowance, waitForTx])

  /**
   * Execute action and send success notification
   */
  const handleOnAction = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      await onClick(event)
      setIsSuccess(true)
      onSuccess?.()
      // Refetch allowance since it changed
      handleFetchAllowance(true)
    },
    [onClick, onSuccess, handleFetchAllowance]
  )

  /**
   * Fetch allowance on initialization
   */
  React.useEffect(() => {
    if (!spender || !amount) return
    handleFetchAllowance()
  }, [spender, amount, handleFetchAllowance])

  /**
   * Reset success status on amount change
   */
  React.useEffect(() => {
    setIsSuccess(false)
  }, [amount])

  const hasEnoughAllowance = (amount && allowance && amount.lte(allowance)) ?? false

  return hasEnoughAllowance ? (
    <button
      disabled={!hasEnoughAllowance || isSuccess || disabled}
      className={className}
      onClick={handleOnAction}
      {...restProps}
    />
  ) : (
    <button className={className} onClick={handleOnApprove} disabled={hasEnoughAllowance || disabled}>
      Approve
    </button>
  )
}

export default AllowanceGate
