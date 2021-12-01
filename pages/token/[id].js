import React, { useEffect, useState } from 'react'
import fetch from 'isomorphic-fetch'
import { useRouter } from 'next/router'

import {
  Grid,
  Box,
  chakra,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  Button
} from '@chakra-ui/react'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'

import { useWeb3 } from '../../contexts/useWeb3'
import { useAlerts } from '../../contexts/useAlerts'

import Head from 'next/head'
import Page from '../../components/Page'
import Block from '../../components/Block'

import useContractAllowance from '../../hooks/useContractAllowance'
import useLocalStorage from '../../hooks/useLocalStorage'
import useNFTAllowance from '../../hooks/useNFTAllowance'
import { setApproval, setApprovalForAll } from '../../utils/ethers'
import { ownerOf, signOrder, fillOrder, getGasPrice } from '../../utils/market'
import { WETH, ART_BLOCKS, ZERO_EX } from '../../contracts'
import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses'

export default function Token({ token }) {
  const [orderInfo, setOrderInfo] = useLocalStorage('order', {})
  const [tokenOwner, setTokenOwner] = useState()
  const { account, status } = useWeb3()
  const { addAlert, watchTx } = useAlerts()

  const wethAllowance = useContractAllowance(
    WETH.address,
    getContractAddressesForChainOrThrow(1).erc20Proxy
  )
  const abAllowance = useNFTAllowance(
    ART_BLOCKS.address,
    getContractAddressesForChainOrThrow(1).erc721Proxy
  )

  const approveToken = async () => {
    const tx = await setApprovalForAll(
      ART_BLOCKS.address,
      getContractAddressesForChainOrThrow(1).erc721Proxy
    )
    watchTx(tx.hash, 'Approving Art Blocks')
  }
  const approveWETH = async () => {
    const tx = await setApproval(
      WETH.address,
      getContractAddressesForChainOrThrow(1).erc20Proxy
    )
    watchTx(tx.hash, 'Approving WETH')
  }

  const sellToken = async () => {
    const tx = await signOrder('sell', token.tokenID, account, '0.5', 10)
    setOrderInfo(tx)
    addAlert('success', 'Signed order')
  }
  const buyToken = async () => {
    const tx = await fillOrder(
      orderInfo.order,
      orderInfo.signature,
      orderInfo.signerAddress
    )
    watchTx(tx.hash, 'Filling Order')
  }

  useEffect(async () => {
    if (account) {
      const owner = await ownerOf(token.tokenID)
      console.log('Owner: ', owner)
      setTokenOwner(owner)
    }
  }, [])
  console.log('Token', token)
  return (
    <Page>
      <Head>
        <title>
          {token.name} by {token.artist}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box pos="relative" overflow="hidden" mt={16}>
        <Flex
          justifyContent="space-between"
          maxW="7xl"
          mx="auto"
          flexDirection={{ base: 'column-reverse', lg: 'row' }}
        >
          <Box
            pos="relative"
            pb={{ base: 8, sm: 16, md: 20, lg: 28, xl: 32 }}
            maxW={{ lg: '2xl' }}
            w={{ lg: 'full' }}
            zIndex={1}
            border="solid 1px transparent"
          >
            <Box
              mx="auto"
              maxW={{ base: '7xl' }}
              px={{ base: 4, sm: 6, lg: 8 }}
              mt={{ base: 6, sm: 8, md: 12, lg: 15, xl: 18 }}
            >
              <Box
                w="full"
                textAlign={{ sm: 'center', lg: 'left' }}
                justifyContent="center"
                alignItems="center"
              >
                <chakra.h1
                  fontSize={{ base: '4xl', sm: '5xl', md: '6xl' }}
                  letterSpacing="tight"
                  lineHeight="short"
                  fontWeight="extrabold"
                  color={useColorModeValue('gray.900', 'white')}
                >
                  <chakra.span display={{ base: 'block', xl: 'inline' }}>
                    {`${token.name}`}
                  </chakra.span>
                </chakra.h1>
                <chakra.h3
                  fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
                  letterSpacing="tight"
                  lineHeight="short"
                  fontWeight="extrabold"
                  color={useColorModeValue('gray.500', 'white')}
                >
                  {`by ${token.artist}`}
                </chakra.h3>
                {/* <chakra.p
                  mt={{ base: 3, sm: 5, md: 5 }}
                  fontSize={{ sm: "md", md: "lg" }}
                  maxW={{ sm: "xl" }}
                  mx={{ sm: "auto", lg: 0 }}
                  color="gray.500"
                >
                  {project.description}
                </chakra.p> */}
              </Box>
              <Box mt={6}>
                <Flex>
                  {tokenOwner && (
                    <Stat>
                      <StatLabel>{`Owned by`}</StatLabel>
                      <StatNumber>
                        {tokenOwner === account
                          ? 'You'
                          : tokenOwner.slice(0, 5) +
                            '...' +
                            tokenOwner.slice(
                              tokenOwner.length - 5,
                              tokenOwner.length
                            )}
                      </StatNumber>
                    </Stat>
                  )}
                  <Stat>
                    <StatLabel></StatLabel>
                    <StatNumber>
                      {abAllowance ? (
                        <Button onClick={() => sellToken()}>List NFT</Button>
                      ) : (
                        <Button
                          isDisabled={abAllowance}
                          onClick={() => approveToken()}
                        >
                          Approve ABExchange
                        </Button>
                      )}
                      {wethAllowance > 0 ? (
                        <Button onClick={() => buyToken()}>
                          Make an offer
                        </Button>
                      ) : (
                        <Button
                          isDisabled={wethAllowance > 0}
                          onClick={() => approveWETH()}
                        >
                          Approve WETH
                        </Button>
                      )}
                    </StatNumber>
                  </Stat>
                </Flex>
              </Box>
              <Box mt={6}>
                <chakra.h3
                  fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
                  letterSpacing="tight"
                  lineHeight="short"
                  fontWeight="extrabold"
                  color={useColorModeValue('gray.900', 'white')}
                >
                  Properties
                </chakra.h3>
                <Grid
                  mt={4}
                  templateColumns="repeat(auto-fill, 150px)"
                  gap={5}
                  w="full"
                  textAlign={{ sm: 'center', lg: 'left' }}
                  justifyContent="flex-start"
                >
                  {token.traits
                    .map((trait) => trait.value)
                    .map((feature, i) => {
                      let attribute = false
                      let trait = feature
                      if (feature.indexOf(':') > 0) {
                        attribute = feature.split(':')[0]
                        trait = feature.split(':')[1]
                        if (typeof trait == 'boolean') {
                          trait = trait ? 'Yes' : 'No'
                        }
                      }

                      return (
                        <Stat key={i}>
                          <StatLabel>
                            {attribute
                              ? attribute.capitalizeFirstLetter()
                              : 'Trait'}
                          </StatLabel>
                          <StatNumber>
                            {attribute
                              ? trait.capitalizeFirstLetter()
                              : feature}
                          </StatNumber>
                        </Stat>
                      )
                    })}
                </Grid>
              </Box>
            </Box>
          </Box>

          <Block id={token.tokenID} dynamic={true} />
        </Flex>
      </Box>
    </Page>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.params
  const token = await fetch('https://api.artblocks.io/token/' + id).then(
    (res) => res.json()
  )
  return {
    props: { token } // will be passed to the page component as props
  }
}
