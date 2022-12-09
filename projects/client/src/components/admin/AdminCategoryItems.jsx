import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Image, Td, Text, Tr, useDisclosure, useToast } from "@chakra-ui/react"
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
            <Tr >
                <Td>
                    <Text fontWeight={'700'}>
                        {category_name || "null"}
                    </Text>
                </Td>
                <Td>
                    <Image mx={'auto'} src={category_image} width={'80px'} height={'80px'} />
                </Td>
                {/* Edit and Delete Button */}
                <Td>
                    <Button
                        bgColor={"#F8F7F7"}
                        _hover={false}
                        _active={false}
                        color="#F7931E"
                        onClick={editButton}
                        width={'cover'}
                        pr={'1px'}
                        pl={'1px'}
                        isDisabled={authSelector.RoleId !== 3 ? true : false}
                    >
                        <BiEdit fontSize={'25px'} />
                    </Button>
                    <Button
                        _active={false}
                        pr={'1px'}
                        pl={'1px'}
                        width={"cover"}
                        bgColor={"#F8F7F7"}
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
            <AlertDialog isCentered isOpen={isOpen} onClose={onClose} closeOnEsc={false}>
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
