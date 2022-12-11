import {
    Box,
    Center,
    Text,
    Grid,
    GridItem,
    Heading,
    Flex,
    HStack,
    Spacer,
    Button,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { axiosInstance } from "../../api"
import CategoryList from "./CategoryList"
import ProductItem from "./ProductItem"

const HomeProduct = () => {
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])

    const fetchProduct = async () => {
        try {
            const maxItemsPerPage = 6
            const response = await axiosInstance.get(`/product`, {
                params: {
                    _limit: maxItemsPerPage,
                },
            })
            setProducts(response.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchCategory = async () => {
        try {
            const maxItemsPerPage = 10
            const response = await axiosInstance.get(`/product/category`, {
                _limit: maxItemsPerPage,
            })
            setCategory(response.data.data)
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
                    // description={val.description}
                    price={val.price}
                    // category_name={val.category_name}
                    // stock={val.stock}
                    // image_url={val.image_url}
                    id={val.id}
                />
            )
        })
    }

    const renderCategory = () => {
        return category.map((val) => {
            return (
                <CategoryList
                    key={val.id.toString()}
                    category_name={val.category_name}
                    id={val.id}
                />
            )
        })
    }

    useEffect(() => {
        fetchProduct()
        fetchCategory()
    }, [])
    return (
        <>
            {/* Category Selection */}
            {/* <Box
                // border="1px solid red"
                mx="auto"
                mt="20px"
                w="1100px"
                h="230px"
                display="block"
                borderBottom="1px solid #dfe1e3"
            >
                <Box
                    border="1px solid #dfe1e3"
                    borderRadius="12px"
                    boxShadow="1px 1px 6px 1px #e0e0e0"
                    display="block"
                >
                    <Box
                        // border="1px solid blue"
                        display="block"
                        fontSize="20px"
                        fontWeight="800px"
                        textAlign="left"
                        p="16px"
                        // borderBottom="1px solid #dfe1e3"
                        // w="156.062px"
                    >
                        <Text>Selected Category</Text>
                    </Box> */}

            {/* Category Card */}
            {/* <Grid
                        // border="1px solid green"
                        display="grid"
                        p="1px 0"
                        pl="16px"
                        pr="16px"
                        gap="2"
                        mb="-20px"
                        templateColumns="repeat(5,1fr)"
                        // boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                        borderRadius="8px"
                    >
                        {renderCategory()} */}
            {/* 1 */}
            {/* <GridItem p="16px" mb="24px"></GridItem>
                    </Grid>
                </Box>
            </Box> */}

            {/* Product Recommendation */}
            <Box
                m="24px 0"
                // border="1px solid red"
                display="block"
                mx="auto"
                w="1100px"
                h="400px"
            >
                <Box
                    // border="1px solid blue"
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
                <Box display="grid" justifyItems="center">
                    <Grid templateColumns="repeat(6,1fr)" gap="4">
                        {renderProduct()}
                    </Grid>
                </Box>
            </Box>
        </>
    )
}

export default HomeProduct
