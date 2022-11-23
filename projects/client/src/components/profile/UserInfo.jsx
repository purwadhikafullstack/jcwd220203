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
    InputLeftAddon,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useSelector } from "react-redux"
import * as Yup from "yup"
import { axiosInstance } from "../../api"
import { useRef } from "react"

const UserInfo = () => {
    const toast = useToast()

    const authSelector = useSelector((state) => state.auth)

    const inputFileRef = useRef()
    const formik = useFormik({
        initialValues: {
            username: "",
            phone_number: "",
            profile_picture: null,
        },
        onSubmit: async ({ username, phone_number, profile_picture }) => {
            try {
                const userData = new FormData()

                if (username) {
                    userData.append("username", username)
                }
                if (phone_number) {
                    userData.append("phone_number", phone_number)
                }
                if (profile_picture) {
                    userData.append("profile_picture", profile_picture)
                }
                const response = await axiosInstance.patch(
                    `/profile/${authSelector.id}`,
                    userData
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
            username: Yup.string().min(3),
            phone_number: Yup.number().min(3),
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
                    <Button
                        w="100%"
                        _hover={false}
                        fontWeight="bold"
                        bgColor={"white"}
                        border="1px solid #dfe1e3"
                        borderRadius={"5px"}
                        onClick={() => inputFileRef.current.click()}
                    >
                        Select Photo
                    </Button>
                    <Input
                        w="100%"
                        _hover={false}
                        fontWeight="bold"
                        bgColor={"white"}
                        border="1px solid #dfe1e3"
                        borderRadius={"5px"}
                        onChange={(e) =>
                            formik.setFieldValue(
                                "profile_picture",
                                e.target.files[0]
                            )
                        }
                        accept="image/*"
                        name="profile_picture"
                        type="file"
                        color="transparent"
                        ref={inputFileRef}
                        display="none"
                    />

                    <Text m="12px 0" fontSize={"12px"}>
                        File size: maximum 1,000,000 bytes (1 Megabytes).
                        Allowed file extensions: .JPG .JPEG .PNG
                    </Text>
                </Box>
            </Box>

            {/* Change Personal Info */}
            <Box p="16px">
                <Center>
                    <Text p="14px 0 55px" fontWeight={"bold"} fontSize="xl">
                        Change Your Personal Info
                    </Text>
                </Center>

                {/* Form */}
                <Box fontSize="13px" alignItems="flex-start">
                    <Stack spacing="10">
                        {/* Name */}
                        <FormControl isInvalid={formik.errors.username}>
                            <HStack>
                                <FormLabel w="300px" mr="16px" align="left">
                                    Name
                                </FormLabel>
                                <InputGroup w="100%" display="block">
                                    <Box display="flex" w="70%">
                                        <Input
                                            onChange={formChangeHandler}
                                            name="username"
                                            defaultValue={authSelector.username}
                                        />
                                    </Box>

                                    <FormErrorMessage>
                                        {formik.errors.username}
                                    </FormErrorMessage>
                                </InputGroup>
                            </HStack>
                        </FormControl>

                        {/* Phone Number */}
                        <FormControl isInvalid={formik.errors.phone_number}>
                            <HStack>
                                <FormLabel w="300px" mr="16px" align="left">
                                    Phone Number
                                </FormLabel>
                                <InputGroup w="100%" display="block">
                                    <Box display="flex" w="70%">
                                        <InputLeftAddon children="+62" />
                                        <Input
                                            onChange={formChangeHandler}
                                            name="phone_number"
                                            defaultValue={
                                                authSelector.phone_number
                                            }
                                            w="100%"
                                        />
                                    </Box>
                                    <FormErrorMessage>
                                        {formik.errors.phone_number}
                                    </FormErrorMessage>
                                </InputGroup>
                            </HStack>
                        </FormControl>

                        {/* Email */}
                        <FormControl>
                            <HStack>
                                <FormLabel w="300px" mr="16px" align="left">
                                    Email
                                </FormLabel>
                                <InputGroup w="100%" display="block">
                                    <Box display="flex" w="70%">
                                        <Input
                                            onChange={formChangeHandler}
                                            name="email"
                                            defaultValue={authSelector.email}
                                            isDisabled
                                        />
                                    </Box>
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
