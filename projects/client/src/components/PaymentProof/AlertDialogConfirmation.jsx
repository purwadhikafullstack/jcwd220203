import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogOverlay, Box, Button, Text } from "@chakra-ui/react"

const AlertDialogConfirmation = ({ confirmIsOpen, confirmOnOpen, confirmOnClose, confirmPayment }) => {

    return (
        <AlertDialog isCentered closeOnOverlayClick={false} isOpen={confirmIsOpen} onOpen={confirmOnOpen} onClose={confirmOnClose} size={"sm"}
            closeOnEsc={false}
        >
            <AlertDialogOverlay
                bg="blackAlpha.700"
            >
                <AlertDialogContent
                    w={'400px'}
                    borderRadius={'30px'}
                    mt={'-50px'}
                >
                    <AlertDialogBody>
                        <Text
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                            fontSize="lg" fontWeight="bold" color={'#31353BAD'} pt={'25px'} textAlign={'center'}
                        >
                            Your payment will be processed, are you sure?
                        </Text>
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'space-evenly'}
                            alignItems={'center'}
                            boxSizing={'border-box'}
                            gap={3}
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                        >
                            <Button
                                borderRadius={'20px'}
                                mt={'16px'}
                                width={'120px'}
                                colorScheme="blue"
                                onClick={confirmPayment}
                                fontSize={'14px'}
                                color={'#fff'}
                                bgColor={'#0095DA'}
                                border={'1px solid #0095DA'}
                                _active={{
                                    bgColor: '#0370A2'
                                }}
                            >
                                OK
                            </Button>
                            <Button
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                borderRadius={'20px'}
                                mt={'16px'}
                                width={'120px'}
                                bgColor={'#fff'}
                                color={'#F7931E'}
                                onClick={() => confirmOnClose()}
                                fontSize={'14px'}
                                border={'1px solid #F7931E'}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </AlertDialogBody>

                    <AlertDialogFooter pb={'5px'}>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}
export default AlertDialogConfirmation