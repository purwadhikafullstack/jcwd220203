import { Box, Text, Grid, GridItem, HStack } from "@chakra-ui/react"
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
                    price={val.price}
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
            {/* Product Recommendation */}
            <Box m="24px 0" display="block" mx="auto" w="1100px" h="400px">
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
