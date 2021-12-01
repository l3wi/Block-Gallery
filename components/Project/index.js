import { Box, Flex, Skeleton, Tag, TagLabel } from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/color-mode"
import PillPity from "pill-pity"
import Image from "next/image"

import { generateTokenId, projectInfo } from "../../utils/rarity"

const Project = ({ id, name, artistName, invocations, curation }) => {
  const image = `https://d2ekshiy7r5vl7.cloudfront.net/${generateTokenId(
    id,
    1
  )}.png`

  return (
    <Flex
      align-self="start"
      w="full"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg={useColorModeValue("white", "gray.800")}
        maxW="sm"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
      >
        {!image ? (
          <PillPity
            pattern={"bathroom-floor"}
            as={Flex}
            boxSize="280px"
            patternFill={"brand.200"}
            bgColor="choc.secondary"
            patternOpacity={0.3}
          />
        ) : (
          <Box
            h="280px"
            w="280px"
            roundedTop="lg"
            bg={`url(${image}) no-repeat center center`}
            backgroundSize="cover"
          />
        )}

        <Box p="6">
          <Box d="flex" justifyContent="space-between" alignItems="baseline">
            <Skeleton isLoaded={id}>
              <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
                isTruncated
                maxWidth="120px"
              >
                #{id}
              </Box>
            </Skeleton>
            <Skeleton isLoaded={curation}>
              <Tag
                size={"md"}
                borderRadius="full"
                variant="subtle"
                colorScheme="cyan"
              >
                <TagLabel>
                  {curation ? curation.toUpperCase() : "Factory"}
                </TagLabel>
              </Tag>
            </Skeleton>
          </Box>

          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
            maxWidth="230px"
          >
            <Skeleton isLoaded={name}>{name} </Skeleton>
          </Box>

          <Box isTruncated maxWidth="160px">
            <Skeleton isLoaded={artistName}>by {artistName} </Skeleton>
          </Box>
        </Box>
      </Box>
    </Flex>
  )
}
export default Project
