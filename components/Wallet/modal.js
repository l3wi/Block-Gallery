import React from 'react'
import Head from 'next/head'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Flex,
  Text,
  Heading,
  Image,
} from '@chakra-ui/react'
import ImageButton from './button'

const Popup = ({ isOpen, onClose, title, type, highBids, options, func }) => {
  return (
    <Modal size={'lg'} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="rgba(241, 244, 242, 0.8)" filter="blur(16px)" />
      <ModalContent>
        <ModalHeader fontFamily="Syne">{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody px={3}>
          {options.map((item, i) => (
            <ImageButton
              key={item.name + i}
              item={item}
              {...item}
              func={func}
            />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default Popup
