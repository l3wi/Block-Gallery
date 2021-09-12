import { ethers } from "ethers"
import React, { useState, useEffect } from "react"
import useAlerts from "../contexts/useAlerts"
import { useWeb3 } from "../contexts/useWeb3"
import { fetchApprovalForAll } from "../utils/ethers"

const currentAllowance = (contract, spender, digits, fixed) => {
  const { web3, account, status } = useWeb3()
  const { alerts } = useAlerts()
  let [allowance, setAllowance] = useState(0)

  useEffect(async () => {
    if (account && status === "connected") {
      setAllowance(await fetchApprovalForAll(account, contract, spender))
    }
  }, [account, status, alerts])

  return allowance
}

export default currentAllowance
