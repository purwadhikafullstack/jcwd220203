import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"

const ProtectedRoute = ({ children }) => {

    const authSelector = useSelector((state) => state.auth)

    const location = useLocation()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const backToLogin = () => {
        onClose()
    }

    const openAlert = () => {
        onOpen()
    }

    useEffect(() => {
        if (!authSelector.id) {
            openAlert()
        }
    }, [])

    if (authSelector.id) {
        return (children)
    } else if (!authSelector.id)
        return (
            <>
                <AlertDialog isCentered closeOnOverlayClick={false} isOpen={isOpen} onClose={backToLogin} size={"sm"}
                    onKeyPress={(e) => console.log(e.nativeEvent.key)}
                >
                    <AlertDialogOverlay
                        bg="blackAlpha.400"
                        backdropFilter='blur(50px) hue-rotate(90deg)'
                    >
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold" color={'#F7931E'}>
                                Notification!
                            </AlertDialogHeader>

                            <AlertDialogBody >
                                You must log in first before do any transaction
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Link to={"/login"} replace state={{ from: location }}>
                                    <Button
                                        colorScheme="blue"
                                        onClick={backToLogin}
                                    >
                                        OK
                                    </Button>
                                </Link>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </>
        )
}

export default ProtectedRoute