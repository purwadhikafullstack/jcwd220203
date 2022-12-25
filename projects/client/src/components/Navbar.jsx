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
import {
    Link,
    useNavigate,
    createSearchParams,
    useSearchParams,
    useLocation,
} from "react-router-dom"
import logo from "../assets/logo.png"
import emptyCart from "../assets/emptyCart.png"
import { BiSearch } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../redux/features/authSlice"
import { IoIosNotifications } from "react-icons/io"
import { IoIosAlert } from "react-icons/io"
import { GiHamburgerMenu } from "react-icons/gi"
import { useState } from "react"
import { useEffect } from "react"
import { fillCart } from "../redux/features/cartSlice"
import { axiosInstance } from "../api"
import status1 from "../assets/transactionStatusLogo/awaiting.png"
import status2 from "../assets/transactionStatusLogo/processed2.png"
import status3 from "../assets/transactionStatusLogo/Delivered.png"
import status4 from "../assets/transactionStatusLogo/Shipping.png"
import { fillTrans } from "../redux/features/transSlice"

const Navbar = ({ onChange, onClick, onKeyDown }) => {
    const authSelector = useSelector((state) => state.auth)
    const [searchValue, setSearchValue] = useState("")
    const [searchParam, setSearchParam] = useSearchParams()
    const cartSelector = useSelector((state) => state.cart)
    const [showCategory, setShowCategory] = useState([])
    const [totalCartQuantity, setTotalCartQuantity] = useState(0)
    const [cartData, setCartData] = useState([])
    const [transData, setTransData] = useState([])
    const [unpaidTransaction, setUnpaidTransaction] = useState([])

    const dispatch = useDispatch()
    const toast = useToast()
    const navigate = useNavigate()
    const apiImg = process.env.REACT_APP_IMAGE_URL
    const location = useLocation()

    const transSelector = useSelector((state) => state.trans)
    const statusOrder = transSelector.trans.map((val) => val.OrderStatusId)

    let StatusOrderActive = []
    let AwaitingConfirmation = []
    let Processed = []
    let Shipping = []
    let Delivered = []

    for (let i = 0; i < statusOrder.length; i++) {

        if (statusOrder[i] === 1) {
            AwaitingConfirmation.push(statusOrder[i])
        } else if (statusOrder[i] === 2) {
            Processed.push(statusOrder[i])
        } else if (statusOrder[i] === 3) {
            Shipping.push(statusOrder[i])
        } else if (statusOrder[i] === 4) {
            Delivered.push(statusOrder[i])
        }
    }
    for (let i = 0; i < statusOrder.length; i++) {
        if (statusOrder[i] === 1 || statusOrder[i] === 2 || statusOrder[i] === 3 || statusOrder[i] === 4) {
            StatusOrderActive.push(statusOrder[i])
        }
    }

    const refreshPage = () => {
        window.location.reload(false)
    }

    const fetchMyCart = async () => {
        try {
            const response = await axiosInstance.get("/carts/me")
            dispatch(fillCart(response.data.data))
            setCartData(response.data.data)

            const cartQuantity = response.data.data.map((val) => val.quantity)

            let Total = 0

            for (let i = 0; i < cartQuantity.length; i++) {
                Total += Number(cartQuantity[i])
            }

            setTotalCartQuantity(Total)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchAllTransaction = async () => {
        try {
            const response = await axiosInstance.get('/transactions/all-transaction-list')
            dispatch(fillTrans(response.data.data))
            setTransData(response.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchUnpaidTransaction = async () => {
        try {
            const response = await axiosInstance.get("/transactions/unpaid-transaction")

            setUnpaidTransaction(response.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchCategory = async () => {
        try {
            const response = await axiosInstance.get("/categories")
            setShowCategory(response.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    const renderCategory = () => {
        return showCategory.map((val) => {
            return (
                <Text
                    _hover={{
                        bgColor: "#A5D8F8",
                        borderRadius: "5px",
                    }}
                    p="5px"
                >
                    {val.category_name}
                </Text>
            )
        })
    }

    const logoutBtnHandler = () => {
        localStorage.removeItem("auth_token")
        dispatch(logout())

        toast({
            title: "User Logout",
            status: "info",
        })

        if (
            location.pathname === "/cart" ||
            location.pathname === "/transaction-list" ||
            location.pathname === "/user/profile" ||
            location.pathname === "/user/profile/change-password" ||
            location.pathname === "/user/profile/address"
        ) {
            navigate("/login")
            refreshPage()
        } else {
            refreshPage()
        }
    }

    const changeBtnHandler = (e) => {
        setSearchValue(e.target.value)
        onChange(e)
    }

    const keyDownBtnHandler = (e) => {
        if (e.key === "Enter") {
            navigate({
                pathname: "/product",
                search: createSearchParams({
                    name: searchValue,
                }).toString(),
            })
            onKeyDown(e)
        }
    }

    const renderCartNavbar = () => {
        return cartData.map((val) => {
            return (
                <>
                    <Link to={"/cart"}>
                        <Box h={"1px"} bgColor={"#fcd4a5"} mt={"-2px"} />
                        <Box
                            display={"flex"}
                            flexDirection={"row"}
                            mt={"15px"}
                            pl={"10px"}
                            pr={"10px"}
                            pb={"13px"}
                        >
                            <Image
                                src={val.Product.Image_Urls[0].image_url}
                                h={"35px"}
                                w={"35px"}
                            />
                            <Box pl={"10px"}>
                                <Text
                                    fontWeight={600}
                                    fontSize={"14px"}
                                    whiteSpace={"nowrap"}
                                    overflow={"hidden"}
                                    textOverflow={"ellipsis"}
                                    width={"200px"}
                                    fontColor={"#31353BF5"}
                                    fontFamily={
                                        "Open Sauce One,Nunito Sans, sans-serif"
                                    }
                                    _hover={{
                                        color: "blue",
                                    }}
                                >
                                    {val.Product.product_name}
                                </Text>
                                <Text
                                    fontWeight={400}
                                    fontSize={"12px"}
                                    width={"180px"}
                                    fontColor={"#31353BF5"}
                                    fontFamily={
                                        "Open Sauce One,Nunito Sans, sans-serif"
                                    }
                                >
                                    {val.quantity}{" "}
                                    {val.quantity > 1 ? "items" : "item"}{" "}
                                    ({val.Product.product_weight}gr)
                                </Text>
                            </Box>
                        </Box>
                        <Box>
                            <Text
                                pl={"3px"}
                                fontFamily={
                                    "Open Sauce One,Nunito Sans, sans-serif"
                                }
                                fontWeight={700}
                                fontSize={"15px"}
                                color={"#F7931E"}
                                mt={"-42px"}
                                textAlign={"right"}
                                pb={"20px"}
                                mr={"8px"}
                            >
                                {
                                    new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    })
                                        .format(val.Product.price)
                                        .split(",")[0]
                                }
                            </Text>
                        </Box>
                    </Link>
                </>
            )
        })
    }

    const goToAwaitingConfirmation = () => {
        navigate('/transaction-list?status=Awaiting+Confirmation')
    }

    const goToProcessed = () => {
        navigate('/transaction-list?status=Processed')
    }

    const goToDelivered = () => {
        navigate('/transaction-list?status=Delivered')
    }

    const goToShipping = () => {
        navigate('/transaction-list?status=Shipping')
    }

    useEffect(() => {
        setSearchValue(searchParam.get("name"))
    }, [])

    useEffect(() => {
        fetchMyCart()
        fetchCategory()
    }, [cartData])

    useEffect(() => {
        fetchUnpaidTransaction()
        fetchAllTransaction()
    }, [transData])

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
                    <HStack height={"65px"} width="96%" mx={"auto"}>
                        {/* Brand */}
                        <Link to={"/"}>
                            <Image
                                src={logo}
                                width={"65px"}
                                display={"inline"}
                                mt={"4px"}
                            />
                        </Link>
                        <Link to={"/"}>
                            <Text
                                fontSize={"30px"}
                                fontWeight="bold"
                                color={"#0095DA"}
                                display="inline"
                                ml={"-3px"}
                            >
                                Shop
                                <Text
                                    pl={"0"}
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
                        <Popover trigger="hover">
                            <PopoverTrigger>
                                <Box pr={"1px"} pl={"10px"} cursor={"pointer"}>
                                    <Text
                                        my={"auto"}
                                        fontSize="28px"
                                        fontWeight="semibold"
                                        p="15px"
                                        pr={"17px"}
                                        pt={"8x"}
                                        color={"#878787"}
                                        _hover={{
                                            // bgColor: "#A5D8F8",
                                            color: "orange",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        <GiHamburgerMenu />
                                    </Text>
                                </Box>
                            </PopoverTrigger>
                            <PopoverContent
                                w={"100%"}
                                mt="-10px"
                                bgColor={"#E5F9F6"}
                                borderRadius={"5px"}
                            >
                                <PopoverBody
                                    fontWeight={"bold"}
                                    fontSize="14px"
                                >
                                    <Grid
                                        templateColumns="1fr"
                                        gap="6"
                                        width={"180px"}
                                        height={"400px"}
                                        overflow={"auto"}
                                        cursor={"pointer"}
                                    >
                                        <GridItem>{renderCategory()}</GridItem>
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
                                    bgColor={"#fff"}
                                    border={"2px solid #FFD7B1"}
                                    borderRadius={"15px"}
                                    onChange={changeBtnHandler}
                                    onKeyDown={keyDownBtnHandler}
                                    value={searchValue}
                                />
                                <InputRightElement width="3.5rem" mr={"-5px"}>
                                    <Button
                                        borderLeftRadius="0"
                                        _hover={{ bgColor: "none" }}
                                        size={"md"}
                                        h={"36px"}
                                        bgColor={"#fff"}
                                        mr={"4px"}
                                        borderRadius={"15px"}
                                    >
                                        <BiSearch color={"#F7931E"} />
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
                                            <Box pl={"10px"} mr={"-12px"}>
                                                <Stack
                                                    p={2}
                                                    _hover={{
                                                        bgColor: "#A5D8F8",
                                                        borderRadius: "7px",
                                                        color: "orange",
                                                    }}
                                                >
                                                    <Box display={'flex'} flexDir={'row'}>
                                                        <IoIosNotifications
                                                            fontSize={"22px"}
                                                        />
                                                        {transSelector.trans.length &&
                                                            authSelector.id ? (
                                                            <sup>
                                                                <Box
                                                                    fontSize={
                                                                        "11px"
                                                                    }
                                                                    backgroundColor={
                                                                        "#EF144A"
                                                                    }
                                                                    borderRadius={
                                                                        "50%"
                                                                    }
                                                                    m={'-2px -9px 0px -8px'}
                                                                    p={'7px 6px 8px 5px'}
                                                                    color={"white"}
                                                                    fontWeight={700}
                                                                >
                                                                    {StatusOrderActive.length + unpaidTransaction.length}
                                                                </Box>
                                                            </sup>
                                                        ) : null}
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            bgColor={"#E5F9F6"}
                                            width={"310px"}
                                            height={"270px"}
                                            borderRadius={"20px"}
                                        >
                                            <Box
                                                boxShadow={
                                                    "rgba(0, 0, 0, 0.05) 0px 3px 8px"
                                                }
                                            >
                                                <PopoverHeader
                                                    display={"flex"}
                                                    justifyContent="space-between"
                                                    pt={"10px"}
                                                    pb={"10px"}
                                                >
                                                    <Text fontSize={"17px"}>
                                                        Notification
                                                    </Text>
                                                    <Box fontSize={"21px"}>
                                                        <IoIosAlert />
                                                    </Box>
                                                </PopoverHeader>
                                            </Box>
                                            <PopoverBody>
                                                <Box
                                                    display={"flex"}
                                                    justifyContent={
                                                        "space-between"
                                                    }
                                                    pb={"7px"}
                                                    pt={"5px"}
                                                >
                                                    <Text
                                                        fontSize={"15px"}
                                                        fontWeight={600}
                                                        ml={"25px"}
                                                        fontFamily={
                                                            "Open Sauce One,Nunito Sans, sans-serif"
                                                        }
                                                    >
                                                        Transaction
                                                    </Text>
                                                    <Link to={"/transaction-list"}>
                                                        <Text
                                                            color={"#F7931E"}
                                                            fontSize={"12px"}
                                                            mt={"10px"}
                                                            mb={"-5px"}
                                                            fontFamily={
                                                                "Open Sauce One,Nunito Sans, sans-serif"
                                                            }
                                                        >
                                                            See All
                                                        </Text>
                                                    </Link>
                                                </Box>
                                                <Box
                                                    display={"flex"}
                                                    dir={"row"}
                                                    justifyContent={""}
                                                >
                                                    <Box
                                                        width={"164px"}
                                                        bgColor={"#F7931E"}
                                                        h={"3px"}
                                                        mb={"7px"}
                                                    />
                                                    <Box
                                                        width={"164px"}
                                                        bgColor={"#0095DA"}
                                                        h={"3px"}
                                                        mb={"7px"}
                                                    />
                                                </Box>
                                                <Box pl={"8px"} pr={"8px"} mt={'4px'}>
                                                    <Box
                                                        _hover={{
                                                            bgColor: "#f3f4f5"
                                                        }}
                                                        display={'flex'}
                                                        w={'284px'}
                                                        flexDir={'row'}
                                                        justifyContent={'space-between'}
                                                        border={'1px solid #99d5f0'}
                                                        borderRadius={'10px'}
                                                        p={'5px 8px 5px 8px'}
                                                        alignItems={'center'}
                                                        ml={'-8px'}
                                                        onClick={() => navigate('/transaction/payment-list')}>
                                                        <Text
                                                            color={'#31353BAD'}
                                                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                                            fontSize={"11px"}
                                                            fontWeight={400}
                                                        >
                                                            Waiting For Payment
                                                        </Text>
                                                        <Text
                                                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                                            fontWeight={500}
                                                            textAlign={'center'}
                                                            borderRadius={'8px'}
                                                            color={'#fff'}
                                                            bgColor={unpaidTransaction.length === 0 ? null : '#ef144a'}
                                                            p={'0px 1px'}
                                                            fontSize={'10px '}
                                                            w={'15px'}
                                                        >
                                                            {unpaidTransaction.length === 0 ? null : unpaidTransaction.length}
                                                        </Text>
                                                    </Box>
                                                    <Grid
                                                        templateColumns="repeat(4, 1fr)"
                                                        gap={"4px"}
                                                        mt={"19px"}
                                                        display={"flex"}
                                                        justifyContent={
                                                            "space-between"
                                                        }
                                                    >
                                                        <GridItem
                                                            w="70px"
                                                            h="10"
                                                            alignItems={
                                                                "center"
                                                            }
                                                            onClick={goToAwaitingConfirmation}
                                                        >
                                                            <Box display={'flex'}>
                                                                <Image
                                                                    margin={"auto"}
                                                                    minW={"35px"}
                                                                    minH={"35px"}
                                                                    h={'35px'}
                                                                    w={'35px'}
                                                                    maxH={'35px'}
                                                                    maxW={'35px'}
                                                                    src={status1}
                                                                    ml={'17px'}
                                                                />
                                                                {!AwaitingConfirmation.length ? null : (
                                                                    <sup>
                                                                        <Box
                                                                            fontSize={
                                                                                "11px"
                                                                            }
                                                                            backgroundColor={
                                                                                "#EF144A"
                                                                            }
                                                                            borderRadius={
                                                                                "50%"
                                                                            }
                                                                            m={'3px 11px 0px -8px'}
                                                                            p={'6px 5px 8px 5px'}
                                                                            color={"white"}
                                                                            fontWeight={700}
                                                                        >
                                                                            {AwaitingConfirmation.length}
                                                                        </Box>
                                                                    </sup>
                                                                )}
                                                            </Box>
                                                            <Text
                                                                mt={"8px"}
                                                                textAlign={
                                                                    "center"
                                                                }
                                                                fontSize={
                                                                    "12px"
                                                                }
                                                                fontWeight={400}
                                                                fontFamily={
                                                                    "Open Sauce One,Nunito Sans, sans-serif"
                                                                }
                                                            >
                                                                Awaiting
                                                                Confirmation
                                                            </Text>
                                                        </GridItem>
                                                        <GridItem
                                                            w="60px"
                                                            h="10"
                                                            onClick={goToProcessed}
                                                        >
                                                            <Box display={'flex'}>
                                                                <Image
                                                                    mt={"8px"}
                                                                    margin={"auto"}
                                                                    minW={"35px"}
                                                                    minH={"35px"}
                                                                    h={'35px'}
                                                                    w={'35px'}
                                                                    maxH={'35px'}
                                                                    maxW={'35px'}
                                                                    src={status2}
                                                                    ml={'13px'}
                                                                />
                                                                {!Processed.length ? null : (
                                                                    <sup>
                                                                        <Box
                                                                            fontSize={
                                                                                "11px"
                                                                            }
                                                                            backgroundColor={
                                                                                "#EF144A"
                                                                            }
                                                                            borderRadius={
                                                                                "50%"
                                                                            }
                                                                            m={'3px 6px 0px -8px'}
                                                                            p={'6px 5px 8px 5px'}
                                                                            color={"white"}
                                                                            fontWeight={700}
                                                                        >
                                                                            {Processed.length}
                                                                        </Box>
                                                                    </sup>
                                                                )}
                                                            </Box>
                                                            <Text
                                                                mt={"8px"}
                                                                textAlign={
                                                                    "center"
                                                                }
                                                                fontSize={
                                                                    "12px"
                                                                }
                                                                fontWeight={400}
                                                                fontFamily={
                                                                    "Open Sauce One,Nunito Sans, sans-serif"
                                                                }
                                                            >
                                                                Processed
                                                            </Text>
                                                        </GridItem>
                                                        <GridItem
                                                            w="60px"
                                                            h="10"
                                                            onClick={goToShipping}
                                                        >
                                                            <Box display={'flex'}>
                                                                <Image
                                                                    margin={"auto"}
                                                                    src={status4}
                                                                    minW={"40px"}
                                                                    minH={"38px"}
                                                                    h={'40px'}
                                                                    w={'38px'}
                                                                    maxH={'40px'}
                                                                    maxW={'38px'}
                                                                    ml={'8px'}
                                                                    mt={'-3px'}
                                                                />
                                                                {!Shipping.length ? null : (
                                                                    <sup>
                                                                        <Box
                                                                            fontSize={
                                                                                "11px"
                                                                            }
                                                                            backgroundColor={
                                                                                "#EF144A"
                                                                            }
                                                                            borderRadius={
                                                                                "50%"
                                                                            }
                                                                            m={'5px 5px 0px -10px'}
                                                                            p={'6px 5px 8px 5px'}
                                                                            color={"white"}
                                                                            fontWeight={700}
                                                                        >
                                                                            {Shipping.length}
                                                                        </Box>
                                                                    </sup>
                                                                )}
                                                            </Box>
                                                            <Text
                                                                mt={"6px"}
                                                                textAlign={
                                                                    "center"
                                                                }
                                                                fontSize={
                                                                    "12px"
                                                                }
                                                                fontWeight={400}
                                                                fontFamily={
                                                                    "Open Sauce One,Nunito Sans, sans-serif"
                                                                }
                                                            >
                                                                Shipping
                                                            </Text>
                                                        </GridItem>
                                                        <GridItem
                                                            w="60px"
                                                            h="10"
                                                            onClick={goToDelivered}
                                                        >
                                                            <Box display={'flex'}>
                                                                <Image
                                                                    margin={"auto"}
                                                                    src={status3}
                                                                    minW={"40px"}
                                                                    minH={"37px"}
                                                                    h={'40px'}
                                                                    w={'37px'}
                                                                    maxH={'40px'}
                                                                    maxW={'37px'}
                                                                    mr={'-3px'}
                                                                    mt={'-1px'}
                                                                />
                                                                <sup>
                                                                    <Box
                                                                        fontSize={"11px"}
                                                                        bgColor={!Delivered.length ? "transparent" : "#EF144A"}
                                                                        borderRadius={"50%"}
                                                                        m={'5px 8px 0px -10px'}
                                                                        p={'6px 5px 8px 5px'}
                                                                        color={!Delivered.length ? "transparent" : "white"}
                                                                        fontWeight={700}
                                                                    >
                                                                        {Shipping.length}
                                                                    </Box>
                                                                </sup>
                                                            </Box>
                                                            <Text
                                                                mt={"4px"}
                                                                textAlign={
                                                                    "center"
                                                                }
                                                                fontSize={
                                                                    "12px"
                                                                }
                                                                fontWeight={400}
                                                                fontFamily={
                                                                    "Open Sauce One,Nunito Sans, sans-serif"
                                                                }
                                                            >
                                                                Delivered
                                                            </Text>
                                                        </GridItem>
                                                    </Grid>
                                                </Box>
                                                <Box
                                                    width={"100%"}
                                                    bgColor={"#e5e7e9"}
                                                    h={"5px"}
                                                    mt={"50px"}
                                                />
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
                                    borderRight="2px solid #e0e0e0"
                                    paddingRight={"10px"}
                                    color="#6c727c"
                                >
                                    <Popover trigger="hover">
                                        <PopoverTrigger>
                                            <Link to="/cart">
                                                <Button
                                                    ml={"10px"}
                                                    bgColor={"inherit"}
                                                    fontSize={"2xl"}
                                                    _hover={{
                                                        bgColor: "#A5D8F8",
                                                        color: "orange",
                                                    }}
                                                    mr={"10px"}
                                                    p={2}
                                                >
                                                    <IoMdCart
                                                        fontSize={"22px"}
                                                    />
                                                    {cartSelector.cart.length &&
                                                        authSelector.id ? (
                                                        <sup>
                                                            <Box
                                                                fontSize={
                                                                    "11px"
                                                                }
                                                                backgroundColor={
                                                                    "#EF144A"
                                                                }
                                                                borderRadius={
                                                                    "50%"
                                                                }
                                                                m={'-2px -8px 0px -8px'}
                                                                p={'7px 6px 8px 5px'}
                                                                color={"white"}
                                                                fontWeight={700}
                                                            >
                                                                {
                                                                    totalCartQuantity
                                                                }
                                                            </Box>
                                                        </sup>
                                                    ) : null}
                                                </Button>
                                            </Link>
                                        </PopoverTrigger>
                                        {cartSelector.cart.length ? (
                                            <>
                                                <PopoverContent
                                                    bgColor={"#E5F9F6"}
                                                    w={"405px"}
                                                    borderRadius={"12px"}
                                                >
                                                    <PopoverBody>
                                                        <Box
                                                            display={"flex"}
                                                            justifyContent="space-between"
                                                            mt={"8px"}
                                                            mb={"12px"}
                                                            pl={"2px"}
                                                            pr={"2px"}
                                                        >
                                                            <Text
                                                                // fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                                                                fontSize={
                                                                    "15px"
                                                                }
                                                                fontWeight={600}
                                                            >
                                                                Total (
                                                                {
                                                                    totalCartQuantity
                                                                }
                                                                )
                                                            </Text>
                                                            <Link to="/cart">
                                                                <Text
                                                                    color="#0095DA"
                                                                    fontFamily={
                                                                        "Open Sauce One,Nunito Sans, sans-serif"
                                                                    }
                                                                    fontWeight={
                                                                        700
                                                                    }
                                                                    fontSize={
                                                                        "13px"
                                                                    }
                                                                    mr={"5px"}
                                                                >
                                                                    {" "}
                                                                    Cart
                                                                </Text>
                                                            </Link>
                                                        </Box>
                                                        <Box
                                                            h={"1px"}
                                                            bgColor={"#F7931E"}
                                                            mb={"-6px"}
                                                            pb={"2px"}
                                                        />
                                                        <Box
                                                            h={"1px"}
                                                            bgColor={
                                                                "transparent"
                                                            }
                                                            pb={"4px"}
                                                            mt={"2px"}
                                                        />
                                                        <Box
                                                            pt={"2px"}
                                                            overflow={"auto"}
                                                            maxH={"335px"}
                                                            cursor={"pointer"}
                                                        >
                                                            {renderCartNavbar()}
                                                        </Box>
                                                    </PopoverBody>
                                                </PopoverContent>
                                            </>
                                        ) : (
                                            <>
                                                <PopoverContent
                                                    bgColor={"#E5F9F6"}
                                                >
                                                    <PopoverBody>
                                                        <Box>
                                                            <Image
                                                                p="10px"
                                                                margin={
                                                                    "0 auto"
                                                                }
                                                                width={"200px"}
                                                                src={emptyCart}
                                                            />
                                                            <Text
                                                                color={
                                                                    "#393d43"
                                                                }
                                                                textAlign="center"
                                                                fontWeight={
                                                                    "bold"
                                                                }
                                                            >
                                                                Hey your
                                                                shopping cart is
                                                                empty!
                                                            </Text>
                                                            <Text
                                                                mt={"5px"}
                                                                color={
                                                                    "#919396"
                                                                }
                                                                textAlign="center"
                                                                fontSize={
                                                                    "12px"
                                                                }
                                                                mb={"5px"}
                                                            >
                                                                Being idle is no
                                                                fun. Let's fill
                                                                it with your
                                                                dream items!
                                                            </Text>
                                                        </Box>
                                                    </PopoverBody>
                                                </PopoverContent>
                                            </>
                                        )}
                                    </Popover>
                                </Box>
                            </Link>
                            {/* navbar user login */}
                            {authSelector.username ? (
                                <Box
                                    display={{ lg: "flex", base: "none" }}
                                    mr="2"
                                    ml="1"
                                    cursor={"pointer"}
                                >
                                    <Popover trigger={"hover"}>
                                        <PopoverTrigger>
                                            <Box
                                                display={"flex"}
                                                my="auto"
                                                minW={"113px"}
                                                maxW="200px"
                                                paddingLeft="5px"
                                                paddingRight={"5px"}
                                                _hover={{
                                                    bgColor: "#A5D8F8",
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
                                                    src={`${apiImg}/${authSelector.profile_picture}`}
                                                />
                                                <Text
                                                    my="auto"
                                                    padding={"8px"}
                                                    textTransform={"capitalize"}
                                                >
                                                    {
                                                        authSelector.username.split(
                                                            " "
                                                        )[0]
                                                    }
                                                </Text>
                                            </Box>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            w={"300px"}
                                            mr="4"
                                            bgColor={"#E5F9F6"}
                                        >
                                            <PopoverBody>
                                                <Box
                                                    p="2 4"
                                                    bgColor={"#E5F9F6"}
                                                >
                                                    <Box
                                                        boxShadow={
                                                            "rgba(0, 0, 0, 0.24) 0px 3px 8px"
                                                        }
                                                        display={"flex"}
                                                        my="auto"
                                                        padding="6px 12px"
                                                        borderRadius={"5px"}
                                                        bgColor={"#E5F9F6"}
                                                        cursor={"pointer"}
                                                    >
                                                        <Avatar
                                                            name={
                                                                authSelector.username
                                                            }
                                                            mr={2}
                                                            width={"50px"}
                                                            height="50px"
                                                            my="auto"
                                                            src={`${apiImg}/${authSelector.profile_picture}`}
                                                        />
                                                        <Text
                                                            my="auto"
                                                            padding={"8px"}
                                                            fontSize="16px"
                                                            fontWeight={"bold"}
                                                            color={
                                                                "rgba(0,0,0,.54)"
                                                            }
                                                            textTransform={
                                                                "capitalize"
                                                            }
                                                        >
                                                            {
                                                                authSelector.username
                                                            }
                                                        </Text>
                                                    </Box>

                                                    <Box
                                                        fontSize={"14px"}
                                                        p="10px 0"
                                                    >
                                                        <Link to="/user/profile">
                                                            <Box
                                                                _hover={{
                                                                    bgColor:
                                                                        "#A5D8F8",
                                                                    borderRadius:
                                                                        "7px",
                                                                }}
                                                                p={"5px 4px"}
                                                            >
                                                                <Text>
                                                                    Profile
                                                                </Text>
                                                            </Box>
                                                        </Link>

                                                        <Link
                                                            to={"/transaction-list"}
                                                        >
                                                            <Box
                                                                _hover={{
                                                                    bgColor:
                                                                        "#A5D8F8",
                                                                    borderRadius:
                                                                        "7px",
                                                                }}
                                                                p={"5px 4px"}
                                                            >
                                                                <Text>
                                                                    Transaction-list
                                                                </Text>
                                                            </Box>
                                                        </Link>
                                                        {location.pathname ===
                                                            "/cart" ||
                                                            location.pathname ===
                                                            "/transaction-list" ||
                                                            location.pathname ===
                                                            "/user/profile" ||
                                                            location.pathname ===
                                                            "/user/profile/change-password" ||
                                                            location.pathname ===
                                                            "/user/profile/address" ? (
                                                            <Link
                                                                to={"/login"}
                                                                replace
                                                                state={{
                                                                    from: location,
                                                                }}
                                                            >
                                                                <Box
                                                                    display={
                                                                        "flex"
                                                                    }
                                                                    _hover={{
                                                                        bgColor:
                                                                            "#A5D8F8",
                                                                        borderRadius:
                                                                            "7px",
                                                                    }}
                                                                    p={
                                                                        "5px 4px"
                                                                    }
                                                                    b="0"
                                                                    onClick={
                                                                        logoutBtnHandler
                                                                    }
                                                                >
                                                                    <Text>
                                                                        Logout
                                                                    </Text>
                                                                    <Box
                                                                        my="auto"
                                                                        ml="1"
                                                                    >
                                                                        <BiLogOutCircle />
                                                                    </Box>
                                                                </Box>
                                                            </Link>
                                                        ) : (
                                                            <Box
                                                                display={"flex"}
                                                                _hover={{
                                                                    bgColor:
                                                                        "#A5D8F8",
                                                                    borderRadius:
                                                                        "7px",
                                                                }}
                                                                p={"5px 4px"}
                                                                b="0"
                                                                onClick={
                                                                    logoutBtnHandler
                                                                }
                                                            >
                                                                <Text>
                                                                    Logout
                                                                </Text>
                                                                <Box
                                                                    my="auto"
                                                                    ml="1"
                                                                >
                                                                    <BiLogOutCircle />
                                                                </Box>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </Box>
                            ) : (
                                // navbar if user not login yet
                                <Box
                                    gap="2"
                                    display={{
                                        lg: "flex",
                                        md: "flex",
                                        base: "none",
                                    }}
                                    pl={"15px"}
                                    mr={"0px"}
                                >
                                    <Link
                                        to={"/login"}
                                        replace
                                        state={{ from: location }}
                                    >
                                        <Box width={"73px"}>
                                            <Button
                                                _hover={"null"}
                                                height="32px"
                                                border={"1px solid #0095DA"}
                                                bgColor={"white"}
                                                color={"#0095DA"}
                                                fontSize="12px"
                                                fontWeight={"bold"}
                                                borderRadius={"12px"}
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
                                                borderRadius={"12px"}
                                                bgColor={"#0095DA"}
                                                border={"1px solid #0095DA"}
                                                color={"#fff"}
                                                fontWeight={"bold"}
                                                fontSize="12px"
                                                textAlign="center"
                                                mx={"auto"}
                                                w={"65px"}
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
            </Box>
        </>
    )
}

export default Navbar
