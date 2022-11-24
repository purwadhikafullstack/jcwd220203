import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Text,
    useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { axiosInstance } from "../api"
import * as Yup from 'yup'
import React, { useState } from "react"
import { attach } from "../redux/features/resetSlice"

const RequestResetPassword = () => {

    const [emailMatch, setEmailMatch] = useState(false)

    const dispatch = useDispatch()

    const toast = useToast()

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        onSubmit: async ({ email }) => {
            try {
                const response = await axiosInstance.post("/auth/request-reset-password", {
                    email,
                })

                localStorage.setItem("reset_token", response.data.token)

                dispatch(
                    attach({
                        email: response.data.data.email,
                        is_verify: response.data.data.is_verify
                    })
                )

                setEmailMatch(false)

                toast({
                    title: "Request Sent",
                    description: response.data.message,
                    status: "success",
                })
                formik.setFieldValue("email", "")
            } catch (error) {
                console.log(error.response)

                setEmailMatch(true)

                toast({
                    title: "Registration Failed",
                    description: error.response.data.message,
                    status: "error",
                })
            }
        },
        validationSchema: Yup.object({
            email: Yup.string().required().email("invalid email"),
        }),
        validateOnChange: false,
    })

    const formChangeHandler = ({ target }) => {
        const { name, value } = target;
        formik.setFieldValue(name, value)
    }

    return (
        <Box >
            <Link to="/">
                <Box pt={'12px'} mt={"-10px"}>
                    <Button bgColor={'white'} fontSize={'35px'} _hover={"none"} pb={'5px'} >
                        ←
                    </Button>
                </Box>
            </Link>
            {/* reset password box */}
            <Box display={'flex'} fontSize="14px" justifyContent={'center'} mt={'50px'}>
                <Box
                    w="500px"
                    boxShadow={"0 0 10px 3px rgb(0 0 0 / 10%)"}
                    // border="1px solid var(--N75,#0095DA)"
                    borderRadius={"10px"}
                    p="24px 40px 32px "
                    textAlign={"center"}
                    bgColor={'white'}
                >
                    <Text fontSize="22px" fontWeight={"bold"} textAlign={'left'} color={'#0095DA'}
                        fontFamily="Open Sauce One',sans-serif"
                    >
                        Reset Password
                    </Text>
                    <Box mt="8px" fontSize={"14px"} textAlign="left" color={'#9d9db7'}>
                        <Text display={"inline"} mr="1" color={'#31353b'}>
                            Enter your registered e-mail or phone number. We will send you a verification code to reset password.
                        </Text>
                    </Box>

                    {/* reset password form */}
                    <form onSubmit={formik.handleSubmit}>
                        <Box m="20px 0 8px">
                            <FormControl isInvalid={formik.errors.email}>
                                <InputGroup>
                                    <Input
                                        value={formik.values.email}
                                        name="email"
                                        onChange={formChangeHandler}
                                        // border={"1px solid #e2e8f0"}
                                        focusBorderColor='#F7931E'
                                        placeholder={'Email'}
                                        variant='flushed'
                                    />
                                    <InputRightElement width={'4.5rem'}>
                                        <Button
                                            mt={'-2px'}
                                            ml={'19px'}
                                            size={'md'}
                                            bg={'white'}

                                            color={'#F37121'}
                                        >
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                {emailMatch ? (
                                    <FormHelperText color={"red"} fontSize={'12px'} textAlign={'left'}>
                                        Email not registered
                                    </FormHelperText>
                                ) : null}
                            </FormControl>
                        </Box>
                        <Button
                            display={"flex"}
                            w="100%"
                            bgColor={"#0095DA"}
                            _hover={false}
                            m="16px 0"
                            color={"white"}
                            isDisabled={!formik.values.email}
                            type={'submit'}
                        >
                            <Text fontWeight={"bold"}>Next</Text>
                        </Button>
                    </form>
                </Box>
            </Box>
        </Box >
    )
}

export default RequestResetPassword