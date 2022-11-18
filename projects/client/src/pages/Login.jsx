import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { axiosInstance } from "../api"
import * as Yup from 'yup'
import { login } from "../redux/features/authSlice"
import React, { useEffect } from "react"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa"
import { gapi } from "gapi-script"
import GoogleLogin from "react-google-login"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Oshop from "../assets/sales-shop.svg"
import logo from "../assets/logo.png"
import { BiShow } from "react-icons/bi"
import { BiHide } from "react-icons/bi"

const clientId =
    "551516387346-2skc8ac82egk828q4agk7htffth1iiga.apps.googleusercontent.com"

const LoginPage = () => {

    const [showPassword, setShowPassword] = useState(false)

    const dispatch = useDispatch()

    const toast = useToast()

    const navigate = useNavigate()

    const location = useLocation()

    const togglePassword = () => {
        setShowPassword(!showPassword)
    }

    // normal login
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        onSubmit: async ({ email, password }) => {
            try {
                const response = await axiosInstance.post(`/auth/login`, {
                    email,
                    password
                })

                toast({
                    title: "Login Succesful",
                    status: "success",
                    description: response.data.message,
                })

                localStorage.setItem("auth_token", response.data.token)
                dispatch(
                    login({
                        id: response.data.data.id,
                        email: response.data.data.email,
                        username: response.data.data.username
                    })
                )
                formik.setFieldValue("email", "")
                formik.setFieldValue("password", "")

            } catch (err) {
                console.log(err)
                toast({
                    title: "login failed",
                    status: "error",
                    description: err.response.data.message,
                })
            }
        },
        validationSchema: Yup.object({
            email: Yup.string().required(),
            password: Yup.string().required(),
        }),
        validateOnChange: false,
    })

    const formChangeHandler = ({ target }) => {
        const { name, value } = target;
        formik.setFieldValue(name, value)
    }

    // facebook login
    const responseFacebook = async (res) => {
        try {
            const response = await axiosInstance.post("/auth/loginSocialMedia", {
                username: res.name,
                email: res.email,
            })

            toast({
                title: "Login Succesful",
                status: "success",
                description: response.data.message,
            })

            localStorage.setItem("auth_token", response.data.token)
            dispatch(
                login({
                    id: response.data.data.id,
                    email: response.data.data.email,
                    username: response.data.data.username
                })
            )
        } catch (error) {
            console.log(error)
        }
        navigate(location.state.from)
    }

    // google login
    const onSuccess = async (res) => {
        try {
            const response = await axiosInstance.post("/auth/loginSocialMedia", {
                username: res.profileObj.name,
                email: res.profileObj.email,
            })

            toast({
                title: "Login Succesful",
                status: "success",
                description: response.data.message,
            })

            localStorage.setItem("auth_token", response.data.token)
            dispatch(
                login({
                    id: response.data.data.id,
                    email: response.data.data.email,
                    username: response.data.data.username
                })
            )
        } catch (error) {
            console.log(error)
        }
        navigate(location.state.from)
    }

    const onFailure = (err) => {
        console.log(err)
    }

    const myStyle = {
        color: "#F7931E",
        paddingLeft: "5px"
    }

    useEffect(() => {
        const start = () => {
            gapi.client.init({
                clientId: clientId,
                scope: "",
            })
        }
        gapi.load("client:auth2", start)
    }, [])


    return (
        <Box >
            {/* logo for mobile */}
            <Box textAlign={"center"} mt="30px" mb={'10px'} minW={"100px"} display={{ lg: "none", md: "none", base: "flex" }} justifyContent={'center'} >
                <Link to={'/'}>
                    <Image src={logo} width={'50px'} display={'inline'} />
                </Link>
                <Link to={'/'}>
                    <Text
                        fontSize={"30px"}
                        fontWeight="bold"
                        color={"#0095DA"}
                        display="inline"
                    >
                        Shop
                    </Text>
                    <Text
                        pl={'0'}
                        fontSize={"30px"}
                        fontWeight="bold"
                        color={"#F7931E"}
                        display="inline"
                    >
                        edia
                    </Text>
                </Link>
            </Box>
            {/* logo for dekstop */}
            <Box textAlign={"center"} mt="20px" mb={'15px'} minW={"960px"} display={{ lg: "flex", md: "none", base: "none" }} justifyContent={'center'} >
                <Link to={'/'}>
                    <Image src={logo} width={'50px'} display={'inline'} mt={'5px'} />
                </Link>
                <Link to={'/'}>
                    <Text
                        fontSize={"40px"}
                        fontWeight="bold"
                        color={"#0095DA"}
                        display="inline"
                    >
                        Shop
                    </Text>
                    <Text
                        pl={'0'}
                        fontSize={"40px"}
                        fontWeight="bold"
                        color={"#F7931E"}
                        display="inline"
                    >
                        edia
                    </Text>
                </Link>
            </Box>
            <Box display={"flex"} maxW="100%" mt="10px" pt="50px" mx={"auto"} bgColor={'#F9A88C'} height={'590px'} >
                <Box
                    width={"50%"}
                    display={{ lg: "flex", md: "none", base: "none" }}
                    justifyContent={"flex-end"}
                    pr="80px"
                >
                    <Box mt={'40px'}>
                        <Image src={Oshop} width="480px" justifyContent={"end"} />
                        <Text
                            m="27px 0 8px"
                            fontSize={"22.4px"}
                            fontWeight="bold"
                            textAlign={"center"}
                            color={'#009CE2'}
                        >
                            It's not complicated at Shopedia
                        </Text>
                        <Text
                            mt="5px"
                            fontSize={"13px"}
                            fontWeight="semibold"
                            textAlign={"center"}
                            color={'#009CE2'}
                        >
                            Join and feel the convenience of transactions on Shopedia
                        </Text>
                    </Box>
                </Box>

                <Box fontSize="14px" width={"50%"} mt={'5px'} >
                    <Box
                        w="400px"
                        mx={"auto"}
                        ml="50px"
                        boxShadow={"0 0 10px 0 rgb(0 0 0 / 10%)"}
                        border="1px solid var(--N75,#0095DA)"
                        borderRadius={"10px"}
                        p="24px 40px 32px "
                        textAlign={"center"}
                        bgColor={'white'}
                    >
                        <Text fontSize="22px" fontWeight={"bold"} textAlign={'left'} color={'#0095DA'}>
                            Log in                        </Text>
                        <Box mt="8px" fontSize={"12px"} textAlign="left" color={'#F7931E'}>
                            <Text display={"inline"} mr="1" color={'#F37121'}>
                                Welcome to Shopedia, please put your login credentials below to access our website
                            </Text>
                        </Box>

                        <form onSubmit={formik.handleSubmit}>
                            <Box m="20px 0 8px">
                                <FormControl isInvalid={formik.errors.email}>
                                    <Input
                                        pl={'10px'}
                                        value={formik.values.email}
                                        name="email"
                                        type="text"
                                        onChange={formChangeHandler}
                                        border={"1px solid #e2e8f0"}
                                        placeholder={'Email'}
                                    />
                                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                                </FormControl>
                                <Box mt={'20px'}>
                                    <FormControl isInvalid={formik.errors.password}>
                                        <InputGroup>
                                            <Input
                                                pl={'10px'}
                                                value={formik.values.password}
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                onChange={formChangeHandler}
                                                border={"1px solid #e2e8f0"}
                                                placeholder={'Password'}
                                            />
                                            <InputRightElement width={'4.5rem'}>
                                                <Button
                                                    ml={'19px'}
                                                    size={'md'}
                                                    bg={'#white'}
                                                    onClick={togglePassword}
                                                    color={'#F37121'}
                                                >
                                                    {showPassword ? <BiShow /> : <BiHide />}
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                                    </FormControl>
                                    <Box>
                                        <Link to="/login/reset-password">
                                            <Text
                                                cursor={'pointer'}
                                                textAlign={'right'}
                                                color={'#0095DA'}
                                                fontSize={'11px'}
                                                mt={'5px'}
                                            >
                                                Forgot password?
                                            </Text>
                                        </Link>
                                    </Box>
                                </Box>
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
                                <Text fontWeight={"bold"}>Log in</Text>
                            </Button>

                            <Box margin="30px 0">
                                <Box justifyContent={"space-between"} display="flex">
                                    <Box width="42%">
                                        <hr />
                                    </Box>

                                    <Box width="42%">
                                        <hr />
                                    </Box>
                                </Box>
                                <Text
                                    textAlign={"center"}
                                    mt="-13px"
                                    mx={"auto"}
                                    bgColor={"white"}
                                    color={'#B0BFBF'}
                                >
                                    or
                                </Text>
                            </Box>

                            {/* google login */}
                            <Box display={"flex"} gap="2" mt={"-10px"}>
                                <GoogleLogin
                                    clientId={clientId}
                                    buttonText={null}
                                    onSuccess={onSuccess}
                                    onFailure={onFailure}
                                    cookiePolicy={"single_host_origin"}
                                    isSignedIn={false}
                                    render={(renderProps) => (
                                        <Button
                                            display={"flex"}
                                            onClick={renderProps.onClick}
                                            w="100%"
                                            bgColor={"white"}
                                            border="1px solid #A6B0DD"
                                            _hover={false}
                                        >
                                            <Box mr="-1px" my={"auto"}>
                                                <FcGoogle fontSize={"25px"} />
                                            </Box>
                                            <Text>Google</Text>
                                        </Button>
                                    )}
                                />

                                {/* facebook login */}
                                <FacebookLogin
                                    appId="624798946100981"
                                    autoLoad={false}
                                    callback={responseFacebook}
                                    fields="name,email,picture"
                                    render={(renderProps) => (
                                        <Button
                                            display={"flex"}
                                            onClick={renderProps.onClick}
                                            w="100%"
                                            bgColor={"white"}
                                            border="1px solid #A6B0DD"
                                            _hover={false}
                                        >
                                            <Box mr="6px" my={"auto"}>
                                                <FaFacebook color="#3b5998" size={"25px"} />
                                            </Box>
                                            <Text>FaceBook</Text>
                                        </Button>
                                    )}
                                />
                            </Box>
                            <Box textAlign={'center'} mt={'30px'}>
                                <Text
                                    color={'#0095DA'}
                                    fontSize={'12px'}
                                >
                                    Don't have an account?
                                    <span style={myStyle} >
                                        <Link to={'/register'}>
                                            Sign up
                                        </Link>
                                    </span>
                                </Text>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Box >
        </Box >
    )
}

export default LoginPage