import { Box } from "@chakra-ui/react"
import CarouselSlider from "../components/Carousel"

const HomePage = () => {
    return (
        <Box height={'800px'}>
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
        </Box>
    )
}

export default HomePage