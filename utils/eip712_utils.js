import * as ethUtil from "ethereumjs-util"
import { BigNumber, ethers, utils } from "ethers"
import * as _ from "lodash"
import { hexUtils } from "./hex_utils"

function keccak256(arg) {
  const hexStr = ethers.utils.keccak256(arg)
  return Buffer.from(hexStr.slice(2, hexStr.length), "hex")
}

function abiRawEncode(encTypes, encValues) {
  const hexStr = ethers.utils.defaultAbiCoder.encode(encTypes, encValues)
  return Buffer.from(hexStr.slice(2, hexStr.length), "hex")
}
// Recursively finds all the dependencies of a type
function dependencies(primaryType, found = [], types = {}) {
  if (found.includes(primaryType)) {
    return found
  }
  if (types[primaryType] === undefined) {
    return found
  }
  found.push(primaryType)
  for (let field of types[primaryType]) {
    for (let dep of dependencies(field.type, found)) {
      if (!found.includes(dep)) {
        found.push(dep)
      }
    }
  }
  return found
}

function encodeType(primaryType, types = {}) {
  // Get dependencies primary first, then alphabetical
  let deps = dependencies(primaryType)
  deps = deps.filter((t) => t != primaryType)
  deps = [primaryType].concat(deps.sort())

  // Format as a string with fields
  let result = ""
  for (let type of deps) {
    if (!types[type])
      throw new Error(
        `Type '${type}' not defined in types (${JSON.stringify(types)})`
      )
    result += `${type}(${types[type]
      .map(({ name, type }) => `${type} ${name}`)
      .join(",")})`
  }
  return result
}

function typeHash(primaryType, types = {}) {
  return keccak256(Buffer.from(encodeType(primaryType, types)))
}
function encodeData(primaryType, data, types = {}) {
  let encTypes = []
  let encValues = []

  // Add typehash
  encTypes.push("bytes32")
  encValues.push(typeHash(primaryType, types))

  // Add field contents
  for (let field of types[primaryType]) {
    let value = data[field.name]
    if (field.type == "string" || field.type == "bytes") {
      encTypes.push("bytes32")
      value = keccak256(Buffer.from(value))
      encValues.push(value)
    } else if (types[field.type] !== undefined) {
      encTypes.push("bytes32")
      value = keccak256(encodeData(field.type, value, types))
      encValues.push(value)
    } else if (field.type.lastIndexOf("]") === field.type.length - 1) {
      throw "TODO: Arrays currently unimplemented in encodeData"
    } else {
      encTypes.push(field.type)
      encValues.push(value)
    }
  }
  console.log("example: ", hexUtils.toHex(encValues[0]))
  return abiRawEncode(encTypes, encValues)
}

function structHash(primaryType, data, types = {}) {
  return keccak256(encodeData(primaryType, data, types))
}

export const domainSeparator = (domain) => {
  const types = {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
      { name: "salt", type: "bytes32" }
    ].filter((a) => domain[a.name])
  }
  return keccak256(encodeData("EIP712Domain", domain, types))
}

export const digestToSign = (domain, primaryType, message, types = {}) => {
  return keccak256(
    Buffer.concat([
      Buffer.from("1901", "hex"),
      domainSeparator(domain),
      structHash(primaryType, message, types)
    ])
  )
}

export const signTypedDataUtils = {
  /**
   * Generates the EIP712 Typed Data hash for signing
   * @param   typedData An object that conforms to the EIP712TypedData interface
   * @return  A Buffer containing the hash of the typed data.
   */
  generateTypedDataHash(typedData) {
    return ethUtil.keccak256(
      Buffer.concat([
        Buffer.from("1901", "hex"),
        signTypedDataUtils._structHash(
          "EIP712Domain",
          typedData.domain,
          typedData.types
        ),
        signTypedDataUtils._structHash(
          typedData.primaryType,
          typedData.message,
          typedData.types
        )
      ])
    )
  },
  /**
   * Generates the EIP712 Typed Data hash for a typed data object without using the domain field. This
   * makes hashing easier for non-EIP712 data.
   * @param   typedData An object that conforms to the EIP712TypedData interface
   * @return  A Buffer containing the hash of the typed data.
   */
  generateTypedDataHashWithoutDomain(typedData) {
    return signTypedDataUtils._structHash(
      typedData.primaryType,
      typedData.message,
      typedData.types
    )
  },
  /**
   * Generates the hash of a EIP712 Domain with the default schema
   * @param  domain An EIP712 domain with the default schema containing a name, version, chain id,
   *                and verifying address.
   * @return A buffer that contains the hash of the domain.
   */
  generateDomainHash(domain) {
    return signTypedDataUtils._structHash(
      "EIP712Domain",
      domain,
      // HACK(jalextowle): When we consolidate our testing packages into test-utils, we can use a constant
      // to eliminate code duplication. At the moment, there isn't a good way to do that because of cyclic-dependencies.
      {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" }
        ]
      }
    )
  },
  _findDependencies(primaryType, types, found = []) {
    if (found.includes(primaryType) || types[primaryType] === undefined) {
      return found
    }
    found.push(primaryType)
    for (const field of types[primaryType]) {
      for (const dep of signTypedDataUtils._findDependencies(
        field.type,
        types,
        found
      )) {
        if (!found.includes(dep)) {
          found.push(dep)
        }
      }
    }
    return found
  },
  _encodeType(primaryType, types) {
    let deps = signTypedDataUtils._findDependencies(primaryType, types)
    deps = deps.filter((d) => d !== primaryType)
    deps = [primaryType].concat(deps.sort())
    let result = ""
    for (const dep of deps) {
      result += `${dep}(${types[dep]
        .map(({ name, type }) => `${type} ${name}`)
        .join(",")})`
    }
    return result
  },
  _encodeData(primaryType, data, types) {
    const encodedTypes = ["bytes"]
    const encodedValues = [signTypedDataUtils._typeHash(primaryType, types)]
    for (const field of types[primaryType]) {
      const value = data[field.name]
      if (field.type === "string" || field.type === "bytes") {
        const hashValue = ethUtil.keccak256(Buffer.from(value))
        encodedTypes.push("bytes")
        encodedValues.push(hashValue)
      } else if (types[field.type] !== undefined) {
        encodedTypes.push("bytes")
        const hashValue = ethUtil.keccak256(
          // tslint:disable-next-line:no-unnecessary-type-assertion
          ethUtil.toBuffer(
            signTypedDataUtils._encodeData(field.type, value, types)
          )
        )
        encodedValues.push(hashValue)
      } else if (field.type.lastIndexOf("]") === field.type.length - 1) {
        throw new Error("Arrays currently unimplemented in encodeData")
      } else {
        encodedTypes.push(field.type)
        const normalizedValue = signTypedDataUtils._normalizeValue(
          field.type,
          value
        )
        encodedValues.push(normalizedValue)
      }
    }
    return ethers.utils.defaultAbiCoder.encode(encodedTypes, encodedValues)
  },
  _normalizeValue(type, value) {
    if (type === "uint256") {
      if (BigNumber.isBigNumber(value)) {
        return value.toString()
      }
      return BigNumber.from(value).toString()
    }
    return value
  },
  _typeHash(primaryType, types) {
    return ethUtil.keccak256(
      Buffer.from(signTypedDataUtils._encodeType(primaryType, types))
    )
  },
  _structHash(primaryType, data, types) {
    return ethUtil.keccak256(
      ethUtil.toBuffer(signTypedDataUtils._encodeData(primaryType, data, types))
    )
  }
}
