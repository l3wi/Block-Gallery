import React from "react"
import { Image, chakra, Icon } from "@chakra-ui/react"
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode"
import { Box, Flex, LinkBox, LinkOverlay } from "@chakra-ui/layout"

import Block from "../Block"

function Heros() {
  return (
    <Box pos="relative" overflow="hidden" mt={16}>
      <Flex
        justifyContent="space-between"
        maxW="7xl"
        mx="auto"
        flexDirection={{ base: "column", lg: "row" }}
      >
        <Box
          pos="relative"
          pb={{ base: 8, sm: 16, md: 20, lg: 28, xl: 32 }}
          maxW={{ lg: "2xl" }}
          w={{ lg: "full" }}
          zIndex={1}
          border="solid 1px transparent"
        >
          <Box
            mx="auto"
            maxW={{ base: "7xl" }}
            px={{ base: 4, sm: 6, lg: 8 }}
            mt={{ base: 6, sm: 8, md: 12, lg: 15, xl: 18 }}
          >
            <Box
              w="full"
              textAlign={{ sm: "center", lg: "left" }}
              justifyContent="center"
              alignItems="center"
            >
              <chakra.h1
                fontSize={{ base: "4xl", sm: "5xl", md: "5xl" }}
                letterSpacing="tight"
                lineHeight="short"
                fontWeight="extrabold"
                color={useColorModeValue("gray.900", "white")}
              >
                <chakra.span display={{ base: "block", xl: "inline" }}>
                  {"The native ArtBlocks "}
                </chakra.span>
                <chakra.span
                  display={{ base: "block", xl: "inline" }}
                  color={useColorModeValue("brand.600", "brand.400")}
                >
                  explorer you deserve
                </chakra.span>
              </chakra.h1>
              <chakra.p
                mt={{ base: 3, sm: 5, md: 5 }}
                fontSize={{ sm: "lg", md: "xl" }}
                maxW={{ sm: "xl" }}
                mx={{ sm: "auto", lg: 0 }}
                color="gray.500"
              >
                {`Block Gallery was built to help you nagivate Art
                Blocks. It brings ranking, filtering and ordering to their often inconsistent
                API. Please note: normalized might be a little quirky.`}
              </chakra.p>
            </Box>
          </Box>
        </Box>

        <Block
          id={138000002}
          dynamic={true}
          ratio={1.77777}
          // info={{ name: "phase #817", artistName: "Loren Bednar" }}
        />
      </Flex>
    </Box>
  )
}
export default Heros
