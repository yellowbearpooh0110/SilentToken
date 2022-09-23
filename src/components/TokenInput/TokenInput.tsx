import * as React from "react"
import * as ethers from "ethers"
import cx from "classnames"
// import { formatAmount } from "../../utils/format"
import { InputProps } from "../Input/Input"
import { Column, Row } from "../Layout"
import { Text } from "../Text"
import styles from "./TokenInput.module.scss"

type Props = Omit<InputProps, "onChange"> & {
  decimals: number
  balance?: ethers.BigNumber
  setValue: React.Dispatch<React.SetStateAction<string>>
}

const TokenInput: React.FC<Props> = ({ value, balance, decimals, setValue, token, ...props }) => {
  const { disabled } = props

  // const handleSetMax = React.useCallback(() => {
  //   if (balance) setValue(balance.div(ethers.BigNumber.from(10).pow(decimals)).toString())
  // }, [balance, setValue, decimals])

  return (
    <>
      <Row
        alignment={["space-between", "center"]}
        spacing="xl"
        className={cx({ [styles.disabled]: disabled }, "my-[20px]")}
      >
        <Column grow={1}>
          <input
            value={value || ""}
            className="h-[50px] text-black p-[0px_10px] rounded-[10px] grow-[1] no-spin"
            onChange={(event) => {
              event.preventDefault()
              const numberVal = Math.floor(Number(event.target.value) * 100) / 100
              if (!isNaN(numberVal) && numberVal <= 0) setValue("")
              else if (!balance)
                setValue((prev) =>
                  isNaN(numberVal) ? prev : 9999999999 < numberVal ? "9999999999" : numberVal.toString()
                )
              else {
                const maxVal = (balance.div(ethers.BigNumber.from(10).pow(decimals - 2)).toNumber() || 0) / 100
                setValue((prev) =>
                  isNaN(numberVal) ? prev : maxVal < numberVal ? maxVal.toString() : numberVal.toString()
                )
              }
            }}
            type="number"
            {...props}
          />
        </Column>
        <Column grow={0}>
          <Text size="extra-large" strong>
            {token}
          </Text>
        </Column>
      </Row>
      {/* {balance && !disabled && (
        <Row alignment={["end", "center"]} spacing="m">
          <Text className={styles.balance}>Balance: {formatAmount(ethers.utils.formatUnits(balance, decimals))}</Text>
          <button className="bg-[#add8e6] text-black rounded-[7px] p-[3px_10px]" onClick={handleSetMax}>
            MAX
          </button>
        </Row>
      )} */}
    </>
  )
}

export default TokenInput
