import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"

const AddressModal = ({ header, isOpen, onClose, color, val }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      size={"3xl"}
    >
      <ModalOverlay />
      <ModalContent mt={"90px"} borderRadius="8px" overflow={false}>
        <ModalHeader
          fontSize={"24px"}
          fontWeight="bold"
          textAlign={"center"}
          borderBottom="1px solid #dfe1e3"
          p="0"
          h="36px"
        >
          <Text m="24px 0 16px">{header}</Text>
        </ModalHeader>
        <ModalCloseButton _hover={false} mt="10px" />

        <ModalBody
          overflowY={"scroll"}
          maxH="529px"
          p="24px 40px"
          fontSize={"14px"}
        >
          <Text mb={"24px"} fontSize={"20px"} fontWeight="bold" color={"black"}>
            The address details
          </Text>
          <Box mt="34px" mb="4px">
            <Text>{val === null ? <Text>The address is null</Text> : val}</Text>
          </Box>
          <Box m="16px 0px" textAlign={"center"}>
            <Button
              p="0px 16px"
              fontSize={"16px"}
              color="white"
              fontWeight={"bold"}
              w="80px"
              _hover={false}
              bgColor={color}
              onClick={onClose}
            >
              Ok
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AddressModal
