import { Box } from "@chakra-ui/react";
import { axiosInstance } from "../../api";

const ProductDataImageMap = ({
  id,
  img_url,
}) => {

            const productDataImage = axiosInstance.get(`/product/detail/images/${id}`)

  return (
    <>
      <Box>
              <img
                src={productDataImage.data.data.img_url}
              />

      </Box>
    </>
  );
};

export default ProductDataImageMap;
