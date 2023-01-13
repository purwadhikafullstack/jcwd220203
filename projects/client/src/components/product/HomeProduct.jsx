import { Box, Text, Grid, HStack, CircularProgress } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { axiosInstance } from "../../api"
import ProductItem from "./ProductItem"

const HomeProduct = () => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsloading] = useState(false)

    const fetchProduct = async () => {
        try {
            const maxItemsPerPage = 6
            const response = await axiosInstance.get(`/product`, {
                params: {
                    _limit: maxItemsPerPage,
                },
            })
            setProducts(response.data.data)
            setIsloading(true)
        } catch (err) {
            console.log(err)
        }
    }

    const renderProduct = () => {
        return products.map((val) => {
            return (
                <ProductItem
                    key={val.id.toString()}
                    product_name={val.product_name}
                    image_url={val.Image_Urls[0]?.image_url}
                    price={val.price}
                    id={val.id}
                />
            )
        })
    }

    useEffect(() => {
        fetchProduct()
    }, [])
    return (
        <>
            <Box
                m="24px 0"
                mx="auto"
                w="1200px"
                display={{ lg: "block", md: "none", base: "none" }}
            >
                <Box
                    display="flex"
                    fontSize="20px"
                    fontWeight="800px"
                    textAlign="left"
                    p="16px"
                    position="relative"
                    mb="16px"
                >
                    <HStack>
                        <Text>Recommended Products</Text>
                    </HStack>

                    <HStack pl="10px">
                        <Link to="/product">
                            <Text color="#0095DA" fontSize="14px">
                                See all
                            </Text>
                        </Link>
                    </HStack>
                </Box>

                {/* Content */}
                <Box justifyItems="center" display={"grid"}>
                    {isLoading === false ? (
                        <Box
                            w={"1200px"}
                            h={"400px"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            alignContent={"center"}
                        >
                            <CircularProgress
                                isIndeterminate
                                color="#0095DA"
                                thickness="160px"
                                size="100px"
                            />
                        </Box>
                    ) : null}
                    <Grid templateColumns="repeat(6,1fr)" gap="6">
                        {renderProduct()}
                    </Grid>
                </Box>
            </Box>

            {/* Responsive */}
            <Box>
                <Box
                    p="16px 16px 8px"
                    display={{ lg: "none", md: "flex", base: "flex" }}
                >
                    <Box
                        display={"flex"}
                        justifyContent="space-between"
                        w="100%"
                    >
                        <Text fontSize={"20px"} fontWeight="bold">
                            Recommended Products
                        </Text>
                        <Link to="/product">
                            <Text
                                color="#0095DA"
                                fontSize="14px"
                                textAlign="flex-end"
                            >
                                See all
                            </Text>
                        </Link>
                    </Box>
                </Box>
                <Box
                    display={{ lg: "none", md: "flex", base: "flex" }}
                    overflowX="scroll"
                    p="12px"
                    gap="4"
                >
                    {renderProduct()}
                </Box>
            </Box>
        </>
    )
}

export default HomeProduct
