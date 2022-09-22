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

  // Check if any wallet is connected
  if (!accountData.isConnected) {
    return (
      <>
        <button
          className="bg-[#add8e6] hover:bg-[#729eaf] border text-black my-[10px] min-w-[120px] rounded-[7px] h-[50px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
          onClick={handleToggleConnectionModal}
        >
          Connect
        </button>
        {isModalVisible && <WalletProviderModal onClose={handleToggleConnectionModal} />}
      </>
    )
  }

  // Check if correct network is selected
  const isCorrectNetwork = chain?.id === config.networkId
  if (!isCorrectNetwork) {
    return (
      <button
        className="bg-[#add8e6] hover:bg-[#729eaf] border text-black my-[10px] min-w-[120px] rounded-[7px] h-[50px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
        onClick={handleSwitchToCorrectNetwork}
      >
        Switch network
      </button>
    )
  }
  return (
    <button className="bg-[#add8e6] hover:bg-[#729eaf] border text-black my-[10px] min-w-[120px] rounded-[7px] h-[50px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all">
      {shortenAddress(accountData.address)}
    </button>
  )
}

export default ConnectButton
