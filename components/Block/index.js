import React, { useEffect, useState } from "react"
import { Box, chakra, Image, Flex } from "@chakra-ui/react"
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode"
import { useRouter } from "next/router"

const Block = ({ id, dynamic, rank, info = {}, ratio = 1 }) => {
  const router = useRouter()
  const aspect = parseFloat(ratio)
  return (
    <>
      {dynamic ? (
        <Flex w="100%" flexDirection="column" alignItems="center">
          <Flex
            w="400px"
            minH={400 / aspect}
            h="fit-content"
            flexDirection="column"
          >
            <iframe
              allowFullScreen=""
              scrolling="no"
              sandbox="allow-scripts"
              src={`https://generator.artblocks.io/${id}`}
              width="100%"
              height="100%"
              style={{
                minHeight: 400 / aspect,
                minWidth: 400,
                overflow: "hidden"
              }}
              frameBorder="0"
            ></iframe>
            {rank}
          </Flex>
        </Flex>
      ) : (
        <Image
          w="100%"
          height="100%"
          minH={300 / aspect}
          minW="300px"
          fit="cover"
          src={`https://api.artblocks.io/image/${id}`}
        />
      )}
    </>
  )
}
export default Block
