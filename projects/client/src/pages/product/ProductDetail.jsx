import {
    Box,
    Text,
    HStack,
    Stack,
    Image,
    Button,
    useNumberInput,
    Input,
} from "@chakra-ui/react"
import { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { axiosInstance } from "../../api"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

const ProductDetail = ({ product_name, id }) => {
    // Increment decrement stock
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
        useNumberInput({
            step: 1,
            defaultValue: 1,
            min: 0,
        })
    const inc = getIncrementButtonProps()
    const dec = getDecrementButtonProps()
    const input = getInputProps()
    const [productDetail, setProductDetail] = useState([])
    const [image, setImage] = useState([])
    const [stock, setStock] = useState([])
    const params = useParams()
    const fetchProductDetail = async () => {
        try {
            const response = await axiosInstance.get(`/product/${params.id}`)
            setProductDetail(response.data.data)
            setImage(response.data.data.Image_Urls)
            setStock(response.data.data.Total_Stocks)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchProductDetail()
    }, [])
    return (
        <>
            <Box
                // border="1px solid red"
                mx="auto"
                mt="120px"
                w="1100px"
                h="700px"
                // p="10px 24px"
                display="block"
                // borderBottom="1px solid #dfe1e3"
            >
                <Box
                    // border="1px solid brown"
                    display="flex"
                    gap="20px"
                >
                    <Box
                        // border="1px solid blue"
                        borderRadius="12px"
                        // boxShadow="1px 1px 6px 1px #e0e0e0"
                        display="block"
                        w="348px"
                        h="420px"
                    >
                        <Carousel showStatus={false} showArrows={true}>
                            {image.map((val) => (
                                <Stack>
                                    <Box
                                        // border="1px solid brown"
                                        w="348px"
                                        h="348px"
                                        borderRadius="12px"
                                        display="block"
                                    >
                                        <Image
                                            src={val.image_url}
                                            w="348px"
                                            h="348px"
                                            objectFit="cover"
                                            borderRadius="12px"
                                            // border="1px solid red"
                                        />
                                    </Box>

                                    {/* <Box
                                        // border="1px solid red"
                                        w="348px"
                                        h="60px"
                                        borderRadius="12px"
                                        display="flex"
                                        justifyItems="flex-start"
                                        gap="20px"
                                    >
                                        <Image
                                            src={val.image_url}
                                            objectFit="fill"
                                            borderRadius="12px"
                                            w="58px"
                                            h="58px"
                                        />
                                        <Image
                                            src="https://img.freepik.com/premium-vector/cute-shark-cartoon-design_274619-2128.jpg?w=2000"
                                            objectFit="fill"
                                            borderRadius="12px"
                                            w="58px"
                                            h="58px"
                                        />
                                        <Image
                                            src="https://static.vecteezy.com/system/resources/previews/004/260/996/original/cute-shark-inflatable-ring-icon-vector.jpg"
                                            objectFit="fill"
                                            borderRadius="12px"
                                            w="58px"
                                            h="58px"
                                        />
                                    </Box> */}
                                </Stack>
                            ))}
                        </Carousel>
                    </Box>

                    {/* Product */}
                    <Box
                        // border="1px solid green"
                        borderRadius="12px"
                        w="468px"
                        h="700px"
                        display="block"
                    >
                        <Box display="grid" gap="20px">
                            {/* Product Name */}
                            <Stack
                                // border="1px solid red"
                                w="468px"
                                h="48px"
                            >
                                <Text
                                    fontSize="16"
                                    fontFamily="sans-serif"
                                    fontWeight="bold"
                                >
                                    {productDetail?.product_name}
                                </Text>
                            </Stack>

                            {/* Price */}
                            <Stack
                                // border="1px solid blue"
                                w="468px"
                                h="80px"
                                borderBottom="1px solid #dfe1e3"
                            >
                                <Text
                                    fontSize="28"
                                    fontFamily="sans-serif"
                                    fontWeight="bold"
                                >
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                    }).format(productDetail.price)}
                                </Text>
                            </Stack>

                            {/* Description */}
                            <Stack
                                // border="1px solid brown"
                                w="468px"
                                h="48px"
                            >
                                <Text fontSize="14" fontFamily="sans-serif">
                                    {productDetail.description}
                                </Text>
                            </Stack>
                        </Box>
                    </Box>

                    {/* Add to cart */}
                    <Box
                        border="1px solid #dfe1e3"
                        borderRadius="12px"
                        // boxShadow="1px 1px 6px 1px #e0e0e0"
                        display="block"
                        w="242px"
                        h="255px"
                        px="12px"
                    >
                        <Box mt="12px" display="grid" gap="20px">
                            {/* Belanja sekarang */}
                            <Stack w="242px" h="22px">
                                <Text fontSize="18px" fontWeight="bold">
                                    Belanja sekarang
                                </Text>
                            </Stack>

                            {/* Stock */}
                            {stock.map((val) => (
                                <Stack w="200px" ml="10px">
                                    <HStack>
                                        <Button {...dec}>-</Button>

                                        <Input textAlign="center" {...input} />

                                        <Button {...inc}>+</Button>
                                    </HStack>
                                    <Text>Stock: {val.stock}</Text>

                                    {/* Subtotal */}
                                    <Box display="flex" pt="3">
                                        <Text>Subtotal</Text>
                                        <Text
                                            fontWeight="bold"
                                            fontSize="18px"
                                            w="200px"
                                            textAlign="end"
                                        >
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                            }).format(productDetail?.price)}
                                        </Text>
                                    </Box>
                                </Stack>
                            ))}

                            {/* Button */}
                            <Stack w="200px" ml="10px">
                                <Button bgColor="#F7931E" color="white">
                                    Add to cart
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default ProductDetail
