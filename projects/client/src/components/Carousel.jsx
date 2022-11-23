import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Box, Button, Image, UnorderedList } from "@chakra-ui/react"

import React from "react"

const CarouselSlider = () => {
    const settings = {
        dots: true,
        autoplay: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 1000,
        swipeToSlide: true,
        lazyLoad: true,
        initialSlide: 0,
        appendDots: dots => (
            <Box p={'30px'}
            >
                < UnorderedList margin={'1px'} color={'white'} > {dots} </UnorderedList>
            </Box >
        ),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }

    const myStyle = {
        display: true,
        width: 1100,
        height: 300,
        borderRadius: 40
    }

    const slider = React.useRef(null)
    return (
        <>
            <Box
                mx={'auto'}
                mt={'70px'}
                style={myStyle}
                cursor={'pointer'}
            >

                <Slider ref={slider} {...settings}>
                    <Box  >
                        <Image
                            src={"https://images.tokopedia.net/img/cache/1208/NsjrJu/2022/11/10/c080e6e7-b310-4ffa-b83c-5ca1b80c913f.jpg?ect=4g"}
                            borderRadius={'15px'}
                            height={'302px'}
                            width={'1200px'}
                        />
                    </Box>
                    <Box>
                        <Image
                            src={'https://images.tokopedia.net/img/cache/1190/wmEwCC/2022/11/16/270540a4-a7a0-4761-99e4-b31cc6c51d3a.jpg.webp?ect=4g'}
                            borderRadius={'15px'}
                            height={'302px'}
                            width={'1200px'}
                        />
                    </Box>
                    <Box>
                        <Image
                            src={"https://images.tokopedia.net/img/cache/1190/wmEwCC/2022/11/17/96e9efcf-b612-4822-ac7a-fcf176f54c60.jpg.webp?ect=4g"}
                            borderRadius={'15px'}
                            height={'302px'}
                            width={'1200px'}
                        />
                    </Box>
                </Slider>
                <Button
                    mt={'-335px'}
                    ml={'-20px'}
                    onClick={() => slider?.current?.slickPrev()}
                    borderRadius={'50px'}
                    color={'#0095DA'}
                    bgColor={'#E5F9F6'}
                    _hover={{
                        color: '#0095DA',
                        bgColor: 'orange'
                    }}
                >
                    ❮
                </Button>
                <Button
                    display={'inline'}
                    mt={'-380px'}
                    ml={'1080px'}
                    onClick={() => slider?.current?.slickNext()}
                    borderRadius={'50px'}
                    color={'#0095DA'}
                    bgColor={'E5F9F6'}
                    _hover={{
                        display: 'inline',
                        color: '#0095DA',
                        bgColor: 'orange'
                    }}
                >
                    ❯
                </Button>
            </Box>
        </>
    )
}

export default CarouselSlider
