import { Box, Button, Grid, GridItem, Image, Text, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast, Popover, PopoverTrigger, PopoverContent, PopoverBody } from "@chakra-ui/react"
import { BsHandbagFill } from "react-icons/bs"
import moment from "moment"
import TransactionItemDetail from "./TransactionItemDetail"
import ProductBuyAgain from "./ProductBuyAgain"
import { Link } from "react-router-dom"
import { GoPackage } from "react-icons/go"
import { Ri24HoursFill } from "react-icons/ri"
import { axiosInstance } from "../../api"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useState } from "react"
// import ModalCancelTransaction from "./ModalCancelTransaction"

const TransactionListItem = ({ transactionId, fetchMyTransactionList, shippingFee, transactionAddress, totalQuantity, paymentMethod, paymentDate, orderStatusName, transactionName, totalPrice, transactionItems, courirDuration }) => {

    const [reason, setReason] = useState(null)
    const [informationOrder, setInformationOrder] = useState(null)
    const [informationShipping, setInformationShipping] = useState(null)
    const [inputText, setInputText] = useState("")
    const [cancelReason, setCancelReason] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const {
        isOpen: buyIsOpen,
        onOpen: buyOnOpen,
        onClose: buyOnClose
    } = useDisclosure()

    const {
        isOpen: doneIsOpen,
        onOpen: doneOnOpen,
        onClose: doneOnClose
    } = useDisclosure()


    const {
        isOpen: cancelIsOpen,
        onOpen: cancelOnOpen,
        onClose: cancelOnClose
    } = useDisclosure()

    const finishOrderBtn = async () => {
        try {
            const response = await axiosInstance.patch(`transactions/finish-order/${transactionName}`)
            doneOnClose()
            toast({
                title: "Your transaction complete",
                description: response.data.message,
                status: "success",
            })
            fetchMyTransactionList()
        } catch (err) {
            console.log(err)
        }
    }

    const courir = courirDuration.split("at")[0]
    const shippingDate = courirDuration.split("at")[1]

    const cancelPaidTransaction = async () => {
        try {
            axiosInstance.patch(`/transactions/cancel-paid-transaction/${transactionName}`)

            toast({
                title: "Success",
                description: "You have successfully canceled this transaction",
                status: "success",
            })
            fetchMyTransactionList()
            cancelOnClose()
        } catch (err) {
            console.log(err)
        }
    }

    const renderTransactionItems = () => {
        return (
            <>
                <Box
                    h={'80px'}
                    display={'flex'}
                    flexDir={'row'}
                    cursor={'default'}
                >
                    <Image
                        w={'60px'}
                        h={'60px'}
                        borderRadius={'6px'}
                        src={transactionItems[0].Product.Image_Urls[0].image_url}
                    />
                    <Box
                        pl={'16px'}
                    >
                        <Link to={`/product/${transactionItems[0].Product.id}/${transactionItems[0].Product.product_name}`}>
                            <Text
                                color={'31353BF5'}
                                fontSize={'14px'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                m={'0px 0px 3px'}
                                lineHeight={'16px'}
                                fontWeight={700}
                                letterSpacing={'0px'}
                                whiteSpace={'nowrap'}
                                overflow={'hidden'}
                                textOverflow={'ellipsis'}
                                cursor={'point'}
                                w={'439px'}
                            >
                                {transactionItems[0].Product.product_name}
                            </Text>
                        </Link>
                        <Text
                            color={'#31353BAD'}
                            fontSize={'12px'}
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                            m={'0px 0px 3px'}
                            fontWeight={400}
                            lineHeight={'20px'}
                            letterSpacing={'0px'}
                        >
                            {transactionItems[0].quantity} {transactionItems[0].quantity > 1 ? "items" : "item"} x {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(transactionItems[0].Product.price).split(",")[0]}
                        </Text>
                        <Text
                            fontSize={'12px'}
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                            lineHeight={'20px'}
                            letterSpacing={'0px'}
                            color={'#31353BAD'}
                            fontWeight={400}
                            m={'8px 0px 0px'}
                            cursor={'pointer'}
                            onClick={() => onOpen()}
                        >
                            {transactionItems.length > 1 ? `+${transactionItems.length - 1} more product` : null}
                        </Text>
                    </Box>
                </Box>
            </>
        )
    }

    const renderProductDetail = () => {
        return transactionItems.map((val) => {
            return (
                <TransactionItemDetail
                    key={val.id.toString()}
                    productImage={val.Product.Image_Urls[0].image_url}
                    productName={val.Product.product_name}
                    price={val.Product.price}
                    quantity={val.quantity}
                    totalPrice={totalPrice}
                    shippingFee={shippingFee}
                    orderStatusName={orderStatusName}
                    productId={val.Product.id}
                />
            )
        })
    }

    const renderProductBuyAgain = () => {
        return transactionItems.map((val) => {
            return (
                <ProductBuyAgain
                    key={val.id.toString()}
                    productImage={val.Product.Image_Urls[0].image_url}
                    productName={val.Product.product_name}
                    price={val.Product.price}
                    productId={val.Product.id}
                />
            )
        })
    }

    const closeCancelBtn = () => {
        setReason(null)
        setInformationOrder(null)
        setInformationShipping(null)
        setCancelReason("")
        cancelOnClose()
    }

    const changeOrderBtnHandler = () => {
        setInformationShipping(null)
        setInputText("")
        setReason("I want to change order")
        if (reason !== "I want to change order") {
            setCancelReason("")
        }
    }

    const changeShippingBtnHandler = () => {
        setInformationOrder(null)
        setInputText("")
        setReason("I want to change shipping")
        if (reason !== "I want to change shipping") {
            setCancelReason("")
        }
    }

    const changeOtherReasonBtnHandler = () => {
        setInformationOrder(null)
        setInformationShipping(null)
        setReason("Other reason")
        if (inputText.length < 16) {
            setCancelReason("")
        }
    }

    const formChangeHandler = ({ target }) => {
        const { value } = target

        setInputText(value)
        setCancelReason(value)
    }

    const receiptNo = `2208${moment(paymentDate).format("YYMMDD")}${transactionId}`

    return (
        <>
            <Box
                m={'0px 0px 16px'}
                p={'0px 16px'}
                cursor={'default'}
            >
                <Box
                    w={'100%'}
                    p={'16px'}
                    borderRadius={'8px'}
                    boxShadow={'0 1px 6px 0 rgba(49,53,59,0.12)'}
                >
                    <Box
                        display={'flex'}
                        justifyContent={'flex-start'}
                        h={'22px'}
                        m={'0px 0px 15px'}
                        alignItems={'center'}
                    >
                        <BsHandbagFill style={{ marginRight: '10px', height: '22px', width: '22px', color: '#F7931E' }} />
                        <Text
                            color={'#31353BF5'}
                            fontSize={'12px'}
                            fontWeight={700}
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                            lineHeight={'20px'}
                            letterSpacing={'0px'}
                            marginRight={'10px'}
                        >
                            Purchased
                        </Text>
                        <Text
                            color={'#31353BF5'}
                            fontSize={'12px'}
                            fontWeight={400}
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                            lineHeight={'20px'}
                            letterSpacing={'0px'}
                            marginRight={'10px'}
                        >
                            {moment(paymentDate).format("D MMM YYYY")}
                        </Text>
                        <Text
                            display={'flex'}
                            alignItems={'center'}
                            fontWeight={700}
                            borderRadius={'3px'}
                            lineHeight={'16px'}
                            p={'0px 8px'}
                            h={'20px'}
                            fontSize={'11.429px'}
                            bgColor={orderStatusName === "Done" ? '#E5F9F6' : orderStatusName === "Cancelled" ? 'rgb(255, 234, 239)' : '#fff0b3'}
                            color={orderStatusName === "Done" ? '#0095DA' : orderStatusName === "Cancelled" ? '#EF144A' : '#F7931E'}
                            justifyContent={'center'}
                            mr={'10px'}
                        >
                            {orderStatusName}
                        </Text>
                        <Text
                            color={'#31353BAD'}
                            fontSize={'12px'}
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                            fontWeight={400}
                            lineHeight={'20px'}
                            letterSpacing={'0px'}
                        >
                            INV/{moment(paymentDate).format("YYYYMMDD")}/{transactionName}
                        </Text>
                    </Box>
                    <Grid templateColumns='3.95fr 1.05fr' w={'784px'} gap={0}>
                        <GridItem>
                            <Box display={'flex'} flexDir={'column'}>
                                {renderTransactionItems()}
                            </Box>
                        </GridItem>
                        <GridItem>
                            <Box pl={'24px'} h={'60px'} w={'180px'} display={'flex'} my={'auto'} pt={'10px'} pb={'10px'} flexDir={'column'} borderLeft={'1px solid #e5e7e9'}>
                                <Text
                                    color={'#31353BAD'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={400}
                                    lineHeight={'20px'}
                                    letterSpacing={'0px'}
                                >
                                    Total Purchased
                                </Text>
                                <Text
                                    color={'#31353BF5'}
                                    fontSize={'14px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={700}
                                    lineHeight={'20px'}
                                    letterSpacing={'0px'}
                                >
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(totalPrice).split(",")[0]}
                                </Text>
                            </Box>
                        </GridItem>
                    </Grid>
                    <Box display={'flex'} justifyContent={'flex-end'} mt={'9px'} h={'44px'}>
                        <Box display={'flex'} flexDir={'row'} justifyContent={'space-evenly'} columnGap={'16px'}>
                            <Text
                                fontSize={'12px'}
                                m={'12px 0px'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                color={'#0095DA'}
                                fontWeight={700}
                                lineHeight={'20px'}
                                letterSpacing={'0px'}
                                cursor={'pointer'}
                                onClick={() => onOpen()}
                            >
                                Transaction Detail
                            </Text>
                            {orderStatusName === "Done" ? (
                                <Button
                                    h={'40px'}
                                    w={'140px'}
                                    color={'#fff'}
                                    fontSize={'12px'}
                                    fontFamily={'Open Sauce One, sans-serif'}
                                    fontWeight={700}
                                    lineHeight={'24px'}
                                    bgColor={'#0095DA'}
                                    _hover={{
                                        bgColor: "#0370A2",
                                    }}
                                    _active={{
                                        bgColor: "#0370A2",
                                    }}
                                    onClick={() => buyOnOpen()}
                                >
                                    Buy Again
                                </Button>
                            ) :
                                orderStatusName === "Delivered" ? (
                                    <Button
                                        h={'40px'}
                                        w={'140px'}
                                        color={'#fff'}
                                        fontSize={'12px'}
                                        fontFamily={'Open Sauce One, sans-serif'}
                                        fontWeight={700}
                                        lineHeight={'24px'}
                                        bgColor={'#F7931E'}
                                        _hover={{
                                            bgColor: "#D6882B",
                                        }}
                                        _active={{
                                            bgColor: "#D6882B",
                                        }}
                                        onClick={() => doneOnOpen()}
                                    >
                                        Done
                                    </Button>
                                ) : null
                            }


                            {orderStatusName !== "Awaiting Confirmation" ? (
                                <Button
                                    h={'40px'}
                                    w={'42.98px'}
                                    bgColor={'#fff'}
                                    p={'0px 12px'}
                                    border={'1px solid #0095DA'}
                                    borderRadius={'8px'}
                                    _hover={'none'}
                                >
                                    <Box
                                        fontSize={'23px'}
                                        fontWeight={700}
                                        fontFamily={'Open Sauce One, sans-serif'}
                                        color={'#9FA6B0'}
                                        display={'flex'}
                                        alignContent={'center'}
                                        h={'40px'}
                                        _hover={'none'}
                                    >
                                        ...
                                    </Box>
                                </Button>
                            ) : (
                                <Popover>
                                    <PopoverTrigger>
                                        <Button
                                            h={'40px'}
                                            w={'42.98px'}
                                            bgColor={'#fff'}
                                            p={'0px 12px'}
                                            border={'1px solid #0095DA'}
                                            borderRadius={'8px'}
                                            _hover={'none'}
                                        >
                                            <Box
                                                fontSize={'23px'}
                                                fontWeight={700}
                                                fontFamily={'Open Sauce One, sans-serif'}
                                                color={'#9FA6B0'}
                                                display={'flex'}
                                                alignContent={'center'}
                                                h={'40px'}
                                                _hover={'none'}
                                            >
                                                ...
                                            </Box>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent _hover={{ bgColor: '#E5F9F6' }} cursor={'pointer'} _focus={'#fff'} _active={'none'} mr={'145px'} mt={'-5px'} w={'173.61px'} maxH={'40px'} onClick={() => cancelOnOpen()} boxShadow={'0 1px 6px 0 rgba(49,53,59,0.12)'} border={'none'} >
                                        <PopoverBody
                                            p={'10px 15px'}
                                        >
                                            <Box display={'flex'} flexDir={'row'} justifyContent={'flex-start'} alignItems={'center'} alignContent={'center'} onClick={() => cancelOnOpen()}>
                                                <Box w={'20px'} h={'20px'}>
                                                    <RiDeleteBin6Line style={{ color: "#8d96aa", width: "17.58px", maxWidth: "17.58px", minWidth: "17.58px", height: "19.26px", maxHeight: "19.26px", minHeight: "19.26px" }} />
                                                </Box>
                                                <Text
                                                    fontSize={'14px'}
                                                    fontFamily={'Open Sauce One, sans-serif'}
                                                    color={'#0000008A'}
                                                    lineHeight={'1.15'}
                                                    pl={'2px'}
                                                >
                                                    Cancel Transaction
                                                </Text>
                                            </Box>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            )}

                        </Box>
                    </Box>
                </Box>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="532.54px" mt={'99px'} borderRadius={'12px'}>
                    <ModalHeader borderBottom={'1px solid #e5e7e9'} pt={'32px'} pb={'16px'}>
                        <Box >
                            <Text
                                color={'31353BF5'}
                                fontSize={'20px'}
                                fontWeight={700}
                                lineHeight={'26px'}
                                letterSpacing={'-0.1px'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                textAlign={'center'}
                            >
                                Transaction Detail
                            </Text>
                        </Box>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody p={'0px 0px 0px 0px'} maxHeight={"530px"} overflowY={"auto"} overflowX={'hidden'} scrollBehavior={'unset'}>
                        <Box h={'146.86px'} p={'24px 32px'} borderBottom={'8px solid #f3f4f5'}>
                            <Box
                                m={'0px 0px 12px'}
                                p={'0px 0px 13px'}
                                borderBottom={'thin dashed #E5E7E9'}
                                fontSize={'14px'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                fontWeight={700}
                                lineHeight={'18px'}
                                letterSpacing={'0px'}
                                display={'flex'}
                                justifyContent={'space-between'}
                            >
                                <Text
                                >
                                    Status :
                                </Text>
                                <Text color={orderStatusName === "Done" ? '#0095DA' : orderStatusName === "Cancelled" ? '#EF144A' : '#F7931E'}>
                                    {orderStatusName}
                                </Text>
                            </Box>

                            <Box display={'flex'} justifyContent={'space-between'} flexDir={'row'} m={'0px 0px 8px'}>
                                <Text
                                    color={'#31353BAD'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={400}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}
                                >
                                    Invoice No.
                                </Text>
                                <Text
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={700}
                                    lineHeight={'20px'}
                                    letterSpacing={'0px'}
                                    color={"31353BF5"}
                                >
                                    INV/{moment(paymentDate).format("YYYYMMDD")}/{transactionName}
                                </Text>
                            </Box>
                            <Box
                                display={'flex'} justifyContent={'space-between'} flexDir={'row'}
                            >
                                <Text
                                    color={'#31353BAD'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={400}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}
                                >
                                    Payment Date
                                </Text>
                                <Text
                                    color={'#31353BF5'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={400}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}

                                >
                                    {moment(paymentDate).format("DD MMMM YYYY, HH:mm")} WIB
                                </Text>
                            </Box>
                        </Box>
                        <Box pr={'32px'} pl={'32px'} pt={'24px'} pb={'16px'} borderBottom={'8px solid #f3f4f5'}>
                            <Text
                                color={'#31353BF5'}
                                fontSize={'14px'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                fontWeight={700}
                                lineHeight={'18px'}
                                letterSpacing={'0px'}
                                m={'0px 0px 13px'}
                            >
                                Product Detail
                            </Text>
                            {renderProductDetail()}
                        </Box>
                        <Box p={'23px 32px'} borderBottom={'8px solid #f3f4f5'}>
                            <Text
                                color={'#31353BF5'}
                                fontSize={'14px'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                lineHeight={'18x'}
                                letterSpacing={'0px'}
                                fontWeight={700}
                                mb={'13px'}
                            >
                                Shipping Info
                            </Text>
                            <Box display={'flex'} justifyContent={'flex-start'} flexDir={'row'} alignItems={'flex-start'} mb={'13px'}>
                                <Text
                                    minW={'78.74px'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    color={'#31353BAD'}
                                    fontWeight={400}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}
                                >
                                    Courir
                                </Text>
                                <Text m={'-4px 14px 0px 0px'} fontWeight={500} alignItems={'flex-start'} fontSize={'16px'} fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"} color={'#0000008A'}>
                                    :
                                </Text>
                                <Box display={'flex'} flexDir={'column'}>
                                    <Text
                                        fontSize={'12px'}
                                        fontFamily={"Open Sauce One, sans-serif"}
                                        color={'#31353BF5'}
                                        fontWeight={400}
                                        lineHeight={'18px'}
                                        letterSpacing={'0px'}
                                    >
                                        {`Tiki - ${courir}`}
                                    </Text>
                                    {orderStatusName === "Done" || orderStatusName === "Delivered" ? null : (
                                        <Text
                                            fontSize={'12px'}
                                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                            color={'#31353BF5'}
                                            fontWeight={700}
                                            lineHeight={'16px'}
                                            letterSpacing={'0px'}
                                        >
                                            {`(Estimate arrival ${shippingDate})`}
                                        </Text>
                                    )}
                                </Box>
                            </Box>
                            {orderStatusName !== "Done" && orderStatusName !== "Delivered" ? null : (
                                <Box display={'flex'} justifyContent={'flex-start'} flexDir={'row'} alignItems={'flex-start'} mb={'13px'}>
                                    <Text
                                        minW={'78.74px'}
                                        fontSize={'12px'}
                                        fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                        color={'#31353BAD'}
                                        fontWeight={400}
                                        lineHeight={'18px'}
                                        letterSpacing={'0px'}
                                    >
                                        Receipt No.
                                    </Text>
                                    <Text m={'-4px 14px 0px 0px'} fontWeight={500} alignItems={'flex-start'} fontSize={'16px'} fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"} color={'#0000008A'}>
                                        :
                                    </Text>
                                    <Box display={'flex'} flexDir={'column'}>
                                        <Text
                                            fontSize={'12px'}
                                            fontFamily={"Open Sauce One, sans-serif"}
                                            color={'#31353BF5'}
                                            fontWeight={400}
                                            lineHeight={'18px'}
                                            letterSpacing={'0px'}
                                        >
                                            {`SPD${receiptNo}`}
                                        </Text>
                                    </Box>
                                </Box>
                            )}
                            <Box display={'flex'} justifyContent={'flex-start'} flexDir={'row'} alignItems={'flex-start'}>
                                <Text
                                    minW={'78.74px'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    color={'#31353BAD'}
                                    fontWeight={400}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}
                                >
                                    Address
                                </Text>
                                <Text m={'-4px 14px 0px 0px'} fontWeight={500} alignItems={'flex-start'} fontSize={'16px'} fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"} color={'#0000008A'}>
                                    :
                                </Text>
                                <Box display={'flex'} flexDir={'column'}>
                                    <Text
                                        fontSize={'12px'}
                                        fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                        color={'#31353BF5'}
                                        fontWeight={700}
                                        lineHeight={'18px'}
                                        letterSpacing={'0px'}
                                    >
                                        {transactionAddress.recipients_name}
                                    </Text>
                                    <Box
                                        fontSize={'12px'}
                                        fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                        color={'#31353BF5'}
                                        fontWeight={400}
                                        lineHeight={'18px'}
                                        letterSpacing={'0px'}
                                    >
                                        <Text
                                            fontSize={'12px'}
                                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                            color={'#31353BF5'}
                                            fontWeight={400}
                                            lineHeight={'18px'}
                                            letterSpacing={'0px'}
                                        >
                                            {transactionAddress.phone_number}
                                        </Text>
                                        <Text>
                                            {transactionAddress.full_address}
                                        </Text>
                                        <Text>
                                            {transactionAddress.districts}, {transactionAddress.city}, {transactionAddress.province}
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box p={'23px 32px'} borderBottom={'8px solid #f3f4f5'}>
                            <Text
                                mb={'13px'}
                                color={'#31353BF5'}
                                fontSize={'14px'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                fontWeight={700}
                                lineHeight={'18px'}
                                letterSpacing={'0px'}
                            >
                                Payment Detail
                            </Text>
                            <Box display={'flex'} justifyContent={'space-between'} mb={'8px'} pb={'12px'} borderBottom={'thin dashed #E5E7E9'}>
                                <Text
                                    color={'#31353BAD'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={400}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}
                                >
                                    Payment Method
                                </Text>
                                <Text
                                    color={'#31353BF5'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={400}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}
                                >
                                    {paymentMethod}
                                </Text>
                            </Box>
                            <Box display={'flex'} justifyContent={'space-between'} mb={'8px'}>
                                <Text
                                    color={'#31353BAD'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={400}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}
                                >
                                    Total Price ({totalQuantity} {totalQuantity > 1 ? "items" : "item"})
                                </Text>
                                <Text
                                    color={'#31353BF5'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={400}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}
                                >
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(totalPrice - 1000 - shippingFee).split(",")[0]}
                                </Text>
                            </Box>
                            <Box display={'flex'} justifyContent={'space-between'} mb={'8px'}>
                                <Text
                                    color={'#31353BAD'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={400}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}
                                >
                                    Total Shipping Fee
                                </Text>
                                <Text
                                    color={'#31353BF5'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={400}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}
                                >
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(shippingFee).split(",")[0]}
                                </Text>
                            </Box>
                            <Box display={'flex'} justifyContent={'space-between'} mb={'8px'}>
                                <Text
                                    color={'#31353BAD'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={400}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}
                                >
                                    Application Services Fee
                                </Text>
                                <Text
                                    color={'#31353BF5'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={400}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}
                                >
                                    Rp 1.000
                                </Text>
                            </Box>
                            <Box display={'flex'} justifyContent={'space-between'} mt={'12px'} pt={'12px'} borderTop={'thin dashed #E5E7E9'}>
                                <Text
                                    color={'#31353BF5'}
                                    fontSize={'14px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={'bold'}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}
                                >
                                    Total Payment
                                </Text>
                                <Text
                                    color={'#31353BF5'}
                                    fontSize={'14px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    fontWeight={'bold'}
                                    lineHeight={'18px'}
                                    letterSpacing={'0px'}
                                >
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(totalPrice).split(",")[0]}
                                </Text>
                            </Box>
                        </Box>
                    </ModalBody>
                    <ModalFooter />
                </ModalContent>
            </Modal>

            <Modal isOpen={buyIsOpen} onOpen={buyOnOpen} onClose={buyOnClose}>
                <ModalOverlay />
                <ModalContent mt={'200px'} maxW={'515.53px'} borderRadius={'10px'}>
                    <ModalCloseButton />
                    <ModalBody p={'32px'}>
                        <Text
                            m={'0px 0px 16px -8px'}
                            color={'#31353BF5'}
                            fontSize={'16px'}
                            fontWeight={700}
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                            lineHeight={'20px'}
                            letterSpacing={'0px'}
                        >
                            Buy Again
                        </Text>
                        {renderProductBuyAgain()}
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal isOpen={doneIsOpen} onOpen={doneOnOpen} onClose={doneOnClose} closeOnEsc={false}>
                <ModalOverlay />
                <ModalContent borderRadius={'8px'} maxW={'480px'} mt={'220px'} boxShadow={'0 1px 6px 0 rgba(49,53,59,0.12)'} p={'32px'}>
                    <ModalCloseButton />
                    <ModalBody p={'0px'} >
                        <Box>
                            <Text
                                color={'#31353BF5'}
                                fontSize={'20px'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                mb={'16px'}
                                fontWeight={700}
                                lineHeight={'26px'}
                                letterSpacing={'-0.1px'}
                                textAlign={'center'}
                            >
                                Complete this order?
                            </Text>
                            <Text
                                fontSize={'14px'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                color={'#31353BAD'}
                                m={'14px 0px'}
                                fontWeight={400}
                                lineHeight={'20px'}
                                letterSpacing={'0px'}
                                textAlign={'center'}
                            >
                                By clicking Complete, we will transfer the funds to the seller, and you might not be able to file a complaint.
                            </Text>
                        </Box>
                        <Box display={'flex'} justifyContent={'flex-start'} flexDir={'row'} mb={'16px'}>
                            <Box display={'flex'} minW={'48px'} h={'48px'} min={'48px'} justifyContent={'center'} alignItems={'center'} border={'1px solid #E5E7E9'} borderRadius={'8px'}>
                                <GoPackage style={{ minHeight: "17.5px", minWidth: "17.5px" }} />
                            </Box>
                            <Text
                                ml={'16px'}
                                color={'#31353BAD'}
                                fontSize={'14px'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                fontWeight={400}
                                lineHeight={'20px'}
                                letterSpacing={'0px'}
                            >
                                Make sure you have received the right products that you ordered. Always make transaction only on Shopedia platform and report if there is any signs of fraud.
                            </Text>
                        </Box>
                        <Box display={'flex'} justifyContent={'flex-start'} flexDir={'row'} mb={'16px'}>
                            <Box display={'flex'} minW={'48px'} h={'48px'} min={'48px'} justifyContent={'center'} alignItems={'center'} border={'1px solid #E5E7E9'} borderRadius={'8px'}>
                                <Ri24HoursFill style={{ minHeight: "17.5px", minWidth: "17.5px" }} />
                            </Box>
                            <Text
                                ml={'16px'}
                                color={'#31353BAD'}
                                fontSize={'14px'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                fontWeight={400}
                                lineHeight={'20px'}
                                letterSpacing={'0px'}
                            >
                                If the order fulfill the Terms & Conditions, we will send the cashback based on the promo within the next 24 hours.                            </Text>
                        </Box>
                        <Box display={'flex'} justifyContent={'flex-start'} flexDir={'row'} mt={'30px'}>
                            <Button
                                m={'0px 10px 0px 0px'}
                                p={'0px 16px'}
                                w={'230.56px'}
                                h={'40px'}
                                bgColor={'#fff'}
                                border={'1px solid #e5e7e9'}
                                _hover={'none'}
                                onClick={() => doneOnClose()}
                            >
                                Cancel
                            </Button>
                            <Button
                                borderRadius={'8px'}
                                w={'230.56px'}
                                h={'40px'}
                                m={'0px 10px 0px 0px'}
                                p={'0px 16px'}
                                bgColor={'#F7931E'}
                                _hover={{
                                    bgColor: "#D6882B",
                                }}
                                _active={{
                                    bgColor: "#D6882B",
                                }}
                                color={'#fff'}
                                onClick={finishOrderBtn}
                            >
                                Finish
                            </Button>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default TransactionListItem