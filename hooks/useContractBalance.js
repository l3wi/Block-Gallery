import { ethers } from "ethers"
import React, { useState, useEffect } from "react"
import useAlerts from "../contexts/useAlerts"
import { useWeb3 } from "../contexts/useWeb3"
import { fetchBalance } from "../utils/ethers"

const currentBalance = (contract, digits, fixed) => {
  const { web3, account, status } = useWeb3()
  const { alerts } = useAlerts()
  let [balance, setBalance] = useState(0)

  useEffect(async () => {
    if (account && status === "connected" && web3) {
      setBalance(await fetchBalance(contract, account, digits, fixed))
    }
  }, [account, status, alerts])

  return balance
}

export default currentBalance
