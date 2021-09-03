import React, { useContext } from 'react'
import { Text, Button, Box, Flex, useDisclosure } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'

import { useWeb3 } from '../../contexts/useWeb3'
import ConnectModal from './modal'

export default function UserAddress() {
  const { web3, account, balance, status, disconnectWallet, connectWallet } =
    useWeb3()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const options = [
    {
      id: 'injected',
      name: 'Metamask',
      subtitle: 'Browser extension',
      image: '/metamask.svg',
    },
    {
      id: 'walletconnect',
      name: 'Wallet Connect',
      subtitle: 'Mobile wallet',
      image: '/wallet-connect.svg',
    },
  ]

  const connectToWallet = (item) => {
    connectWallet(item.id)
  }

  if (!account) {
    return (
      <>
        <Button
          onClick={onOpen}
          boxShadow="0px 4px 8px rgba(44, 29, 106, 0.1), 0px 1px 2px rgba(22, 0, 115, 0.2), inset 0px 0px 8px 2px #8FFF00;"
          borderRadius="lg"
          fontFamily="Syne"
          bg="linear-gradient(180deg, #D4EF00 6.77%, rgba(182, 211, 1, 0) 100%), #55DF00;"
          transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
          _hover={{
            bg: 'linear-gradient(180deg, #D4EF00 6.77%, rgba(182, 211, 1, 0) 100%), #D4EF00;',
          }}
          _focus={{
            outline: 'none',
          }}
          _active={{
            bg: '#D4EF00;',
          }}
        >
          <Text fontSize="sm" mr={2}>
            Connect Wallet
          </Text>
        </Button>
        <ConnectModal
          isOpen={isOpen}
          onClose={onClose}
          title="Connect your wallet"
          options={options}
          func={connectToWallet}
          type="image"
        />
      </>
    )
  } else {
    return (
      <>
        <Flex
          onClick={() => disconnectWallet()}
          boxShadow="0px 4px 8px rgba(44, 29, 106, 0.1)"
          borderRadius="16px"
          fontFamily="Syne"
          fontWeight="700"
          fontSize="14px"
          bg="#CDE4B8"
          _focus={{
            outline: 'none',
          }}
          h="32px"
          p={0}
        >
          <Flex alignItems="center" p={3} pr={1}>
            <Text fontSize="13px" mr={2}>{`${balance.toFixed(2)} ETH`}</Text>
          </Flex>
          <Flex
            alignItems="center"
            bg="white"
            borderRadius="16px"
            h="100%"
            pl="4"
            pr="2"
          >
            <Box>
              <Text fontSize="10px" color="gray.500" fontWeight="400" mb="-5px">
                Metamask
              </Text>
              <Text fontSize="13px" mr={3}>
                {account.substring(0, 6) +
                  '...' +
                  account.substring(account.length - 4)}
              </Text>
            </Box>
            <Flex
              h="24px"
              w="24px"
              bg="#CDE4B8"
              alignItems="center"
              justifyContent="center"
              borderRadius="16px"
            >
              <ChevronDownIcon boxSize={6} />
            </Flex>
          </Flex>
        </Flex>
      </>
    )
  }
}
