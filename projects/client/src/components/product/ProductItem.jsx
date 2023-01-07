import { Box, Image, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { axiosInstance } from "../../api"

const ProductItem = ({ product_name, id, price, image_url }) => {
  //   const [productData, setProductData] = useState({
  //     product_name: "",
  //     price: 0,
  //     category_name: "",
  //     stock: 0,
  //     id: "",
  //   })
  const [productId, setProductId] = useState(0)
  //   const [imageProduct, setImageProduct] = useState([])
  //   const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  //   const fetchProductById = async () => {
  //     try {
  //       const response = await axiosInstance.get(`/product/${id}`)
  //       setProductData(response.data.data)
  //       setIsLoading(true)
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }

  //   const fetchProductImage = async () => {
  //     try {
  //       const response = await axiosInstance.get(`/product/image/${id}`)
  //       setImageProduct(response.data.data)
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }

  const productBtnHandler = () => {
    setProductId(id)
    navigate(`/product/${id}/${product_name}`)
  }
  //   useEffect(() => {
  //     fetchProductById()
  //     fetchProductImage()
  //   }, [productId])
  return (
    <>
      <Box onClick={() => productBtnHandler()}>
        <Box
          w="166px"
          h="315px"
          bgColor="white"
          borderRadius="12px"
          boxShadow="1px 1px 6px 1px #e0e0e0"
          cursor="pointer"
          display={{ lg: "block", md: "none", base: "none" }}
        >
          {/* Image */}
          <Image
            h="200px"
            w="100%"
            objectFit="fill"
            borderTopRadius="12px"
            src={image_url}
          />

          {/* Product Name */}
          <Box h="70px">
            <Text
              p="2"
              h="70px"
              fontSize="14px"
              overflow="hidden"
              textOverflow="ellipsis"
              noOfLines={[1, 3]}
            >
              {product_name}
            </Text>
          </Box>

          {/* Price */}
          <Text pl="2" fontWeight="bold" fontSize="14px">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(price)}
          </Text>
        </Box>

        {/* responsive */}
        <Box
          w="171.6px"
          h="auto"
          bgColor="white"
          borderRadius="9px"
          boxShadow="1px 1px 6px 1px #e0e0e0"
          cursor="pointer"
          display={{ lg: "none", md: "block", base: "block" }}
        >
          <Box h="171.6">
            <Image
              src={image_url}
              w="171.6px"
              h="auto"
              objectFit={"cover"}
              borderTopRadius={"9px"}
            />
          </Box>
          <Box p="8px">
            <Box
              h="37px"
              overflow={"hidden"}
              textOverflow="ellipsis"
              noOfLines={[2]}
              mb="4px"
              fontSize={"12.04px"}
            >
              {product_name}
            </Box>
            <Box fontSize={"14px"} fontWeight="bold" mb="8px">
              Rp{price.toLocaleString("id-ID")}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ProductItem
