import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Checkbox, HStack, Image, Text, Textarea, useDisclosure, useToast } from "@chakra-ui/react"
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useEffect, useState } from "react"
import { axiosInstance } from "../api"
import { ImCross, ImCheckmark } from "react-icons/im"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"


const CartItems = ({ productName, price, productImage, quantity, CartId, fetchMyCart, onDelete, allChecked, fetchTotalPrice, productId }) => {

    const [count, setCount] = useState(quantity)
    const [checkedCart, setCheckedCart] = useState(false)
    const [addNote, setAddNote] = useState(false)
    const [updateNote, setUpdateNote] = useState("")
    const [inputText, setInputText] = useState("")
    const [productStock, setProductStock] = useState(0)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast()

    const countPlus = async () => {
        try {
            await axiosInstance.post(`/carts/increment/${CartId}`)
            fetchMyCart()
            setCount(quantity + 1)

            fetchTotalPrice()
            fetchCartByProductId()
        } catch (err) {
            console.log(err)
        }
    }

    const countMinus = async () => {
        try {
            await axiosInstance.patch(`/carts/decrement/${CartId}`)
            fetchMyCart()
            if (quantity <= 1) {
                return 1
            }
            setCount(quantity - 1)

            fetchTotalPrice()
            fetchCartByProductId()
        } catch (err) {
            console.log(err)
        }
    }

    const fetchCartById = async () => {
        try {
            const response = await axiosInstance.get(`/carts/${CartId}`)

            setUpdateNote(response.data.data.note)

            const cartStock = response.data.data.Product.Total_Stocks.map((val) => val.stock)

            let Total = 0

            for (let i = 0; i < cartStock.length; i++) {
                Total += Number(cartStock[i])
            }

            setProductStock(Total)

            if (response.data.data.is_checked === true) {
                setCheckedCart(true)
            } else {
                setCheckedCart(false)
            }

        } catch (err) {
            console.log(err)
        }
    }

    const cartItemsCheck = async () => {
        try {
            const response = await axiosInstance.patch(`/carts/cartChecked/${CartId}`)

            if (response.data.data.is_checked === true) {
                setCheckedCart(true)
            } else {
                setCheckedCart(false)
            }

            fetchTotalPrice()
        } catch (err) {
            console.log(err)
        }
    }

    const formik = useFormik({
        initialValues: {
            note: "",
        },
        onSubmit: async ({ note }) => {
            try {
                let newNote = {
                    note: note
                }
                const response = await axiosInstance.patch(`/carts/updateCartNote/${CartId}`, newNote)

                setUpdateNote(response.data.data.note)
                setAddNote(false)
                fetchCartById()
                fetchCartByProductId()
            } catch (err) {
                console.log(err)
            }
        }
    })

    const formChangeHandler = ({ target }) => {
        const { name, value } = target

        formik.setFieldValue(name, value)

        setInputText(value)
    }

    const confirmDeleteBtnHandler = () => {
        onClose()
        onDelete()
    }

    const openTextArea = () => {
        setAddNote(true)

        if (updateNote !== null) {
            setInputText(updateNote)
        }
    }


    const fetchCartByProductId = async () => {
        try {
            const response = await axiosInstance.get(`/carts/cartBy/ProductId/${productId}`)

        } catch (err) {
            console.log(err)
        }
    }

    const navigate = useNavigate()

    const productBtnHandler = () => {
        navigate(`/product/${productId}/${productName}`)
    }


    useEffect(() => {
        fetchCartById()
        fetchCartByProductId()
        fetchMyCart()
    }, [allChecked, inputText, updateNote, addNote, count])

    return (
        <>

            <Box height={addNote === true ? '235px' : '143.89'} width={'630px'} p={'16px 0px'} display={'block'} >
                <Box
                    height={'71.8px'}
                    width={'630px'}
                    pl={'3px'}
                >
                    {/* cart Items */}
                    <HStack>
                        {/* Checkbox */}
                        <Box
                            width={'20px'}
                            height={'20px'}
                            bgColor={'#fff'}
                            p={'0'}
                        >
                            <Checkbox
                                borderColor={'#6C727C'}
                                size={'lg'}
                                isChecked={checkedCart}
                                onChange={() => cartItemsCheck()}
                            >
                            </Checkbox>
                        </Box>
                        {/* Product Detail */}
                        <Box
                            cursor={'pointer'}
                            pl={'12px'}
                            onClick={productBtnHandler}
                        >
                            <Image
                                src={productImage}
                                minWidth={'69px'}
                                minHeight={'69px'}
                                maxW={'69px'}
                                maxH={'69px'}
                            />
                        </Box>
                        <Box pl={'4px'} height={'71.8px'} onClick={productBtnHandler} cursor={'pointer'}>
                            <Text
                                fontSize={'14px'}
                                whiteSpace={'nowrap'}
                                overflow={'hidden'}
                                textOverflow={'ellipsis'}
                                width={'500.22px'}
                                fontColor={"#31353BF5"}
                                fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                            >
                                {productName}
                            </Text>
                            <Text
                                fontSize={'14px'}
                                fontWeight={'700'}
                                lineHeight={'20px'}
                                letterSpacing={'0px'}
                                textDecoration={'initial'}
                                fontColor={"#31353BF5"}
                                mt={'8px'}
                                fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                            >
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                }).format(price).split(",")[0]}
                            </Text>
                        </Box>
                    </HStack>
                    {/* add note */}
                    {addNote !== true ? (
                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                            m={'16px 0px 0px'}
                        >
                            {updateNote.length ? (
                                <>
                                    <Box
                                        display={"flex"}
                                        alignContent={'flex-start'}
                                        width={'355px'}
                                    >
                                        <Text
                                            fontSize={"12px"}
                                            textOverflow={'ellipsis'}
                                            overflow={'hidden'}
                                            pl={'44px'}
                                            whiteSpace={'nowrap'}
                                            fontFamily={"Open Sauce One, sans-serif"}
                                            pr={"0px"}
                                            mr={'5px'}
                                            display={'inline-block'}
                                            color={'#73767a'}
                                        >
                                            {updateNote}
                                        </Text>
                                        <Text
                                            fontSize={'12px'}
                                            fontWeight={700}
                                            lineHeight={'1,4'}
                                            cursor={'pointer'}
                                            color={'#0095DA'}
                                            fontFamily={"Open Sauce One, sans-serif"}
                                            onClick={openTextArea}
                                        >
                                            Change
                                        </Text>
                                    </Box>
                                </>
                            ) : (
                                <Text
                                    fontSize={'12px'}
                                    fontWeight={'600'}
                                    lineHeight={'1,4'}
                                    cursor={'pointer'}
                                    color={'#0095DA'}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                    p={'0px 0px 0px 44px'}
                                    onClick={openTextArea}
                                >
                                    Add Notes
                                </Text>
                            )}
                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'flex-end'}
                            >
                                {/* Cart Items Delete Button */}
                                <Box
                                    fontSize={'24px'}
                                    display={'inline-block'}
                                    verticalAlign={'middle'}
                                    cursor={'pointer'}
                                    mr={'52px'}
                                    mt={'-4px'}
                                    pl={'16px'}
                                    color={'#8d96aa'}
                                    borderLeft={'2px solid #bfc9d9'}
                                    onClick={() => onOpen()}
                                >
                                    <RiDeleteBin6Line
                                    />
                                </Box>
                                {/* increment cart quantity */}
                                <Box
                                    fontSize={'20px'}
                                    fontFamily={'inherit'}
                                    fontWeight={'700'}
                                    lineHeight={'24px'}
                                    cursor={'pointer'}
                                    color={count > 1 ? "#0095DA" : '#c0cada'}
                                    onClick={countMinus}
                                >
                                    <AiOutlineMinusCircle />
                                </Box>
                                <Box p={'0px 12px'} position={'relative'}>
                                    <Text
                                        textAlign={'center'}
                                        width={'31.02px'}
                                        lineHeight={'1.15'}
                                        fontSize={'14px'}
                                        height={'100%'}
                                        fontWeight={'400px'}
                                        fontFamily={'inherit'}
                                        color={'#737697'}
                                    >
                                        {count}
                                    </Text>
                                </Box>
                                {/* decrement cart quantity */}
                                <Box
                                    fontSize={'20px'}
                                    fontFamily={'inherit'}
                                    fontWeight={'700'}
                                    lineHeight={'24px'}
                                    cursor={'pointer'}
                                    color={productStock <= count ? "#c0cada" : "#0095DA"}
                                    onClick={countPlus}
                                >
                                    <AiOutlinePlusCircle />
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        // if add notes open
                        <>
                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                                m={'16px 0px 0px'}
                            >
                                <form onSubmit={formik.handleSubmit}>
                                    <Text
                                        fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                                        fontSize={'12px'}
                                        pl={'60px'}
                                        pb={'-15px'}
                                        color={'#0095DA'}
                                        onClick={() => setAddNote(false)}
                                        cursor={'pointer'}
                                    >
                                        Add notes for this item
                                    </Text>
                                    <Textarea
                                        mt={'-15px'}
                                        m={'0px 0px 0px 44px'}
                                        w={'200px'}
                                        height={'80px'}
                                        cols={'20'}
                                        overflow={"auto"}
                                        rows={'2'}
                                        borderColor={"#0095DA"}
                                        border={'1px'}
                                        _hover={'none'}
                                        fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                                        fontSize={'14px'}
                                        Placeholder={'Make sure there is no personal data data'}
                                        onChange={formChangeHandler}
                                        name="note"
                                        defaultValue={updateNote}
                                        maxLength={140}
                                    />
                                    <Button
                                        type="submit"
                                        bgColor={"#0095DA"}
                                        _hover={"none"}
                                        _active={'none'}
                                        size={'sm'}
                                        borderRadius={'0px'}
                                        borderTopEndRadius={'30px'}
                                        borderBottomEndRadius={'30px'}
                                        pl={'0px'}
                                    >
                                        <Text
                                            fontSize={'11px'}
                                            fontWeight={'600'}
                                            lineHeight={'1,4'}
                                            cursor={'pointer'}
                                            color={'#fff'}
                                            fontFamily={"Open Sauce One, sans-serif"}
                                            pl={'5px'}
                                            onClick={openTextArea}
                                            borderRadius={'10px'}
                                        >
                                            Change
                                        </Text>
                                    </Button>
                                    <Button
                                        color={'red'}
                                        bgColor={"#fff"}
                                        flexDirection={'block'}
                                        onClick={() => setAddNote(false)}
                                        _active={'none'}
                                        _hover={'none'}
                                        borderColor={'black'}
                                    >
                                    </Button>
                                </form>
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'flex-end'}
                                    mt={'20px'}
                                >
                                    <Box
                                        fontSize={'24px'}
                                        display={'inline-block'}
                                        verticalAlign={'middle'}
                                        cursor={'pointer'}
                                        mr={'52px'}
                                        mt={'-4px'}
                                        pl={'16px'}
                                        color={'#8d96aa'}
                                        borderLeft={'2px solid #bfc9d9'}
                                        onClick={() => onOpen()}
                                    >
                                        <RiDeleteBin6Line
                                        />
                                    </Box>
                                    <Box
                                        fontSize={'20px'}
                                        fontFamily={'inherit'}
                                        fontWeight={'700'}
                                        lineHeight={'24px'}
                                        cursor={'pointer'}
                                        color={count > 1 ? "#0095DA" : '#c0cada'}
                                        onClick={countMinus}
                                    >
                                        <AiOutlineMinusCircle />
                                    </Box>
                                    <Box p={'0px 12px'} position={'relative'}>
                                        <Text
                                            textAlign={'center'}
                                            width={'31.02px'}
                                            lineHeight={'1.15'}
                                            fontSize={'14px'}
                                            height={'100%'}
                                            fontWeight={'400px'}
                                            fontFamily={'inherit'}
                                            color={'#737697'}
                                        >
                                            {count}
                                        </Text>
                                    </Box>
                                    <Box
                                        fontSize={'20px'}
                                        fontFamily={'inherit'}
                                        fontWeight={'700'}
                                        lineHeight={'24px'}
                                        cursor={'pointer'}
                                        color={count > 0 ? "#0095DA" : "#c0cada"}
                                        onClick={countPlus}
                                    >
                                        <AiOutlinePlusCircle />
                                    </Box>
                                </Box>
                            </Box>
                            <Box
                                pl={'195px'}
                                fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                                fontSize={'12px'}
                                color={"#73767a"}
                            >
                                <Text>{inputText.length}/140</Text>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
            <Box width={"650px"} h={'5px'} bgColor={"#fcd4a5"} />

            {/* Delete Cart Items Dialog*/}
            <AlertDialog isCentered isOpen={isOpen} onClose={onClose} closeOnEsc={false}>
                <AlertDialogOverlay
                    bg="blackAlpha.400"
                >
                    <AlertDialogContent
                        position={'fixed'}
                        width={'500px'}
                        height={'200px'}
                        zIndex={'60'}
                        opacity={'1'}
                        p={'32px 32px 24px'}
                        boxShadow={'0px 1px 6px rgba(49,53,59,0.12)'}
                        borderRadius={'30px'}
                    >
                        <AlertDialogHeader
                            fontSize="24px"
                            fontWeight="600"
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                            color={'#31353BF5'}
                            textAlign={'center'}
                            m={'0px 0px 14px'}
                            letterSpacing={'-0.2px'}
                            lineHeight={'28px'}
                            p={'0px'}
                        >
                            Remove items?
                        </AlertDialogHeader>

                        <AlertDialogBody
                            fontSize={'17px'}
                            fontWeight={'400px'}
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                            letterSpacing={'0px'}
                            line-height={'22px'}
                            m={'0px 0px 15px'}
                            p={'0px'}
                            color={'#31353BAD'}
                            textAlign={'center'}
                        >
                            <Text
                                m={'0px 0px 25px'}
                            >
                                The selected items will be removed from your cart.
                            </Text>
                            <Box
                                display={'flex'}
                                flexDirection={'row'}
                                alignItems={'center'}
                                boxSizing={'border-box'}
                                justifyContent={'space-evenly'}
                                gap={3}
                            >
                                <Button
                                    bgColor={'#0095DA'}
                                    onClick={confirmDeleteBtnHandler}
                                    color={'#fff'}
                                    p={'0px 16px'}
                                    height={'48px'}
                                    width={'100px'}
                                    fontFamily={'inherit'}
                                    fontWeight={700}
                                    fontSize={'16px'}
                                    _hover={'none'}
                                    _active={{ bgColor: "#165877" }}
                                    borderRadius={'30px'}
                                >
                                    <ImCheckmark />
                                </Button>
                                <Button
                                    onClick={onClose}
                                    bgColor={'#fff'}
                                    border={"1px solid #F7931E"}
                                    color={'#F7931E'}
                                    p={'0px 16px'}
                                    fontWeight={700}
                                    height={'48px'}
                                    width={'100px'}
                                    fontFamily={'inherit'}
                                    _hover={'none'}
                                    borderRadius={'30px'}
                                    m={'0px'}

                                >
                                    <ImCross />
                                </Button>
                            </Box>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default CartItems