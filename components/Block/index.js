import React, { useCallback, useState } from "react"
import { Box, chakra, Flex } from "@chakra-ui/react"
import { useRouter } from "next/router"
import Image from "next/image"
const Block = ({ id, dynamic, rank, invocations, info = {}, ratio = 1 }) => {
  const router = useRouter()
  const aspect = parseFloat(ratio)

  const [height, setHeight] = useState(null)
  const [width, setWidth] = useState(null)
  const div = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height)
      setWidth(node.getBoundingClientRect().width)
    }
  }, [])

  return (
    <Box w="100%" h="fit-content" ref={div}>
      {dynamic ? (
        <Flex w="100%" flexDirection="column" alignItems="center">
          <Flex
            w={width ? width : "400px"}
            minH={width ? width / aspect : 400 / aspect}
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
                minHeight: width ? width / aspect : 400 / aspect,
                minWidth: width ? width : "400px",
                overflow: "hidden"
              }}
              frameBorder="0"
            ></iframe>
          </Flex>
        </Flex>
      ) : (
        <Flex flexDirection="column">
          <Image
            height={Math.floor(280 / aspect) + "px"}
            width={"280px"}
            alt={"ArtBlock # " + id}
            fit="cover"
            src={`https://d2ekshiy7r5vl7.cloudfront.net/${id}.png`}
          />

          {info && (
            <Flex justifyContent="space-between">
              <Box>{`ID: #${id}`}</Box>

              {rank && <Box>{`Rarity: #${rank}`}</Box>}
            </Flex>
          )}
        </Flex>
      )}
    </Box>
  )
}
export default Block
