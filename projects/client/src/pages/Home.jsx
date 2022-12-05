import { Box } from "@chakra-ui/react"
import CarouselSlider from "../components/Carousel"
import HomeProduct from "../components/product/HomeProduct"

const HomePage = () => {
    return (
        <Box height={"1060px"}>
            <Box w="1208px" marginX={"auto"}>
                <Box
                    paddingBottom="24px"
                    paddingTop={"24px"}
                    h="auto"
                    minHeight={"240px"}
                >
                    <CarouselSlider />
                </Box>
            </Box>

            {/* Product Card */}
            <HomeProduct />
        </Box>
    )
}

export default HomePage
