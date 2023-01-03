import { Box, GridItem, Image, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { axiosInstance } from "../../api"
import { checkoutCartItems } from "../../redux/features/cartSlice"

const CheckoutCartItems = () => {

    const cartSelector = useSelector((state) => state.cart)

    const [productWeight, setProductWeight] = useState(0)

    const dispatch = useDispatch()

    const fetchCheckoutCartItems = async () => {
        try {
            const response = await axiosInstance.get("/transactions/checkoutCartItems")
            dispatch(checkoutCartItems(response.data.data))

            const productWeight = response.data.data.map((val) => val.Product.product_weight)
            let total = 0

            for (let i = 0; i < productWeight.length; i++) {
                total += Number(productWeight[i])
            }

            setProductWeight(total)
        } catch (err) {
            console.log(err)
        }
    }

    const renderCheckoutCartItems = () => {
        return cartSelector.checkoutCart.map((val) => {
            return (
                <Box h={!val.note ? '110px' : '130px'} w={'100%'}>
                    <Box
                        width={'364px'}
                        display={'flex'}
                        flexDir={'row'}
                    >
                        <Image
                            src={val.Product.Image_Urls[0].image_url}
                            w={'65px'}
                            h={'65px'}
                        />
                        <Box
                            display={'flex'}
                            flexDir={'column'}
                            pl={'15px'}
                        >
                            <Text
                                fontSize={'14px'}
                                fontWeight={400}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                letterSpacing={'0px'}
                                lineHeight={'20px'}
                                m={'0px 0px 2px'}
                                color={'#31353BF5'}
                                whiteSpace={'nowrap'}
                                overflow={'hidden'}
                                textOverflow={'ellipsis'}
                                width={'280px'}
                            >
                                {val.Product.product_name}
                            </Text>
                            <Text
                                fontSize={'12px'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                fontWeight={400}
                                lineHeight={'18px'}
                                letterSpacing={'0px'}
                                margin={'4px 0px'}
                                color={'#31353BF5'}
                                pb={'1px'}
                            >
                                {val.quantity} {val.quantity > 1 ? "items" : "item"}
                            </Text>
                            <Text
                                fontSize={'14px'}
                                fontWeight={700}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                lineHeight={'20px'}
                                letterSpacing={'0px'}
                                color={'#31353BF5'}
                                margin={'0px'}
                            >
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                }).format(val.Product.price).split(",")[0]}
                            </Text>
                        </Box>
                    </Box>
                    <Box
                        maxW={'280px'}
                        h={'35px'}
                        m={'0px 0px 6px'}
                        p={'5px 0px 0px'}
                        fontSize={'12px'}
                        lineHeight={'1.4'}
                        wordBreak={'break-word'}
                        color={'#9FA6B0'}
                    >
                        <Text
                            fontWeight={400}
                            fontFamily={'Open Sauce One, Nunito Sans, -apple-system, sans-serif'}
                            lineHeight={'18px'}
                            letterSpacing={'0px'}
                            fontSize={'12px'}
                            color={'#31353BAD'}
                            m={'12px 0'}
                        >
                            {val.note ? `Note: ${val.note}` : null}
                        </Text>
                    </Box>
                </Box>

            )
        })
    }

    useEffect(() => {
        fetchCheckoutCartItems()
    }, [])

    return (
        <>
            <GridItem w={'100%'} mt={'10px'}>
                {renderCheckoutCartItems()}
            </GridItem>
        </>

    )
}

export default CheckoutCartItems