import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa"
import { Link, useLocation, useNavigate } from "react-router-dom"
import hero from "../assets/Ecommerce web page-rafiki.svg"
import logo from "../assets/logo.png"
import { useFormik } from "formik"
import { axiosInstance } from "../api"
import * as Yup from "yup"
import React, { useEffect } from "react"
import { gapi } from "gapi-script"
import GoogleLogin from "react-google-login"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"
import { useDispatch } from "react-redux"
import { login } from "../redux/features/authSlice"

const clientId =
  "551516387346-2skc8ac82egk828q4agk7htffth1iiga.apps.googleusercontent.com"

const Register = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const toast = useToast()
  const navigate = useNavigate()
  const { onOpen, isOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async ({ email }) => {
      try {
        const response = await axiosInstance.post("/auth/registerEmail", {
          email,
        })

        toast({
          title: "Registration Success",
          description: response.data.message,
          status: "success",
        })
        formik.setFieldValue("email", "")
      } catch (error) {
        console.log(error.response)
        toast({
          title: "Registration Failed",
          description: error.response.data.message,
          status: "error",
        })
      }
    },
    validationSchema: Yup.object({
      email: Yup.string().required().email(),
    }),
    validateOnChange: false,
  })

  const formChangeHandler = ({ target }) => {
    const { name, value } = target
    formik.setFieldValue(name, value)
  }

  const responseFacebook = async (res) => {
    try {
      const response = await axiosInstance.post("/auth/loginSocialMedia", {
        username: res.name,
        email: res.email,
      })

      localStorage.setItem("auth_token", response.data.token)
      dispatch(
        login({
          id: response.data.data.id,
          email: response.data.data.email,
          username: response.data.data.username,
          phone_number: response.data.data.phone_number,
          profile_picture: response.data.data.profile_picture,
        })
      )
      navigate("/")
    } catch (error) {
      console.log(error)
    }
    navigate(location.state.from)
  }

  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      })
    }

    gapi.load("client:auth2", start)
  })

  const onSuccess = async (res) => {
    try {
      const response = await axiosInstance.post("/auth/loginSocialMedia", {
        username: res.profileObj.name,
        email: res.profileObj.email,
      })
      localStorage.setItem("auth_token", response.data.token)
      dispatch(
        login({
          id: response.data.data.id,
          email: response.data.data.email,
          username: response.data.data.username,
          phone_number: response.data.data.phone_number,
          profile_picture: response.data.data.profile_picture,
        })
      )
      navigate("/")
    } catch (error) {
      console.log(error)
    }
    navigate(location.state.from)
  }

  const onFailure = (err) => {
    console.log(err)
  }

  const onClick2 = () => {
    onClose()
    formik.handleSubmit()
  }

  return (
    <Box>
      <Link to={"/"}>
        <Box
          textAlign={"center"}
          mt="20px"
          minW={{ lg: "960px", md: null, base: null }}
        >
          <Image src={logo} height={"27px"} display={"inline"} />

          <Text
            fontSize={"24px"}
            fontWeight="bold"
            color={"#0095DA"}
            display="inline"
            my="auto"
          >
            Shop
          </Text>
          <Text
            fontSize={"24px"}
            fontWeight="bold"
            color={"#F7931E"}
            display="inline"
          >
            edia
          </Text>
        </Box>
      </Link>
      <Box display={"flex"} maxW="1190px" mt="20px" pt="50px" mx={"auto"}>
        <Box
          width={"50%"}
          display={{ lg: "flex", md: "none", base: "none" }}
          justifyContent={"flex-end"}
          pr="80px"
        >
          <Box>
            <Image src={hero} width="360px" justifyContent={"end"} />
            <Text
              m="27px 0 8px"
              fontSize={"22.4px"}
              fontWeight="bold"
              textAlign={"center"}
            >
              It's not complicated at Shopedia
            </Text>
            <Text
              mt="5px"
              fontSize={"13px"}
              fontWeight="semibold"
              textAlign={"center"}
            >
              Join and feel the convenience of transactions on Shopedia
            </Text>
          </Box>
        </Box>

        <Box fontSize="14px" width={{ lg: "50%", md: "100%", base: "100%" }}>
          <Box
            w="400px"
            mx={{ lg: null, md: "auto", base: "auto" }}
            ml={{ lg: "50px", md: null, base: null }}
            boxShadow={"0 0 10px 0 rgb(0 0 0 / 10%)"}
            border="1px solid var(--N75,#E5E7E9)"
            borderRadius={"3px"}
            p="24px 40px 32px "
            textAlign={"center"}
          >
            <Text fontSize="22px" fontWeight={"bold"}>
              Sign Up Now
            </Text>
            <Box mt="8px" fontSize={"14px"} textAlign="center">
              <Text display={"inline"} mr="1">
                Has have a Shopedia account?
              </Text>
              <Link to={"/login"}>
                <Text display={"inline"} color={"#F7931E"}>
                  Login
                </Text>
              </Link>
            </Box>

            <Box display={"flex"} gap="2" mt={"32px"}>
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
                    border="1px solid #ecf0f5"
                    _hover={false}
                  >
                    <Box mr="6px" my={"auto"}>
                      <FcGoogle fontSize={"25px"} />
                    </Box>
                    <Text>Google</Text>
                  </Button>
                )}
              />

              <FacebookLogin
                appId="3125096074449200"
                autoLoad={false}
                callback={responseFacebook}
                fields="name,email,picture"
                render={(renderProps) => (
                  <Button
                    display={"flex"}
                    onClick={renderProps.onClick}
                    w="100%"
                    bgColor={"white"}
                    border="1px solid #ecf0f5"
                    _hover={false}
                  >
                    <Box mr="6px" my={"auto"}>
                      <FaFacebook color="#3b5998" size={"25px"} />
                    </Box>
                    <Text>Facebook</Text>
                  </Button>
                )}
              />
            </Box>

            <Box margin="24px 0">
              <Box justifyContent={"space-between"} display="flex">
                <Box width="33%">
                  <hr />
                </Box>

                <Box width="33%">
                  <hr />
                </Box>
              </Box>
              <Text
                textAlign={"center"}
                mt="-13px"
                mx={"auto"}
                bgColor={"white"}
              >
                or register with
              </Text>
            </Box>

            <form onSubmit={formik.handleSubmit}>
              <Box m="24px 0 8px">
                <Box>
                  <Text
                    fontSize={"12px"}
                    textAlign="start"
                    mb="4px"
                    fontWeight={"normal"}
                  >
                    Email
                  </Text>
                  <FormControl isInvalid={formik.errors.email}>
                    <Input
                      value={formik.values.email}
                      name="email"
                      type="text"
                      onChange={formChangeHandler}
                      border={"1px solid #e2e8f0"}
                    />
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                  </FormControl>
                  <Text
                    fontSize={"12px"}
                    textAlign="start"
                    mt="4px"
                    fontWeight={"normal"}
                  >
                    Example: email@shopedia.com
                  </Text>
                </Box>
              </Box>

              <Button
                display={"flex"}
                w="100%"
                bgColor={"#F7931E"}
                _hover={false}
                m="16px 0"
                color={"white"}
                onClick={onOpen}
                isDisabled={!formik.values.email}
              >
                <Text fontWeight={"bold"}>Register</Text>
              </Button>

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
                    maxW="600px"
                  >
                    <AlertDialogHeader p="0"></AlertDialogHeader>
                    <AlertDialogBody textAlign={"center"} p="0">
                      <Text fontWeight={"bold"} fontSize="26px" mb={"14px"}>
                        {formik.values.email}
                      </Text>
                      <Text fontSize={"16px"} m="0px 16px 16px">
                        Is the email you entered correct?
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
                        Change
                      </Button>
                      <Button
                        fontWeight={"bold"}
                        bgColor="#F7931E"
                        color={"white"}
                        type="submit"
                        onClick={onClick2}
                        w="164px"
                        h="48px"
                        borderRadius="8px"
                        _hover={false}
                      >
                        Yes, right
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </form>

            <Box mt="15px" fontSize={"12px"} fontWeight={"normal"}>
              <Text textAlign="center">By registering I agree</Text>
              <Link>
                <Text display={"inline"} mr="1" color={"#F7931E"}>
                  Terms and Conditions
                </Text>
              </Link>
              <Text display={"inline"} mr="1">
                and
              </Text>
              <Link>
                <Text display={"inline"} color={"#F7931E"}>
                  Privacy Policy
                </Text>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Register
