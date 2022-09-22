import React from "react"

import TokenInput from "../../components/TokenInput/TokenInput"
import useSherlock from "../../hooks/useSherlock"
import config from "../../config"
import * as ethers from "ethers"
import useWaitTx from "../../hooks/useWaitTx"
import { TxType } from "../../utils/txModalMessages"
import { useAccount } from "wagmi"
import ConnectGate from "../../components/ConnectGate/ConnectGate"
import AllowanceGate from "../../components/AllowanceGate/AllowanceGate"

export const MainPage: React.FC = () => {
  const { waitForTx } = useWaitTx()
  const { transfer, swapIn, swapOut, balanceOf, decimals } = useSherlock()
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
    <>
      <h1 className="text-6xl text-center mb-4">Spagetti Cash</h1>
      <ConnectGate>
        <div className="flex items-center content-center flex-wrap w-[100%] sm:w-auto max-w-[100%] md:max-w-[800px] flex-col sm:flex-row">
          <div className="m-[1rem_0] p-8 bg-black rounded-[10px] border border-[#eaeaea] min-h-[500px] max-w-full">
            <h2 className="text-2xl font-bold mb-4">Swap In &rarr;</h2>
            <p className="text-[15px] font-[Menlo,_Monaco,_'Lucida_Console',_'Liberation_Mono',_'DejaVu_Sans_Mono',_'Bitstream_Vera_Sans_Mono',_'Courier_New',_monospace]">
              Ensure to backup your note as you will need it for withdrawal
            </p>
            <TokenInput
              decimals={decimals}
              value={swapInAmount}
              setValue={setSwapInAmount}
              token="USD"
              placeholder="Choose amount"
              balance={balance}
            />
            <button
              className="bg-[#add8e6] block border text-black my-[10px] w-full rounded-[7px] h-[50px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
              disabled={swapInAmountNumber <= 0}
              onClick={async (event) => {
                event.preventDefault()
                await waitForTx(
                  async () =>
                    (await swapIn(
                      ethers.BigNumber.from(swapInAmountNumber * 100).mul(ethers.BigNumber.from(10).pow(decimals - 2))
                    )) as ethers.ContractTransaction,
                  {
                    transactionType: TxType.STAKE,
                  }
                )
              }}
            >
              Swap In
            </button>
            <hr />
            <h2 className="text-2xl font-bold my-4">Swap Out &rarr;</h2>
            <p className="text-[15px] font-[Menlo,_Monaco,_'Lucida_Console',_'Liberation_Mono',_'DejaVu_Sans_Mono',_'Bitstream_Vera_Sans_Mono',_'Courier_New',_monospace]">
              Ensure to backup your note as you will need it for withdrawal
            </p>
            <TokenInput
              decimals={decimals}
              value={swapOutAmount}
              setValue={setSwapOutAmount}
              token="USD"
              placeholder="Choose amount"
              balance={balance}
            />
            <button
              className="bg-[#add8e6] block border text-black my-[10px] w-full rounded-[7px] h-[50px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
              disabled={swapOutAmountNumber <= 0}
              onClick={async (event) => {
                event.preventDefault()
                await waitForTx(
                  async () =>
                    (await swapOut(
                      ethers.BigNumber.from(swapOutAmountNumber * 100).mul(ethers.BigNumber.from(10).pow(decimals - 2))
                    )) as ethers.ContractTransaction,
                  {
                    transactionType: TxType.STAKE,
                  }
                )
              }}
            >
              Swap Out
            </button>
            <hr />
            <h2 className="text-2xl font-bold my-4">Transfer &rarr;</h2>
            <p className="text-[15px] font-[Menlo,_Monaco,_'Lucida_Console',_'Liberation_Mono',_'DejaVu_Sans_Mono',_'Bitstream_Vera_Sans_Mono',_'Courier_New',_monospace]">
              Ensure to backup your note as you will need it for withdrawal
            </p>
            <div className="flex my-[20px] text-[16px] items-center">
              <p className="mr-1">Address:</p>
              <input
                value={toAddress}
                placeholder="Input Wallet Address"
                className="h-[50px] text-black p-[0px_10px] rounded-[10px] grow-[1]"
                onChange={(event) => {
                  event.preventDefault()
                  const _val = event.target.value
                  if (new RegExp(/(^0x[a-fA-F0-9]{0,40}$)|(^0x$)|(^0?$)/).test(_val)) setToAddress(_val)
                  else return
                }}
              />
            </div>

            <TokenInput
              decimals={decimals}
              value={tokenAmount}
              setValue={setTokenAmount}
              token="USD"
              placeholder="Choose amount"
              balance={balance}
            />

            <AllowanceGate
              className="bg-[#add8e6] block border text-black my-[10px] w-full rounded-[7px] h-[50px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
              disabled={tokenAmountNumber <= 0 || !new RegExp(/^0x[a-fA-F0-9]{40}$/).test(toAddress)}
              spender={config.silentTokenAddress}
              amount={ethers.BigNumber.from(tokenAmountNumber * 100).mul(ethers.BigNumber.from(10).pow(decimals - 2))}
              onClick={async (event) => {
                event.preventDefault()
                await waitForTx(
                  async () =>
                    (await transfer(
                      toAddress,
                      ethers.BigNumber.from(tokenAmountNumber * 100).mul(ethers.BigNumber.from(10).pow(decimals - 2))
                    )) as ethers.ContractTransaction,
                  {
                    transactionType: TxType.STAKE,
                  }
                )
              }}
            >
              Transfer
            </AllowanceGate>
          </div>
          {/*
        
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
                <Button
                  onClick={async (event) => {
                    event.preventDefault()
                    await waitForTx(
                      async () => (await editFee(ethers.BigNumber.from(10).pow(18))) as ethers.ContractTransaction,
                      {
                        transactionType: TxType.STAKE,
                      }
                    )
                  }}
                >
                  Edit Fee
                </Button>
              </Row>
            </Column>
          </Box>
        </Row>*/}
        </div>
      </ConnectGate>
    </>
  )
}
