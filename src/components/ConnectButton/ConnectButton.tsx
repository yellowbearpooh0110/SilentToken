import React, { PropsWithChildren } from "react"
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi"
import config from "../../config"
import { shortenAddress } from "../../utils/format"
import { setUser } from "../../utils/sentry"
import WalletProviderModal from "../WalletProviderModal/WalletProviderModal"

/**
 * Wallet connection component.
 *
 * It allows changing to the correct network and connecting
 * a wallet via WalletConnect or MetaMask.
 */
const ConnectButton: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const { switchNetwork } = useSwitchNetwork()
  const accountData = useAccount()
  const { chain } = useNetwork()

  /**
   * Set Sentry User
   */
  React.useEffect(() => {
    setUser(accountData.address ? { username: accountData.address } : null)
  }, [accountData.address])

  /**
   * Triggers a network switch to the correct network
   */
  const handleSwitchToCorrectNetwork = React.useCallback(() => {
    switchNetwork?.(config.networkId)
  }, [switchNetwork])

  /**
   * Toggles the connection modal visibility
   */
  const handleToggleConnectionModal = React.useCallback(() => {
    setIsModalVisible(!isModalVisible)
  }, [isModalVisible])

  // Check if correct network is selected
  const isCorrectNetwork = chain?.id === config.networkId
  return (
    <button
      className="bg-[#1976d2] hover:bg-[#1565c0] shadow-[rgb(0_0_0_/_20%)_0px_3px_1px_-2px,_rgb(0_0_0_/_14%)_0px_2px_2px_0px,_rgb(0_0_0_/_12%)_0px_1px_5px_0px] hover:shadow-[rgb(0_0_0_/_20%)_0px_2px_4px_-1px,_rgb(0_0_0_/_14%)_0px_4px_5px_0px,_rgb(0_0_0_/_12%)_0px_1px_10px_0px] text-white px-[10px] min-w-[120px] rounded-[4px] h-[40px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all font-semibold"
      onClick={
        accountData.isConnected
          ? isCorrectNetwork
            ? undefined
            : handleSwitchToCorrectNetwork
          : handleToggleConnectionModal
      }
    >
      {accountData.isConnected
        ? isCorrectNetwork
          ? shortenAddress(accountData.address)
          : "Switch network"
        : "Connect"}
      {!accountData.isConnected && isModalVisible && <WalletProviderModal onClose={handleToggleConnectionModal} />}
    </button>
  )
}

export default ConnectButton
