import { Box, Flex, Image, Badge } from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/color-mode"

const Project = ({
  name,
  description,
  artistName,
  invocations,
  dynamic,
  curationStatus,
  tokens
}) => {
  const image = `https://api.artblocks.io/image/${tokens[0].tokenId}`

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
        <Box
          h="280px"
          w="280px"
          roundedTop="lg"
          bg={`url(${image}) no-repeat center center`}
          backgroundSize="cover"
        />
        <Box p="6">
          <Box d="flex" justifyContent="space-between" alignItems="baseline">
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              isTruncated
              maxWidth="120px"
            >
              {artistName}
            </Box>
            <Badge rounded="full" px="2" colorScheme="teal">
              {curationStatus ? curationStatus : "Factory"}
            </Badge>
          </Box>

          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
            maxWidth="230px"
          >
            {name}
          </Box>

          <Box> {invocations} editions</Box>
        </Box>
      </Box>
    </Flex>
  )
}
export default Project
