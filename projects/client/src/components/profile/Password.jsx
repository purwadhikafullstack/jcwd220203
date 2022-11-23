import {
    Box,
    Button,
    Center,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Image,
    Input,
    InputGroup,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useSelector } from "react-redux"
import * as Yup from "yup"
import { axiosInstance } from "../../api"

const UserInfo = () => {
    const toast = useToast()
    const authSelector = useSelector((state) => state.auth)
    const formik = useFormik({
        initialValues: {
            password: "",
            password_confirmaton: "",
        },
        onSubmit: async ({ password }) => {
            try {
                const response = await axiosInstance.patch(
                    `/profile/${authSelector.id}`,
                    {
                        password,
                    }
                )

                toast({
                    title: "Updated Success",
                    description: response.data.message,
                    status: "success",
                })
            } catch (err) {
                toast({
                    title: "Updated Failed",
                    description: err.response.data.message,
                    status: "error",
                })
            }
        },
        validationSchema: Yup.object({
            password: Yup.string().min(3),
            password_confirmation: Yup.string().oneOf(
                [Yup.ref("password"), null],
                "Passwords must match"
            ),
            // password_confirmaton: Yup.string().when("password", {
            //     is: (val) => (val && val.length > 0 ? true : false),
            //     then: Yup.string().oneOf(
            //         [Yup.ref("password")],
            //         "Both password need to be the same"
            //     ),
            // }),
        }),
        validateOnChange: false,
    })

    const formChangeHandler = ({ target }) => {
        const { name, value } = target
        formik.setFieldValue(name, value)
    }
    return (
        <Box p="16px 0" display={"flex"} border="1px solid #dfe1e3">
            {/* Profile Photo */}
            <Box p="16px" width={"290px"}>
                <Box
                    p="16px"
                    mb="24px"
                    boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                    borderRadius="8px"
                >
                    <Image
                        src={authSelector.profile_picture}
                        alt="Jane Doe"
                        w={"258px"}
                        mb="16px"
                        borderRadius={"3px"}
                    />
                </Box>
            </Box>

            {/* Change Password */}
            <Box p="16px">
                <Center>
                    <Text p="14px 0 55px" fontWeight={"bold"} fontSize="xl">
                        Change Your Password
                    </Text>
                </Center>

                {/* Form */}
                <Box fontSize="13px" alignItems="flex-start">
                    <Stack spacing="10">
                        {/* Password */}
                        <FormControl isInvalid={formik.errors.password}>
                            <HStack>
                                <FormLabel w="300px" mr="16px" align="left">
                                    Password
                                </FormLabel>
                                <InputGroup w="100%" display="block">
                                    <Box display="flex" w="70%">
                                        <Input
                                            onChange={formChangeHandler}
                                            name="password"
                                            defaultValue={authSelector.password}
                                        />
                                    </Box>
                                    <FormErrorMessage>
                                        {formik.errors.password}
                                    </FormErrorMessage>
                                </InputGroup>
                            </HStack>
                        </FormControl>

                        {/* Change Password */}
                        <FormControl
                            isInvalid={formik.errors.password_confirmaton}
                        >
                            <HStack>
                                <FormLabel w="300px" mr="16px" align="left">
                                    Password Confirmation
                                </FormLabel>
                                <InputGroup w="100%" display="block">
                                    <Box w="70%" display="flex">
                                        <Input
                                            onChange={formChangeHandler}
                                            name="password_confirmation"
                                        />
                                    </Box>
                                    <FormErrorMessage>
                                        {formik.errors.password_confirmaton}
                                    </FormErrorMessage>
                                </InputGroup>
                            </HStack>
                        </FormControl>

                        {/* Button Submit */}
                        <Center>
                            <Button
                                bg="#F7931E"
                                color="rgba(0,0,0,.54)"
                                onClick={formik.handleSubmit}
                            >
                                Submit
                            </Button>
                        </Center>
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

export default UserInfo
