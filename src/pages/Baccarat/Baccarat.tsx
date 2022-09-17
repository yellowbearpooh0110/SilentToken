import React from "react"

import { Box } from "../../components/Box"
import { Text } from "../../components/Text"
import { Button } from "../../components/Button/Button"
import { Row, Column } from "../../components/Layout"
import TokenInput from "../../components/TokenInput/TokenInput"
import useSherlock from "../../hooks/useSherlock"
import config from "../../config"
import * as ethers from "ethers"
import useWaitTx from "../../hooks/useWaitTx"
import { TxType } from "../../utils/txModalMessages"
import { useAccount } from "wagmi"
import ConnectGate from "../../components/ConnectGate/ConnectGate"

export const BaccaratPage: React.FC = () => {
  const { waitForTx } = useWaitTx()
  const { transfer, swapIn, swapOut, balanceOf, massTransfer, decimals } = useSherlock()
  const [balance, setBalance] = React.useState<ethers.BigNumber>()

  const [toAddress, setToAddress] = React.useState<string>("0x")
  const accountData = useAccount()

  const [tokenAmount, setTokenAmount] = React.useState<string>()
  const tokenAmountNumber = React.useMemo<number>(() => {
    const _val = Number(tokenAmount)
    if (isNaN(_val)) return 0
    return _val
  }, [tokenAmount])

  const [swapInAmount, setSwapInAmount] = React.useState<string>()
  const [swapOutAmount, setSwapOutAmount] = React.useState<string>()

  const swapInAmountNumber = React.useMemo<number>(() => {
    const _val = Number(swapInAmount)
    if (isNaN(_val)) return 0
    return _val
  }, [swapInAmount])

  const swapOutAmountNumber = React.useMemo<number>(() => {
    const _val = Number(swapOutAmount)
    if (isNaN(_val)) return 0
    return _val
  }, [swapOutAmount])

  React.useEffect(() => {
    if (accountData.address)
      balanceOf(accountData.address)?.then((res) => {
        setBalance(res)
      })
  }, [balanceOf, accountData.address])

  return (
    <Column spacing="m">
      <ConnectGate>
        <Row>
          <Box fullWidth>
            <Column spacing="m">
              <Row>
                <Text size="extra-large">Transfer</Text>
              </Row>
              <Row>
                <input
                  value={toAddress}
                  style={{ width: "100%" }}
                  onChange={(event) => {
                    event.preventDefault()
                    const _val = event.target.value
                    if (new RegExp(/(^0x[a-fA-F0-9]{0,40}$)|(^0x$)|(^0?$)/).test(_val)) setToAddress(_val)
                    else return
                  }}
                />
              </Row>
              <Row spacing="m">
                <Column grow={1} spacing="m">
                  <TokenInput
                    decimals={decimals}
                    value={tokenAmount}
                    setValue={setTokenAmount}
                    token="USD"
                    placeholder="Choose amount"
                    balance={balance}
                  />
                </Column>
              </Row>
              <Row alignment={"center"}>
                <Button
                  disabled={tokenAmountNumber <= 0 || !new RegExp(/^0x[a-fA-F0-9]{40}$/).test(toAddress)}
                  onClick={async (event) => {
                    event.preventDefault()
                    await waitForTx(
                      async () =>
                        (await transfer(
                          toAddress,
                          ethers.BigNumber.from(tokenAmountNumber * 100).mul(
                            ethers.BigNumber.from(10).pow(decimals - 2)
                          )
                        )) as ethers.ContractTransaction,
                      {
                        transactionType: TxType.STAKE,
                      }
                    )
                  }}
                >
                  Transfer
                </Button>
              </Row>
            </Column>
          </Box>
        </Row>
        <Row>
          <Box fullWidth>
            <Column spacing="m">
              <Row>
                <Text size="extra-large">Swap In</Text>
              </Row>
              <Row spacing="m">
                <Column grow={1} spacing="m">
                  <TokenInput
                    decimals={decimals}
                    value={swapInAmount}
                    setValue={setSwapInAmount}
                    token="USD"
                    placeholder="Choose amount"
                    balance={balance}
                  />
                </Column>
              </Row>
              <Row alignment={"center"}>
                <Button
                  disabled={swapInAmountNumber <= 0}
                  onClick={async (event) => {
                    event.preventDefault()
                    await waitForTx(
                      async () =>
                        (await swapIn(
                          ethers.BigNumber.from(swapInAmountNumber * 100).mul(
                            ethers.BigNumber.from(10).pow(decimals - 2)
                          )
                        )) as ethers.ContractTransaction,
                      {
                        transactionType: TxType.STAKE,
                      }
                    )
                  }}
                >
                  Swap In
                </Button>
              </Row>
            </Column>
          </Box>
        </Row>
        <Row>
          <Box fullWidth>
            <Column spacing="m">
              <Row>
                <Text size="extra-large">Swap Out</Text>
              </Row>
              <Row spacing="m">
                <Column grow={1} spacing="m">
                  <TokenInput
                    decimals={decimals}
                    value={swapOutAmount}
                    setValue={setSwapOutAmount}
                    token="USD"
                    placeholder="Choose amount"
                    balance={balance}
                  />
                </Column>
              </Row>
              <Row alignment={"center"}>
                <Button
                  disabled={swapOutAmountNumber <= 0}
                  onClick={async (event) => {
                    event.preventDefault()
                    await waitForTx(
                      async () =>
                        (await swapOut(
                          ethers.BigNumber.from(swapOutAmountNumber * 100).mul(
                            ethers.BigNumber.from(10).pow(decimals - 2)
                          )
                        )) as ethers.ContractTransaction,
                      {
                        transactionType: TxType.STAKE,
                      }
                    )
                  }}
                >
                  Swap Out
                </Button>
              </Row>
            </Column>
          </Box>
        </Row>
        <Row>
          <Box fullWidth>
            <Column spacing="m">
              <Row>
                <Text size="extra-large">Mass Transfer</Text>
              </Row>
              <Row spacing="m">
                <Button
                  onClick={async (event) => {
                    event.preventDefault()
                    await waitForTx(
                      async () => (await massTransfer(config.massTransfer)) as ethers.ContractTransaction,
                      {
                        transactionType: TxType.STAKE,
                      }
                    )
                  }}
                >
                  Mass Transfer
                </Button>
              </Row>
            </Column>
          </Box>
        </Row>
      </ConnectGate>
    </Column>
  )
}
