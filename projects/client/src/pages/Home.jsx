import { Box } from "@chakra-ui/react"
import CarouselSlider from "../components/Carousel"
import HomePageCategory from "../components/CategoryHome/HomePageCategory"
import HomeProduct from "../components/product/HomeProduct"

const HomePage = () => {
    return (
        <Box >
            <Box w="1208px" marginX={"auto"}>
                <Box
                    paddingBottom="24px"
                    paddingTop={"24px"}
                    h="auto"
                    minHeight={"240px"}
                >
                    <CarouselSlider />
                    <HomePageCategory />
                </Box>
            </Box>

            {/* Product Card */}
            <HomeProduct />
        </Box>
    )
}

export default HomePage
