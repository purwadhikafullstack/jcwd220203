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
} from "@chakra-ui/react"
import { Link } from "react-router-dom"

const ProductDetail = () => {
    return (
        <>
            {/* Category Selection */}
            <Box
                // border="1px solid red"
                mx="auto"
                mt="20px"
                w="1100px"
                h="200px"
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
                    </Box>

                    {/* Category Card */}
                    <Grid
                        // border="1px solid green"
                        display="grid"
                        p="16px 0"
                        pl="16px"
                        pr="16px"
                        gap="4"
                        templateColumns="repeat(5,1fr)"
                    >
                        {/* 1 */}
                        <GridItem
                            p="16px"
                            mb="24px"
                            boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                            borderRadius="8px"
                        >
                            <Center>
                                <Text justifySelf="center">Category 1</Text>
                            </Center>
                        </GridItem>

                        {/* 2 */}
                        <GridItem
                            p="16px"
                            mb="24px"
                            boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                            borderRadius="8px"
                        >
                            <Center>
                                <Text justifySelf="center">Category 2</Text>
                            </Center>
                        </GridItem>

                        {/* 3 */}
                        <GridItem
                            p="16px"
                            mb="24px"
                            boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                            borderRadius="8px"
                        >
                            <Center>
                                <Text justifySelf="center">Category 3</Text>
                            </Center>
                        </GridItem>

                        {/* 4 */}
                        <GridItem
                            p="16px"
                            mb="24px"
                            boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                            borderRadius="8px"
                        >
                            <Center>
                                <Text justifySelf="center">Category 4</Text>
                            </Center>
                        </GridItem>

                        {/* 5 */}
                        <GridItem
                            p="16px"
                            mb="24px"
                            boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                            borderRadius="8px"
                        >
                            <Center>
                                <Text justifySelf="center">Category 5</Text>
                            </Center>
                        </GridItem>
                    </Grid>
                </Box>
            </Box>

            {/* Product Recommendation */}
            <Box
                m="24px 0"
                border="1px solid red"
                display="block"
                mx="auto"
                w="1100px"
                h="400px"
            >
                <Box
                    border="1px solid blue"
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
            </Box>
        </>
    )
}

export default ProductDetail
