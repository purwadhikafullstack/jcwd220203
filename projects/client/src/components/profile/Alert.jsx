import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
} from "@chakra-ui/react"

const Alert = ({
  isOpen,
  cancelRef,
  onClose,
  onSubmit,
  body,
  header,
  rightButton,
  leftButton,
}) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent
          p={"32px 32px 24px"}
          my="auto"
          boxSize={"-moz-fit-content"}
          maxW="400px"
        >
          <AlertDialogHeader
            fontSize={"24px"}
            fontWeight="bold"
            mb="14px"
            p="0"
            textAlign={"center"}
          >
            {header}
          </AlertDialogHeader>
          <AlertDialogBody textAlign={"center"} p="0">
            <Text fontSize={"16px"} m="0px 0px 32px">
              {body}
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter p="0" alignSelf="center">
            <Button
              ref={cancelRef}
              onClick={onClose}
              w="164px"
              h="48px"
              mr={"6px"}
              borderRadius="8px"
              fontWeight={"bold"}
              bgColor="white"
              border="1px solid #F7931E"
              color={" #F7931E"}
              _hover={false}
            >
              {leftButton}
            </Button>
            <Button
              fontWeight={"bold"}
              bgColor="#F7931E"
              color={"white"}
              type="submit"
              onClick={onSubmit}
              w="164px"
              h="48px"
              borderRadius="8px"
              _hover={false}
              textAlign="left"
            >
              <Text
                maxW={"160px"}
                p="0 16px"
                overflow="hidden"
                textOverflow={"ellipsis"}
              >
                {rightButton}
              </Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default Alert
