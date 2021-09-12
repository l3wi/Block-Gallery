import { ART_BLOCKS, ZERO_EX_V2, WETH } from "../contracts"
import { constants } from "./constants"

import { hexUtils } from "./hex_utils"
import { signTypedDataUtils } from "./eip712_utils"
import { signatureUtils } from "./signature_utils"
import fetch from "isomorphic-fetch"
import { BigNumber, ethers } from "ethers"
import { web3 } from "../utils/ethers"
import { add, getUnixTime } from "date-fns"

export const getGasPrice = async (speed) => {
  const url = "https://www.gasnow.org/api/v3/gas/price?utm_source=:ABEXCHANGE"
  const response = await fetch(url).then((res) => res.json())
  return response.data.standard
}

const encodeERC721data = (address, tokenId) => {
  return ethers.utils.hexConcat([
    "0x02571792",
    ethers.utils.defaultAbiCoder.encode(
      ["address", "uint256"],
      [address, tokenId]
    )
  ])
}
const encodeERC20data = (address) => {
  return ethers.utils.hexConcat([
    "0xf47261b0",
    ethers.utils.defaultAbiCoder.encode(["address"], [address])
  ])
}

export const ownerOf = async (id) => {
  const erc721 = new ethers.Contract(ART_BLOCKS.address, ART_BLOCKS.abi, web3)
  const owner = await erc721.ownerOf(id)
  return owner
}

export const signOrder = async (type, tokenId, account, amount, days) => {
  if (!type) throw "Order type undefined"
  // Sort out salt and timing
  const now = getUnixTime(new Date())
  const expiration = getUnixTime(add(new Date(), { days }))

  // the amount the maker is selling of maker asset (1 ERC721 Token)
  const abAmount = BigNumber.from(1)
  /////////////
  // the amount the maker wants of taker asset
  const wethAmount = ethers.utils.parseUnits(amount, 18)
  const feeAssetAmount = ethers.utils
    .parseUnits(amount, 18)
    .div(BigNumber.from(100.0))

  ///////////
  // 0x v2 uses hex encoded asset data strings to encode all the information needed to identify an asset

  let wethData = encodeERC20data(WETH.address)
  let abData = encodeERC721data(ART_BLOCKS.address, BigNumber.from(tokenId))

  ////////////
  // // Create the order
  const order = {
    makerAddress: type === "sell" ? account : constants.NULL_ADDRESS, // User creating the order
    takerAddress: type === "sell" ? constants.NULL_ADDRESS : account, // Taker null allows anyone to buy it
    makerAssetData: type === "sell" ? abData : wethData,
    takerAssetData: type === "sell" ? wethData : abData,
    makerAssetAmount: type === "sell" ? abAmount : wethAmount,
    takerAssetAmount: type === "sell" ? wethAmount : abAmount,
    feeRecipientAddress: constants.NULL_ADDRESS,
    senderAddress: constants.NULL_ADDRESS,
    makerFee: "0", // Fee paid by seller to the Exchange
    takerFee: "0",
    expirationTimeSeconds: expiration.toString(),
    salt: now.toString()
    // makerFeeAssetData: constants.NULL_BYTES,
    // takerFeeAssetData: constants.NULL_BYTES // IF V2 LEAVE EMPTY
  }

  const signer = web3.getSigner()
  const exchange = new ethers.Contract(
    ZERO_EX_V2.address,
    ZERO_EX_V2.abi,
    signer
  )
  const status = await exchange.getOrderInfo(order)
  const signature = await signatureUtils.signHash(
    web3,
    status.orderHash,
    account
  )
  return { order, signature, signerAddress: account }
}

export const fillOrder = async (order, signature, signerAddress) => {
  const gasPrice = BigNumber.from(await getGasPrice())

  const signer = web3.getSigner()
  const exchange = new ethers.Contract(
    ZERO_EX_V2.address,
    ZERO_EX_V2.abi,
    signer
  )
  const status = await exchange.getOrderInfo(order)
  console.log("Order status: ", status.orderStatus)
  if (status.orderStatus != 3) throw "Order unfillable"

  const valid = await exchange.isValidSignature(
    status.orderHash,
    signerAddress,
    signature
  )
  console.log("Signature Valid: ", valid)
  const estimatedGas = await exchange.estimateGas.fillOrder(
    order,
    order.takerAssetAmount,
    signature
  )
  const bumpedGas = Math.floor(estimatedGas.toNumber() * 1.3)

  const fillOrder = await exchange.fillOrder(
    order,
    order.takerAssetAmount,
    signature,
    { gasLimit: bumpedGas, gasPrice }
  )
  return fillOrder
}

const getOrderhash = (order) => {
  return hexUtils.toHex(
    signTypedDataUtils.generateTypedDataHash(createOrderTypedData(order))
  )
}

const createOrderTypedData = (order) => {
  const typedData = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "verifyingContract", type: "address" }
      ],
      Order: [
        { name: "makerAddress", type: "address" },
        { name: "takerAddress", type: "address" },
        { name: "feeRecipientAddress", type: "address" },
        { name: "senderAddress", type: "address" },
        { name: "makerAssetAmount", type: "uint256" },
        { name: "takerAssetAmount", type: "uint256" },
        { name: "makerFee", type: "uint256" },
        { name: "takerFee", type: "uint256" },
        { name: "expirationTimeSeconds", type: "uint256" },
        { name: "salt", type: "uint256" },
        { name: "makerAssetData", type: "bytes" },
        { name: "takerAssetData", type: "bytes" },
        { name: "makerFeeAssetData", type: "bytes" },
        { name: "takerFeeAssetData", type: "bytes" }
      ]
    },
    domain: {
      name: "0x Protocol",
      version: "2",
      verifyingContract: ZERO_EX_V2.address
    },
    message: order,
    primaryType: "Order"
  }

  return typedData
}
