import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react"

const FormAddress = ({
  isOpen,
  onClose,
  onOpen,
  formik,
  formChangeHandler,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      size={"3xl"}
    >
      <form>
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
            <Text m="24px 0 16px">Add Address</Text>
          </ModalHeader>
          <ModalCloseButton _hover={false} mt="10px" />

          <ModalBody
            overflowY={"scroll"}
            maxH="529px"
            p="24px 40px"
            fontSize={"14px"}
          >
            <Text
              mb={"24px"}
              fontSize={"20px"}
              fontWeight="bold"
              color={"black"}
            >
              Complete the address details
            </Text>
            <Box mt="34px" mb="4px">
              <FormLabel mb="8px">Recipient's Name</FormLabel>
              <FormControl isInvalid={formik.errors.recipients_name}>
                <Input
                  value={formik.values.recipients_name}
                  name="recipients_name"
                  type="text"
                  onChange={formChangeHandler}
                />
                <FormErrorMessage>
                  {formik.errors.recipients_name}
                </FormErrorMessage>
              </FormControl>
            </Box>

            <Box mt="12px">
              <FormLabel mb="8px">Phone Number</FormLabel>
              <FormControl isInvalid={formik.errors.phone_number}>
                <Input
                  value={formik.values.phone_number}
                  name="phone_number"
                  type="number"
                  maxLength={15}
                  minLength={9}
                  onChange={formChangeHandler}
                />
                <FormErrorMessage>
                  {formik.errors.phone_number}
                </FormErrorMessage>
              </FormControl>
            </Box>

            <Box mt="34px" mb="4px">
              <FormLabel mb="8px">Address Labels</FormLabel>
              <FormControl isInvalid={formik.errors.address_labels}>
                <Input
                  value={formik.values.address_labels}
                  name="address_labels"
                  type={"text"}
                  onChange={formChangeHandler}
                />

                <FormErrorMessage>
                  {formik.errors.address_labels}
                </FormErrorMessage>
              </FormControl>
            </Box>

            <Box mt="34px" mb="4px">
              <FormLabel mb={"8px"}>Full Address</FormLabel>
              <FormControl isInvalid={formik.errors.full_address}>
                <Textarea
                  value={formik.values.full_address}
                  name="full_address"
                  size={"md"}
                  resize="none"
                  maxLength={200}
                  p="12px 8px"
                  h={"119px"}
                  onChange={formChangeHandler}
                />

                <FormErrorMessage>
                  {formik.errors.full_address}
                </FormErrorMessage>
              </FormControl>
            </Box>

            <Text m="10px 12px" textAlign={"center"}>
              By clicking "Save", you agree to the
              <Text
                color={"#F7931E"}
                ml="2px"
                display="inline"
                fontWeight="bold"
              >
                Terms & Conditions
              </Text>
            </Text>
            <Box m="16px 0px" textAlign={"center"}>
              <Button
                p="0px 16px"
                fontSize={"16px"}
                color="white"
                fontWeight={"bold"}
                w="80px"
                _hover={false}
                bgColor="#F7931E"
                onClick={onOpen}
              >
                Save
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </form>
    </Modal>
  )
}

export default FormAddress
