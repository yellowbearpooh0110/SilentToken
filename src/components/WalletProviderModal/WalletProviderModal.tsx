import React from "react"
import { useAccount, useConnect } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import Modal from "../Modal/Modal"
import styles from "./WalletProviderModal.module.scss"
import { ReactComponent as Metamask } from "../../assets/icons/metamask.svg"
import { ReactComponent as WalletConnect } from "../../assets/icons/walletconnect.svg"
import { Title } from "../Title"
import { Text } from "../Text"
import { Column, Row } from "../Layout"

interface Props {
  onClose: () => void
}

/**
 * Modal that allows selecting one of the supported
 * wallet providers, in order to connect to the web application.
 */
const WalletProviderModal: React.FC<Props> = ({ onClose }) => {
  const { isConnected } = useAccount()
  const { connect: metamaskConnect } = useConnect({ connector: new InjectedConnector() })
  // const { connect: walletConnect } = useConnect({
  //   connector: new WalletConnectConnector({
  //     chains,
  //     options: {
  //       qrcode: true,
  //     },
  //   }),
  // })

  /**
   * Connects via given connector
   */
  const handleConnectWithConnector = React.useCallback(
    (e: React.SyntheticEvent, connectorId: string) => {
      e.stopPropagation()
      switch (connectorId) {
        case "injected":
          metamaskConnect()
          break
        case "walletConnect":
          metamaskConnect()
          break
        default:
          break
      }
    },
    [metamaskConnect]
  )

  React.useEffect(() => {
    if (isConnected) {
      onClose()
    }
  }, [isConnected, onClose])

  return (
    <Modal closeable onClose={onClose}>
      <Column>
        <Row>
          <Column
            alignment="center"
            grow={1}
            className={styles.provider}
            onClick={(e) => handleConnectWithConnector(e, "injected")}
          >
            <Metamask height={45} width={45} />
            <Title>MetaMask</Title>
            <Text>Connect to your MetaMask wallet</Text>
          </Column>
        </Row>
        <Row>
          <Column grow={1}>
            <hr className={styles.divider} />
          </Column>
        </Row>
        <Row>
          <Column
            alignment="center"
            grow={1}
            className={styles.provider}
            onClick={(e) => handleConnectWithConnector(e, "walletConnect")}
          >
            <WalletConnect height={45} width={45} />
            <Title>WalletConnect</Title>
            <Text>Scan with WalletConnect to connect</Text>
          </Column>
        </Row>
      </Column>
    </Modal>
  )
}

export default WalletProviderModal
