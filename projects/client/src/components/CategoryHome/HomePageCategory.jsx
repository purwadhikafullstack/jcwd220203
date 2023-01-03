import { Box, Grid, GridItem, Image, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { axiosInstance } from "../../api"
import CategoryHomeItems from "./CategoryHomeItems"

const HomePageCategory = () => {
    const [showCategory, setShowCategory] = useState([])

    const fetchCategory = async () => {
        try {
            const response = await axiosInstance.get("/categories")
            setShowCategory(response.data.data)

        } catch (err) {
            console.log(err)
        }
    }

    const renderCategory = () => {
        return showCategory.map((val) => {
            return (
                <CategoryHomeItems
                    key={val.id.toString()}
                    category_name={val.category_name}
                    category_image={val.category_image}
                />
            )
        })
    }
    useEffect(() => {
        fetchCategory()
    }, [])
    return (
        <Box
            width={'1200px'}
            borderRadius={'10px'}
            marginTop={'3rem'}
            boxShadow={'0 0.5rem 1rem rgba(0,0,0,0.15)'}
        >
            <Box
                fontWeight={600}
                p={'8px 5px 8px 12px'}
                position={'relative'}
                borderRadius={'10px 0 45px'}
                bgColor={'#0095DA'}
                width={'245px'}
            >
                <Text
                    color={'#fff'}
                    fontSize={'22px'}
                    position={'relative'}
                >
                    Shop By Categories
                </Text>
            </Box>
            <Grid
                templateColumns='repeat(9, 1fr)' rowGap={'20px'}
                columnGap={'3px'} mt={'0px'} p={'25px'} pl={'15px'}
                pr={'15px'} pb={'50px'}>
                {renderCategory()}
            </Grid>
        </Box>
    )

}
export default HomePageCategory 