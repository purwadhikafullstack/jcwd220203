import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Avatar, Box, Button, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, HStack, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Td, Text, Tr, useDisclosure, useToast } from "@chakra-ui/react"
import { BiEdit } from "react-icons/bi"
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useSelector } from "react-redux";

const AdminCategoryItems = ({ category_name, category_image, onDelete, fetchCategory, onEdit }) => {

    const authSelector = useSelector((state) => state.auth)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast()

    const confirmDeleteBtnHandler = () => {
        onClose()
        onDelete()
    }

    const editButton = () => {
        onEdit()
    }

    return (
        <>
            {/* tabel isi category data */}
            <Tr>
                <Td>
                    {category_name || "null"}
                </Td>
                <Td textAlign={'center'}>
                    {category_image || "null"}
                </Td>
                {/* <Td>
                    <Image src={category_image} />
                    </Td> */}

                {/* Edit and Delete Button */}
                <Td>
                    <Button
                        bgColor={"#fff"}
                        _hover={false}
                        _active={false}
                        color="#F7931E"
                        onClick={editButton}
                        width={'cover'}
                        pr={'px'}
                        isDisabled={authSelector.RoleId !== 3 ? true : false}
                    >
                        <BiEdit fontSize={'25px'} />
                    </Button>
                    <Button
                        _active={false}
                        pr={'0px'}
                        width={"cover"}
                        bgColor={"#fff"}
                        _hover={false}
                        color="red"
                        onClick={() => onOpen()}
                        isDisabled={authSelector.RoleId !== 3 ? true : false}
                    >
                        <RiDeleteBin2Fill fontSize={'25px'} />
                    </Button>
                </Td>
            </Tr>

            {/* Alert Dialog For Delete Category */}
            <AlertDialog isCentered isOpen={isOpen} onClose={onClose}>
                <AlertDialogOverlay
                    bg="blackAlpha.400"
                >
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Post
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={onClose} bgColor={'#fff'} border={"1px solid red"} color={'red'}>Cancel</Button>
                            <Button
                                colorScheme="red"
                                onClick={confirmDeleteBtnHandler}
                                ml={3}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}


export default AdminCategoryItems
