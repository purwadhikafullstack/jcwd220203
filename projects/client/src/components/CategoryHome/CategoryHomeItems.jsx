import { Box, GridItem, Image, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { axiosInstance } from "../../api"
import { motion } from "framer-motion"

const CategoryHomeItems = ({ category_name, category_image }) => {

    const [countProduct, setCountProduct] = useState(0)
    const fetchCategoryByProductName = async () => {
        try {
            const response = await axiosInstance.get(`categories/category_detail`, {
                params: {
                    category_name: category_name
                }
            })

            const productQuantity = response.data.data.Products.map((val) => val)

            setCountProduct(productQuantity.length)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchCategoryByProductName()
    }, [])


    const myStyle = {
        fontSize: "14px",
        fontWeight: 700,
        paddingBot: "3px",
        marginTop: "3px",
        textAlign: "center",
    }

    const apiImg = process.env.REACT_APP_IMAGE_URL

    return (
        <GridItem
            w={'126px'}
            h={'122px'}
            cursor={'pointer'}
        >
            <Box
                display={"flex"}
                flexDir={'column'}
                alignItems={'center'}
                _hover={{
                    color: "#F7931E"
                }}
            >
                <motion.button
                    whileHover={{
                        scale: 1.2,
                        boxShadow: "0px 0px 8px rgb(255,255,255)",
                    }}
                    transition={{
                        type: "spring", stifness: 300
                    }}
                >
                    <Image
                        w={'80px'}
                        h={'80px'}
                        src={`${apiImg}/${category_image}`}
                    />
                </motion.button>
                <motion.text
                    style={myStyle}
                >
                    {category_name}
                </motion.text>
                <Text
                    fontSize={'11.2px'}
                    color={'#6C757D'}
                    pb={'3px'}
                >
                    {countProduct} Products
                </Text>
            </Box>
        </GridItem >
    )
}

export default CategoryHomeItems