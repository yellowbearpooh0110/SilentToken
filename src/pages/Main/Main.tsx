import React from "react"

import TokenInput from "../../components/TokenInput/TokenInput"
import useSherlock from "../../hooks/useSherlock"
import config from "../../config"
import * as ethers from "ethers"
import useWaitTx from "../../hooks/useWaitTx"
import { TxType } from "../../utils/txModalMessages"
import { useAccount } from "wagmi"
import useERC20 from "../../hooks/useERC20"

export const MainPage: React.FC = () => {
  const { waitForTx } = useWaitTx()
  const { transfer, swapIn, swapOut, balanceOf, decimals } = useSherlock()
  const [balance, setBalance] = React.useState<ethers.BigNumber>()

  const [toAddress, setToAddress] = React.useState<string>("0x")
  const accountData = useAccount()

  const [tokenAmount, setTokenAmount] = React.useState<string>("100")
  const tokenAmountNumber = React.useMemo<number>(() => {
    const _val = Number(tokenAmount)
    if (isNaN(_val)) return 0
    return _val
  }, [tokenAmount])

  const [swapInAmount, setSwapInAmount] = React.useState<string>("100")
  const [swapOutAmount, setSwapOutAmount] = React.useState<string>("100")

  const { getAllowance, approve } = useERC20("WFTM")

  const [allowance, setAllowance] = React.useState<ethers.BigNumber>(ethers.BigNumber.from(0))
  const [refreshFlag, setRefreshFlag] = React.useState<boolean>(false)

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
    if (accountData.address) {
      balanceOf(accountData.address)?.then((res) => {
        setBalance(res)
      })
      getAllowance(config.silentTokenAddress).then((res) => {
        if (res) setAllowance(res)
      })
    }
  }, [balanceOf, getAllowance, accountData.address, refreshFlag])

  return (
    <>
      <h1 className="text-6xl text-center mb-8 font-Kaisar-Black">Spagetti Cash</h1>
      <h2 className="text-2xl text-center mb-8">
        A non-custodial privacy solution based on{" "}
        <span className="bg-white text-blue-400 px-3 py-2 rounded-lg font-bold">Fantom</span>
      </h2>
      <div className="flex items-center content-center flex-wrap w-[100%] sm:w-auto max-w-[100%] md:max-w-[800px] flex-col sm:flex-row">
        <div className="m-[1rem_0] p-8 bg-black rounded-[10px] border border-[#eaeaea] min-h-[500px] max-w-full mx-auto">
          <h2 className="text-2xl font-bold mb-4">Swap In &rarr;</h2>
          <p className="text-[15px] font-[Menlo,_Monaco,_'Lucida_Console',_'Liberation_Mono',_'DejaVu_Sans_Mono',_'Bitstream_Vera_Sans_Mono',_'Courier_New',_monospace]">
            Make sure to remember the amount you swapped
          </p>
          <TokenInput
            decimals={decimals}
            value={swapInAmount}
            setValue={setSwapInAmount}
            token="WFTM"
            placeholder="Choose amount"
            balance={balance}
            readOnly={true}
          />
          <div className="flex justify-between">
            <div className="flex items-center">
              <label className="mr-4">100</label>
              <input
                type="radio"
                checked={swapInAmount === "100"}
                onChange={(event) => {
                  setSwapInAmount("100")
                }}
              />
            </div>
            <div className="flex items-center">
              <label className="mr-4">1000</label>
              <input
                type="radio"
                checked={swapInAmount === "1000"}
                onChange={(event) => {
                  setSwapInAmount("1000")
                }}
              />
            </div>
            <div className="flex items-center">
              <label className="mr-4">10000</label>
              <input
                type="radio"
                checked={swapInAmount === "10000"}
                onChange={(event) => {
                  setSwapInAmount("10000")
                }}
              />
            </div>
          </div>
          <button
            className="bg-[#1976d2] hover:bg-[#1565c0] shadow-[rgb(0_0_0_/_20%)_0px_3px_1px_-2px,_rgb(0_0_0_/_14%)_0px_2px_2px_0px,_rgb(0_0_0_/_12%)_0px_1px_5px_0px] hover:shadow-[rgb(0_0_0_/_20%)_0px_2px_4px_-1px,_rgb(0_0_0_/_14%)_0px_4px_5px_0px,_rgb(0_0_0_/_12%)_0px_1px_10px_0px] text-white px-[10px] font-bold min-w-[120px] block my-[10px] w-full rounded-[7px] h-[50px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
            disabled={swapInAmountNumber <= 0 || !accountData.isConnected}
            onClick={async (event) => {
              event.preventDefault()
              if (
                allowance.gt(
                  ethers.BigNumber.from(swapInAmountNumber * 100).mul(ethers.BigNumber.from(10).pow(decimals - 2))
                )
              )
                await waitForTx(
                  async () =>
                    (await swapIn(
                      ethers.BigNumber.from(swapInAmountNumber * 100).mul(ethers.BigNumber.from(10).pow(decimals - 2))
                    )) as ethers.ContractTransaction,
                  {
                    transactionType: TxType.STAKE,
                  }
                )
              else
                await waitForTx(
                  async () =>
                    (await approve(
                      config.silentTokenAddress,
                      ethers.BigNumber.from(2).pow(ethers.BigNumber.from(256)).sub(1)
                    )) as ethers.ContractTransaction,
                  {
                    transactionType: TxType.STAKE,
                  }
                )
              setRefreshFlag((_prev) => !_prev)
            }}
          >
            {allowance.gt(
              ethers.BigNumber.from(swapInAmountNumber * 100).mul(ethers.BigNumber.from(10).pow(decimals - 2))
            )
              ? "Swap In"
              : "Approve"}
          </button>
          <hr />
          <h2 className="text-2xl font-bold my-4">Swap Out &rarr;</h2>
          <p className="text-[15px] font-[Menlo,_Monaco,_'Lucida_Console',_'Liberation_Mono',_'DejaVu_Sans_Mono',_'Bitstream_Vera_Sans_Mono',_'Courier_New',_monospace]">
            Make sure to remember the amount you swapped
          </p>
          <TokenInput
            decimals={decimals}
            value={swapOutAmount}
            setValue={setSwapOutAmount}
            token="WFTM"
            placeholder="Choose amount"
            balance={balance}
            readOnly
          />
          <div className="flex justify-between">
            <div className="flex items-center">
              <label className="mr-4">100</label>
              <input
                type="radio"
                checked={swapOutAmount === "100"}
                onChange={(event) => {
                  setSwapOutAmount("100")
                }}
              />
            </div>
            <div className="flex items-center">
              <label className="mr-4">1000</label>
              <input
                type="radio"
                checked={swapOutAmount === "1000"}
                onChange={(event) => {
                  setSwapOutAmount("1000")
                }}
              />
            </div>
            <div className="flex items-center">
              <label className="mr-4">10000</label>
              <input
                type="radio"
                checked={swapOutAmount === "10000"}
                onChange={(event) => {
                  setSwapOutAmount("10000")
                }}
              />
            </div>
          </div>
          <button
            className="bg-[#1976d2] hover:bg-[#1565c0] shadow-[rgb(0_0_0_/_20%)_0px_3px_1px_-2px,_rgb(0_0_0_/_14%)_0px_2px_2px_0px,_rgb(0_0_0_/_12%)_0px_1px_5px_0px] hover:shadow-[rgb(0_0_0_/_20%)_0px_2px_4px_-1px,_rgb(0_0_0_/_14%)_0px_4px_5px_0px,_rgb(0_0_0_/_12%)_0px_1px_10px_0px] text-white px-[10px] font-bold min-w-[120px] block my-[10px] w-full rounded-[7px] h-[50px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
            disabled={swapOutAmountNumber <= 0 || !accountData.isConnected}
            onClick={async (event) => {
              event.preventDefault()
              if (
                allowance.gt(
                  ethers.BigNumber.from(swapOutAmountNumber * 100).mul(ethers.BigNumber.from(10).pow(decimals - 2))
                )
              )
                await waitForTx(
                  async () =>
                    (await swapOut(
                      ethers.BigNumber.from(swapOutAmountNumber * 100).mul(ethers.BigNumber.from(10).pow(decimals - 2))
                    )) as ethers.ContractTransaction,
                  {
                    transactionType: TxType.STAKE,
                  }
                )
              else
                await waitForTx(
                  async () =>
                    (await approve(
                      config.silentTokenAddress,
                      ethers.BigNumber.from(2).pow(ethers.BigNumber.from(256)).sub(1)
                    )) as ethers.ContractTransaction,
                  {
                    transactionType: TxType.STAKE,
                  }
                )
              setRefreshFlag((_prev) => !_prev)
            }}
          >
            {allowance.gt(
              ethers.BigNumber.from(swapOutAmountNumber * 100).mul(ethers.BigNumber.from(10).pow(decimals - 2))
            )
              ? "Swap Out"
              : "Approve"}
          </button>
          <hr />
          <h2 className="text-2xl font-bold my-4">Transfer &rarr;</h2>
          <p className="text-[15px] font-[Menlo,_Monaco,_'Lucida_Console',_'Liberation_Mono',_'DejaVu_Sans_Mono',_'Bitstream_Vera_Sans_Mono',_'Courier_New',_monospace]">
            Make sure to remember the amount you transferred
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
            token="WFTM"
            placeholder="Choose amount"
            balance={balance}
            readOnly
          />
          <div className="flex justify-between">
            <div className="flex items-center">
              <label className="mr-4">100</label>
              <input
                type="radio"
                checked={tokenAmount === "100"}
                onChange={(event) => {
                  setTokenAmount("100")
                }}
              />
            </div>
            <div className="flex items-center">
              <label className="mr-4">1000</label>
              <input
                type="radio"
                checked={tokenAmount === "1000"}
                onChange={(event) => {
                  setTokenAmount("1000")
                }}
              />
            </div>
            <div className="flex items-center">
              <label className="mr-4">10000</label>
              <input
                type="radio"
                checked={tokenAmount === "10000"}
                onChange={(event) => {
                  setTokenAmount("10000")
                }}
              />
            </div>
          </div>
          <button
            className="bg-[#1976d2] hover:bg-[#1565c0] shadow-[rgb(0_0_0_/_20%)_0px_3px_1px_-2px,_rgb(0_0_0_/_14%)_0px_2px_2px_0px,_rgb(0_0_0_/_12%)_0px_1px_5px_0px] hover:shadow-[rgb(0_0_0_/_20%)_0px_2px_4px_-1px,_rgb(0_0_0_/_14%)_0px_4px_5px_0px,_rgb(0_0_0_/_12%)_0px_1px_10px_0px] text-white px-[10px] font-bold min-w-[120px] block my-[10px] w-full rounded-[7px] h-[50px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
            disabled={
              tokenAmountNumber <= 0 || !new RegExp(/^0x[a-fA-F0-9]{40}$/).test(toAddress) || !accountData.isConnected
            }
            onClick={async (event) => {
              event.preventDefault()
              if (
                allowance.gt(
                  ethers.BigNumber.from(tokenAmountNumber * 100).mul(ethers.BigNumber.from(10).pow(decimals - 2))
                )
              )
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
              else
                await waitForTx(
                  async () =>
                    (await approve(
                      config.silentTokenAddress,
                      ethers.BigNumber.from(2).pow(ethers.BigNumber.from(256)).sub(1)
                    )) as ethers.ContractTransaction,
                  {
                    transactionType: TxType.STAKE,
                  }
                )
              setRefreshFlag((_prev) => !_prev)
            }}
          >
            {allowance.gt(
              ethers.BigNumber.from(tokenAmountNumber * 100).mul(ethers.BigNumber.from(10).pow(decimals - 2))
            )
              ? "Transfer"
              : "Approve"}
          </button>
          {/* <hr />
          <h2 className="text-2xl font-bold my-4">Mass Transfer &rarr;</h2>
          <p className="text-[15px] font-[Menlo,_Monaco,_'Lucida_Console',_'Liberation_Mono',_'DejaVu_Sans_Mono',_'Bitstream_Vera_Sans_Mono',_'Courier_New',_monospace]">
            Make sure to remember the amount you swapped
          </p>
          <button
            className="bg-[#1976d2] hover:bg-[#1565c0] shadow-[rgb(0_0_0_/_20%)_0px_3px_1px_-2px,_rgb(0_0_0_/_14%)_0px_2px_2px_0px,_rgb(0_0_0_/_12%)_0px_1px_5px_0px] hover:shadow-[rgb(0_0_0_/_20%)_0px_2px_4px_-1px,_rgb(0_0_0_/_14%)_0px_4px_5px_0px,_rgb(0_0_0_/_12%)_0px_1px_10px_0px] text-white px-[10px] font-bold min-w-[120px] block my-[10px] w-full rounded-[7px] h-[50px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
            disabled={!accountData.isConnected}
            onClick={async (event) => {
              event.preventDefault()
              await waitForTx(async () => (await massTransfer(config.massTransfer)) as ethers.ContractTransaction, {
                transactionType: TxType.STAKE,
              })
            }}
          >
            Mass Transfer
          </button>
          <hr />
          <h2 className="text-2xl font-bold my-4">Edit Fee &rarr;</h2>
          <p className="text-[15px] font-[Menlo,_Monaco,_'Lucida_Console',_'Liberation_Mono',_'DejaVu_Sans_Mono',_'Bitstream_Vera_Sans_Mono',_'Courier_New',_monospace]">
            Make sure to remember the amount you swapped
          </p>
          <button
            className="bg-[#1976d2] hover:bg-[#1565c0] shadow-[rgb(0_0_0_/_20%)_0px_3px_1px_-2px,_rgb(0_0_0_/_14%)_0px_2px_2px_0px,_rgb(0_0_0_/_12%)_0px_1px_5px_0px] hover:shadow-[rgb(0_0_0_/_20%)_0px_2px_4px_-1px,_rgb(0_0_0_/_14%)_0px_4px_5px_0px,_rgb(0_0_0_/_12%)_0px_1px_10px_0px] text-white px-[10px] font-bold min-w-[120px] block my-[10px] w-full rounded-[7px] h-[50px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
            disabled={!accountData.isConnected}
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
            Mass Transfer
          </button> */}
        </div>
      </div>
    </>
  )
}
