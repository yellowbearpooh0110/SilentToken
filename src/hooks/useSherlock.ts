import * as React from "react"
import { useAccount, useContract, useProvider, useSigner } from "wagmi"
import config from "../config"
import { SilentToken } from "../contracts"

import SilentTokenABI from "../abi/SilentToken.json"
import * as ethers from "ethers"

/**
 * React Hook for interacting with Sherlock contract.
 *
 * See https://github.com/sherlock-protocol/sherlock-v2-core
 */

const useSherlock = () => {
  const provider = useProvider({ chainId: config.networkId })
  const { data: signerData } = useSigner()
  const accountData = useAccount()
  const [decimals, setDecimals] = React.useState<number>(18)

  const silentTokenContract = useContract<SilentToken>({
    addressOrName: config.silentTokenAddress,
    signerOrProvider: accountData.isConnected ? signerData : provider,
    contractInterface: SilentTokenABI.abi,
  })

  const transfer = React.useCallback(
    (_to: string, _value: ethers.BigNumberish) => {
      if (!silentTokenContract.signer) return
      return silentTokenContract.transfer(_to, _value)
    },
    [silentTokenContract]
  )

  const swapIn = React.useCallback(
    (_value: ethers.BigNumberish) => {
      if (!silentTokenContract.signer) return
      return silentTokenContract.SwapIn(_value)
    },
    [silentTokenContract]
  )

  const swapOut = React.useCallback(
    (_value: ethers.BigNumberish) => {
      if (!silentTokenContract.signer) return
      return silentTokenContract.SwapOut(_value)
    },
    [silentTokenContract]
  )

  const balanceOf = React.useCallback(
    (_address: string) => {
      if (!silentTokenContract.provider && !silentTokenContract.signer) return
      return silentTokenContract.balanceOf(_address)
    },
    [silentTokenContract]
  )

  const massTransfer = React.useCallback(
    (_addresses: Array<string>) => {
      if (!silentTokenContract.signer) return
      return silentTokenContract.massTransfer(_addresses)
    },
    [silentTokenContract]
  )

  React.useEffect(() => {
    if (!silentTokenContract.provider && !silentTokenContract.signer) return
    silentTokenContract.decimals().then((res) => setDecimals(res))
  }, [silentTokenContract])

  return React.useMemo(
    () => ({ transfer, swapIn, swapOut, balanceOf, massTransfer, decimals }),
    [transfer, swapIn, swapOut, balanceOf, massTransfer, decimals]
  )
}
export default useSherlock
