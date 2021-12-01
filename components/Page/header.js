import React from "react"
import {
  Image,
  useDisclosure,
  CloseButton,
  Button,
  Link,
  chakra,
  Stack,
  HStack,
  VStack,
  Icon,
  Heading
} from "@chakra-ui/react"
import { IconButton } from "@chakra-ui/button"
import {
  FiSun,
  FiMoon,
  FiHome,
  FiInbox,
  FiCamera,
  FiMenu
} from "react-icons/fi"
import { motion, useViewportScroll } from "framer-motion"
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode"
import { Box, Flex, LinkBox, LinkOverlay } from "@chakra-ui/layout"

import { useRouter } from "next/router"

import { useWeb3 } from "../../contexts/useWeb3"

import UserAddress from "./wallet"

const Header = () => {
  const router = useRouter()
  const mobileNav = useDisclosure()
  const { account, balance } = useWeb3()

  const { toggleColorMode: toggleMode } = useColorMode()
  const text = useColorModeValue("dark", "light")
  const SwitchIcon = useColorModeValue(FiMoon, FiSun)

  const cl = useColorModeValue("gray.800", "white")
  const bg = useColorModeValue("white", "gray.800")
  const ref = React.useRef()
  const [y, setY] = React.useState(0)
  const { height = 0 } = ref.current ? ref.current.getBoundingClientRect() : {}

  const { scrollY } = useViewportScroll()
  React.useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()))
  }, [scrollY])

  const MobileNavContent = (
    <VStack
      pos="absolute"
      top={0}
      left={0}
      right={0}
      display={mobileNav.isOpen ? "flex" : "none"}
      flexDirection="column"
      p={2}
      pb={4}
      m={2}
      bg={bg}
      spacing={3}
      rounded="sm"
      shadow="sm"
      zIndex={10}
    >
      <CloseButton
        aria-label="Close menu"
        justifySelf="self-start"
        onClick={mobileNav.onClose}
      />
      <IconButton
        size="md"
        fontSize="lg"
        aria-label={`Switch to ${text} mode`}
        variant="ghost"
        color="current"
        ml={{ base: "0", md: "3" }}
        mr={2}
        onClick={toggleMode}
        icon={<SwitchIcon />}
      >
        Toggle Theme
      </IconButton>
      <UserAddress />
    </VStack>
  )
  return (
    <Box pos="relative">
      <chakra.header
        ref={ref}
        shadow={y > height ? "sm" : undefined}
        transition="box-shadow 0.2s"
        w="full"
        overflowY="hidden"
      >
        <chakra.div h="4.5rem" mx="auto" maxW="1200px">
          <Flex w="full" h="full" align="center" justify="space-between">
            <Flex>
              <Link onClick={() => router.push("/")}>
                <HStack>
                  <Heading fontSize="xl">Block Gallery</Heading>
                </HStack>
              </Link>
            </Flex>
            <Flex></Flex>
            <Flex
              justify="flex-end"
              w="full"
              maxW="824px"
              align="center"
              color="gray.400"
            >
              <Flex display={{ base: "none", md: "flex" }}>
                <IconButton
                  size="md"
                  fontSize="lg"
                  aria-label={`Switch to ${text} mode`}
                  variant="ghost"
                  color="current"
                  ml={{ base: "0", md: "3" }}
                  mr={2}
                  onClick={toggleMode}
                  icon={<SwitchIcon />}
                />
                <UserAddress />
              </Flex>
              <IconButton
                display={{ base: "flex", md: "none" }}
                aria-label="Open menu"
                fontSize="20px"
                color={useColorModeValue("gray.800", "inherit")}
                variant="ghost"
                icon={<FiMenu />}
                onClick={mobileNav.onOpen}
              />
            </Flex>
          </Flex>
          {MobileNavContent}
        </chakra.div>
      </chakra.header>
    </Box>
  )
}

export default Header
