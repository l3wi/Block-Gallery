import { SignatureType } from "@0x/types"
import * as ethUtil from "ethereumjs-util"
import * as _ from "lodash"
import { hexUtils } from "./hex_utils"
export const signatureUtils = {
  async signHash(web3, msgHash, signerAddress) {
    // Generate the order hash and sign it
    const normalizedSignerAddress = signerAddress.toLowerCase()
    const signer = web3.getSigner()
    const signature = await web3.send("eth_sign", [
      msgHash,
      normalizedSignerAddress
    ])

    // Add the Personal message prefix so the validator works
    const prefixedMsgHashHex = signatureUtils.addSignedMessagePrefix(msgHash)

    const validVParamValues = [27, 28]
    const ecSignatureRSV = parseSignatureHexAsRSV(signature)
    if (_.includes(validVParamValues, ecSignatureRSV.v)) {
      const isValidRSVSignature = isValidECSignature(
        prefixedMsgHashHex,
        ecSignatureRSV,
        normalizedSignerAddress
      )
      if (isValidRSVSignature) {
        const convertedSignatureHex =
          signatureUtils.convertECSignatureToSignatureHex(ecSignatureRSV)
        return convertedSignatureHex
      }
    }
    const ecSignatureVRS = parseSignatureHexAsVRS(signature)
    if (_.includes(validVParamValues, ecSignatureVRS.v)) {
      const isValidVRSSignature = isValidECSignature(
        prefixedMsgHashHex,
        ecSignatureVRS,
        normalizedSignerAddress
      )
      if (isValidVRSSignature) {
        const convertedSignatureHex =
          signatureUtils.convertECSignatureToSignatureHex(ecSignatureVRS)
        return convertedSignatureHex
      }
    }
  },
  /**
   * Combines ECSignature with V,R,S and the EthSign signature type for use in 0x protocol
   * @param ecSignature The ECSignature of the signed data
   * @return Hex encoded string of signature (v,r,s) with Signature Type
   */
  convertECSignatureToSignatureHex(ecSignature) {
    console.log(SignatureType.EthSign)
    const signatureHex = hexUtils.concat(
      ecSignature.v,
      ecSignature.r,
      ecSignature.s
    )
    const signatureWithType = signatureUtils.convertToSignatureWithType(
      signatureHex,
      SignatureType.EthSign
    )
    return signatureWithType
  },
  /**
   * Combines the signature proof and the Signature Type.
   * @param signature The hex encoded signature proof
   * @param signatureType The signature type, i.e EthSign, Wallet etc.
   * @return Hex encoded string of signature proof with Signature Type
   */
  convertToSignatureWithType(signature, signatureType) {
    const signatureBuffer = Buffer.concat([
      ethUtil.toBuffer(signature),
      ethUtil.toBuffer(signatureType)
    ])
    const signatureHex = `0x${signatureBuffer.toString("hex")}`
    return signatureHex
  },
  /**
   * Adds the relevant prefix to the message being signed.
   * @param message Message to sign
   * @return Prefixed message
   */
  addSignedMessagePrefix(message) {
    const msgBuff = ethUtil.toBuffer(message)
    const prefixedMsgBuff = ethUtil.hashPersonalMessage(msgBuff)
    const prefixedMsgHex = ethUtil.bufferToHex(prefixedMsgBuff)
    return prefixedMsgHex
  },
  /**
   * Parse a hex-encoded Validator signature into validator address and signature components
   * @param signature A hex encoded Validator 0x Protocol signature
   * @return A ValidatorSignature with validatorAddress and signature parameters
   */
  parseValidatorSignature(signature) {
    // tslint:disable:custom-no-magic-numbers
    const validatorSignature = {
      validatorAddress: `0x${signature.slice(-42, -2)}`,
      signature: signature.slice(0, -42)
    }
    // tslint:enable:custom-no-magic-numbers
    return validatorSignature
  }
}

/**
 * Parses a signature hex string, which is assumed to be in the VRS format.
 */
export function parseSignatureHexAsVRS(signatureHex) {
  const signatureBuffer = ethUtil.toBuffer(signatureHex)
  let v = signatureBuffer[0]
  // HACK: Sometimes v is returned as [0, 1] and sometimes as [27, 28]
  // If it is returned as [0, 1], add 27 to both so it becomes [27, 28]
  const lowestValidV = 27
  const isProperlyFormattedV = v >= lowestValidV
  if (!isProperlyFormattedV) {
    v += lowestValidV
  }
  // signatureBuffer contains vrs
  const vEndIndex = 1
  const rsIndex = 33
  const r = signatureBuffer.slice(vEndIndex, rsIndex)
  const sEndIndex = 65
  const s = signatureBuffer.slice(rsIndex, sEndIndex)
  const ecSignature = {
    v,
    r: ethUtil.bufferToHex(r),
    s: ethUtil.bufferToHex(s)
  }
  return ecSignature
}

function parseSignatureHexAsRSV(signatureHex) {
  const { v, r, s } = ethUtil.fromRpcSig(signatureHex)
  const ecSignature = {
    v,
    r: ethUtil.bufferToHex(r),
    s: ethUtil.bufferToHex(s)
  }
  return ecSignature
}

/**
 * Checks if the supplied elliptic curve signature corresponds to signing `data` with
 * the private key corresponding to `signerAddress`
 * @param   data          The hex encoded data signed by the supplied signature.
 * @param   signature     An object containing the elliptic curve signature parameters.
 * @param   signerAddress The hex encoded address that signed the data, producing the supplied signature.
 * @return Whether the ECSignature is valid.
 */
export function isValidECSignature(data, signature, signerAddress) {
  const normalizedSignerAddress = signerAddress.toLowerCase()

  const msgHashBuff = ethUtil.toBuffer(data)
  try {
    const pubKey = ethUtil.ecrecover(
      msgHashBuff,
      signature.v,
      ethUtil.toBuffer(signature.r),
      ethUtil.toBuffer(signature.s)
    )
    const retrievedAddress = ethUtil.bufferToHex(ethUtil.pubToAddress(pubKey))
    const normalizedRetrievedAddress = retrievedAddress.toLowerCase()
    return normalizedRetrievedAddress === normalizedSignerAddress
  } catch (err) {
    return false
  }
}
