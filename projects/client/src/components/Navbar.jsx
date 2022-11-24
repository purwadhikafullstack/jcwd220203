import {
    Avatar,
    Box,
    Button,
    Grid,
    GridItem,
    HStack,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react"

import { IoMdCart } from "react-icons/io"
import { BiLogOutCircle } from "react-icons/bi"
import { Link, Navigate, useLocation } from "react-router-dom"
import logo from "../assets/logo.png"
import { BiSearch } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../redux/features/authSlice"
import { IoIosNotifications } from "react-icons/io"
import { IoIosAlert } from "react-icons/io"

const Navbar = () => {
    const authSelector = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const toast = useToast()

    const location = useLocation()

    const logoutBtnHandler = () => {
        localStorage.removeItem("auth_token")
        dispatch(logout())
        toast({
            title: "User Logout",
            status: "info",
        })
        Navigate("/")
    }

    return (
        <>
            <Box
                boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                position={"fixed"}
                left="0"
                right={"0"}
                top="0"
                backgroundColor={"#EEEEEE"}
                zIndex="9998"
            >
                <Box backgroundColor="#E5F9F6">
                    <HStack
                        height={"65px"}
                        width="96%"
                        mx={"auto"}
                    >
                        {/* Brand */}
                        <Link to={'/'}>
                            <Image src={logo} width={'65px'} display={'inline'} mt={'4px'} />
                        </Link>
                        <Link to={'/'}>
                            <Text
                                fontSize={"30px"}
                                fontWeight="bold"
                                color={"#0095DA"}
                                display="inline"
                                ml={'-3px'}
                            >
                                Shop
                                <Text
                                    pl={'0'}
                                    fontSize={"30px"}
                                    fontWeight="bold"
                                    color={"#F7931E"}
                                    display="inline"
                                >
                                    edia
                                </Text>
                            </Text>
                        </Link>
                        {/* Category */}
                        <Popover trigger="hover" >
                            <PopoverTrigger>
                                <Box
                                    pr={'1px'}
                                    pl={'18px'}
                                    cursor={'pointer'}
                                >
                                    <Text
                                        my={"auto"}
                                        fontSize="14px"
                                        fontWeight="semibold"
                                        p="8px"
                                        pt={'8x'}
                                        color={'#878787'}
                                        _hover={{
                                            bgColor: '#A5D8F8',
                                            color: "orange",
                                            borderRadius: '5px'
                                        }}
                                    >
                                        Category
                                    </Text>
                                </Box>
                            </PopoverTrigger>
                            <PopoverContent w={"100%"} mt="1px" bgColor={'#E5F9F6'} borderRadius={'5px'}>
                                <PopoverBody fontWeight={"bold"} fontSize="14px">
                                    <Grid templateColumns="repeat(5, 1fr)" gap="6">
                                        <GridItem>
                                            <Text
                                                _hover={{
                                                    bgColor: "#A5D8F8",
                                                    borderRadius: "5px",
                                                }}
                                                p="5px"
                                            >
                                                Category 1
                                            </Text>
                                            <Text
                                                _hover={{
                                                    bgColor: "#A5D8F8",
                                                    borderRadius: "5px",
                                                }}
                                                p="5px"
                                            >
                                                Category 2
                                            </Text>
                                            <Text
                                                _hover={{
                                                    bgColor: "#A5D8F8",
                                                    borderRadius: "5px",
                                                }}
                                                p="5px"
                                            >
                                                Category 3
                                            </Text>
                                            <Text
                                                _hover={{
                                                    bgColor: "#A5D8F8",
                                                    borderRadius: "5px",
                                                }}
                                                p="5px"
                                            >
                                                Category 4
                                            </Text>
                                        </GridItem>
                                    </Grid>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>

                        {/* Seacrh Input */}
                        <Box w={"100%"}>
                            <InputGroup>
                                <Input
                                    placeholder="Find in Warehouse"
                                    _placeholder={{ fontSize: "14px" }}
                                    bgColor={'#fff'}
                                    border={"2px solid #FFD7B1"}
                                    borderRadius={'8px'}
                                />
                                <InputRightElement >
                                    <Button borderLeftRadius="0" _hover={{ bgColor: "#E38566" }} size={'md'} h={'36px'} bgColor={'#FFD7B1'} mr={'4px'}>
                                        <BiSearch color={'#0095DA'} />
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </Box>

                        {/* notification */}
                        {authSelector.id ? (
                            <Box
                                display={"flex"}
                                gap="4"
                                fontSize="14px"
                                fontWeight={"semibold"}
                                cursor={"pointer"}
                            >
                                <Box
                                    display={"flex"}
                                    my="auto"
                                    gap={2}
                                    paddingRight={1}
                                    color="#6c727c"
                                >
                                    <Popover trigger="hover">
                                        <PopoverTrigger>
                                            <Box
                                                pl={3} mr={'-5px'}
                                            >
                                                <Stack
                                                    p={2}
                                                    _hover={{ bgColor: "#A5D8F8", borderRadius: "3px", color: 'orange' }}
                                                >
                                                    < IoIosNotifications fontSize={"22px"} />
                                                </Stack>
                                            </Box>
                                        </PopoverTrigger>
                                        <PopoverContent bgColor={'#E5F9F6'}>
                                            <Box boxShadow={"rgba(0, 0, 0, 0.05) 0px 3px 8px"}>
                                                <PopoverHeader
                                                    display={"flex"}
                                                    justifyContent="space-between"
                                                >
                                                    <Text fontSize={'17px'}>Notification</Text>
                                                    <Box fontSize={'21px'}>
                                                        <IoIosAlert />
                                                    </Box>
                                                </PopoverHeader>
                                            </Box>
                                            <PopoverBody>
                                                <Box>
                                                    <Text textAlign={'center'}>Transaction</Text>
                                                </Box>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </Box>
                            </Box>
                        ) : null}

                        {/* Cart */}
                        <Box
                            display={"flex"}
                            gap="4"
                            fontSize="14px"
                            fontWeight={"semibold"}
                        >
                            <Link to="/cart">
                                <Box
                                    display={"flex"}
                                    my="auto"
                                    gap={2}
                                    borderRight="1px solid #e0e0e0"
                                    paddingRight={4}
                                    color="#6c727c"
                                >
                                    <Popover trigger="hover">
                                        <PopoverTrigger>
                                            <Link to="/cart">
                                                <Box
                                                    _hover={{ bgColor: "#A5D8F8", borderRadius: "3px", color: 'orange' }}
                                                    p={2}
                                                >
                                                    <IoMdCart fontSize={"22px"} />
                                                </Box>
                                            </Link>
                                        </PopoverTrigger>
                                        <PopoverContent bgColor={'#E5F9F6'}>
                                            <PopoverHeader
                                                display={"flex"}
                                                justifyContent="space-between"
                                            >
                                                <Text>Cart(0)</Text>
                                                <Link to="/cart">
                                                    <Text color="#F7931E"> See Now</Text>
                                                </Link>
                                            </PopoverHeader>
                                            <PopoverBody>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </Box>
                            </Link>


                            {/* navbar user login */}
                            {authSelector.username ? (
                                <Box display={{ lg: "flex", base: "none" }} mr="2" ml="1" cursor={'pointer'} >
                                    <Popover trigger={"hover"} >
                                        <PopoverTrigger>
                                            <Box
                                                display={"flex"}
                                                my="auto"
                                                minW={"113px"}
                                                maxW="200px"
                                                paddingLeft="5px"
                                                paddingRight={"5px"}
                                                _hover={{
                                                    bgColor: '#A5D8F8',
                                                    color: "orange",
                                                    borderRadius: "3px",
                                                }}
                                                color={"rgba(0,0,0,.54)"}
                                            >
                                                <Avatar
                                                    size="sm"
                                                    name={authSelector.username}
                                                    mr={2}
                                                    width={"25px"}
                                                    height="25px"
                                                    my="auto"
                                                    src={authSelector.profile_picture}
                                                />
                                                <Text my="auto" padding={"8px"} textTransform={'capitalize'}>
                                                    {authSelector.username.split(" ")[0]}
                                                </Text>
                                            </Box>
                                        </PopoverTrigger>
                                        <PopoverContent w={"300px"} mr="4" bgColor={'#E5F9F6'}>
                                            <PopoverBody>
                                                <Box p="2 4"
                                                    bgColor={'#E5F9F6'}
                                                >
                                                    <Box
                                                        boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                                                        display={"flex"}
                                                        my="auto"
                                                        padding="6px 12px"
                                                        borderRadius={"5px"}
                                                        bgColor={'#E5F9F6'}
                                                        cursor={'pointer'}
                                                    >
                                                        <Avatar
                                                            name={authSelector.username}
                                                            mr={2}
                                                            width={"50px"}
                                                            height="50px"
                                                            my="auto"
                                                            src={authSelector.profile_picture}
                                                        />
                                                        <Text
                                                            my="auto"
                                                            padding={"8px"}
                                                            fontSize="16px"
                                                            fontWeight={"bold"}
                                                            color={"rgba(0,0,0,.54)"}
                                                            textTransform={'capitalize'}
                                                        >
                                                            {authSelector.username}
                                                        </Text>
                                                    </Box>

                                                    <Box fontSize={"14px"} p="10px 0">
                                                        <Link to="/user/profile">
                                                            <Box
                                                                _hover={{
                                                                    bgColor: "#A5D8F8",
                                                                    borderRadius: "7px",
                                                                }}
                                                                p={"5px 4px"}
                                                            >
                                                                <Text>Profile</Text>
                                                            </Box>
                                                        </Link>

                                                        <Link to={'/transaction'}>
                                                            <Box
                                                                _hover={{
                                                                    bgColor: "#A5D8F8",
                                                                    borderRadius: "7px",
                                                                }}
                                                                p={"5px 4px"}
                                                            >
                                                                <Text>Transaction</Text>
                                                            </Box>
                                                        </Link>

                                                        <Box
                                                            display={"flex"}
                                                            _hover={{
                                                                bgColor: "#A5D8F8",
                                                                borderRadius: "7px",
                                                            }}
                                                            p={"5px 4px"}
                                                            b="0"
                                                            onClick={logoutBtnHandler}
                                                        >
                                                            <Text>Logout</Text>
                                                            <Box my="auto" ml="1">
                                                                <BiLogOutCircle />
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </Box>
                            ) : (
                                // navbar if user not login yet
                                <Box gap="2" display={{ lg: "flex", md: "flex", base: "none" }}>
                                    <Link to={"/login"} replace state={{ from: location }}>
                                        <Box width={"73px"}>
                                            <Button
                                                _hover={"null"}
                                                height="32px"
                                                borderRadius={"8px"}
                                                border={"1px solid #0095DA"}
                                                bgColor={"white"}
                                                color={"#0095DA"}
                                                fontSize="12px"
                                                fontWeight={"bold"}
                                            >
                                                Login
                                            </Button>
                                        </Box>
                                    </Link>
                                    <Link to="/register">
                                        <Box width={"72px"}>
                                            <Button
                                                _hover={"null"}
                                                height="32px"
                                                borderRadius={"8px"}
                                                bgColor={"#0095DA"}
                                                border={"1px solid #0095DA"}
                                                color={"#fff"}
                                                fontWeight={"bold"}
                                                fontSize="12px"
                                                textAlign="center"
                                                mx={"auto"}
                                                w={'65px'}
                                            >
                                                Register
                                            </Button>
                                        </Box>
                                    </Link>
                                </Box>
                            )}
                        </Box>
                    </HStack>
                </Box>
            </Box >
        </>
    )
}

export default Navbar
