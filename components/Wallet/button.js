import React from 'react'
import { Box, Flex, Text, Heading, Button, Image } from '@chakra-ui/react'

const ModalBttn = ({ item, id, name, subtitle, image, localImg, func }) => {
  return (
    <Button
      fontFamily="Syne"
      p={3}
      mb={3}
      variant="unstyled"
      bg="#F1F1F1"
      width="100%"
      h="auto"
      onClick={() => func(item)}
    >
      <Flex justifyContent="space-between">
        <Flex flexDirection="column" justifyContent="center" textAlign="left">
          <Text fontWeight="800">{name}</Text>
          <Text fontWeight="700" color="black" opacity="0.5">
            {id}
          </Text>
        </Flex>
        <Box
          h="64px"
          w="64px"
          borderRadius="8px"
          bg={`url(${image}) no-repeat center center`}
          backgroundSize="cover"
        />
      </Flex>
    </Button>
  )
}

export default ModalBttn
