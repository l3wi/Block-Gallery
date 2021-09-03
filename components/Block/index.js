import React, { useEffect, useState } from "react"
import { Box, chakra, Image, Flex } from "@chakra-ui/react"
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode"

const Block = ({ id, dynamic, info }) => {
  return (
    <>
      {dynamic ? (
        <Flex w="100%" minH="500px" h="fit-content">
          <iframe
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen=""
            scrolling="no"
            sandbox="allow-scripts"
            src={`https://generator.artblocks.io/${id}`}
            width="100%"
            height="100%"
            style={{
              minHeight: 500,
              minWidth: 500,
              overflow: "hidden"
            }}
            frameBorder="0"
          ></iframe>
        </Flex>
      ) : (
        <Image
          w="100%"
          height="100%"
          minH="300px"
          minW="300px"
          fit="cover"
          src={`https://api.artblocks.io/image/${id}`}
        />
      )}
    </>
  )
}
export default Block
