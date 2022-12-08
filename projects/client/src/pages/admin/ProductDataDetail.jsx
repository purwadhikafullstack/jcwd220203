import {
  Box,
  Image,
  Flex,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  useToast,
  FormControl,
  Stack,
  Input,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../../api/index";
import * as Yup from "yup"
import { useFormik } from "formik";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CarouselProductSlider from "../../components/CarouselProduct";

const DetailBookAdmin = () => {
  const [dataDetail, setDataDetail] = useState({});
  const toast = useToast();
  const params = useParams();
  const [adminUpdate, setAdminUpdate] = useState(false)


  const fetchProductData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/product/detail/${params.id}`);

      setDataDetail(response.data.data);
      console.warn(dataDetail.Image_Urls)
      editDetailFormik.setFieldValue("product_name", response.data.data.product_name)
      editDetailFormik.setFieldValue("description", response.data.data.description)
      editDetailFormik.setFieldValue("price", response.data.data.price)

    } catch (err) {
      console.log(err);
    }
  };
  

  const destroyProduct = async () => {
    try {
      await axiosInstance.delete(`/admin/product/detail/${params.id}`)
      toast({ title: "Product removed", status: "success" });
    } catch (err) {
      console.log(err)
      toast({ title: "Error deleting product", status: "error" })
    }
  } 

  const editDetailFormik = useFormik({
    initialValues: {
      product_name: "",
      description: "",
      price: "",
    },
    onSubmit: async (values) => {
      try {

        let updateProduct = {
          product_name: values.product_name,
          description: values.description,
          price: values.price,
          }
          console.log("test")
          await axiosInstance.patch(`/admin/product/detail/${params.id}`, updateProduct)

        setAdminUpdate(false)
        toast({ title: "Product edited", status:"success"})
        fetchProductData()
      } catch (err) {
        console.log(err);
      }
    },
    validationSchema: Yup.object({
      product_name: Yup.string().required().min(3),
      description: Yup.string().required(),
      price: Yup.number().required(),
    }),
    validateOnChange: false,
  });

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;
    editDetailFormik.setFieldValue(name, value);
  };

  
  useEffect(() => {
    fetchProductData();
  }, []);


  return (
    <Box ml="250px" p={"40px"} pt={"5px"}>
      <Grid templateColumns="repeat(2, 1fr)">
        <GridItem w="100%">
          <Heading p={5} color="#0095DA">PRODUCT DETAILS</Heading>
        </GridItem>

      </Grid>

      {!adminUpdate ? (
        <Flex
          direction={{ base: "column", md: "column", lg: "row" }}
        >
          <Box flex={"1"}>
          <CarouselProductSlider />
                    {/* {isLoading && renderImages()} */}
            {/* <Image h={"100%"} src={dataDetail.ImageURLs[1].image_url || ""} alt="book image" /> */}
          </Box>
          <Box
            flex={"1"}
            w={"full"}
            h={"full"}
            p={5}
            m={10}
            alignItems={"flex-start"}
          >
            <Heading size={"lg"}>Name</Heading>
            <Text fontSize={"2xl"}>{dataDetail.product_name}</Text>
            <br />
            <Heading size={"lg"}>Description</Heading>
            <Text fontSize={"2xl"}>{dataDetail.description}</Text>
            <br />
            {/* <Heading size={"lg"}>Image</Heading>
            <Image src={dataDetail.Image_Urls[0].image_url} />
            <br /> */}
            <Heading size={"lg"}>Price</Heading>
            <Text fontSize={"2xl"}>{(dataDetail?.price) ? 
            dataDetail.price.toLocaleString("in-ID", {style: "currency", currency: "IDR"}) : ""
            }</Text>
            
          </Box>
        <Box>
          <Button mt="2" mr="8" width="150px" onClick={() => setAdminUpdate(true)} bgColor="#0095DA">
            Edit Product Detail
          </Button>
          <br />
          <Link to="/admin/product">
          <Button mt="2" mr="8" width="150px" onClick={destroyProduct} bgColor="red">
            Delete Product
            </Button>
          </Link>
          <br />
          <Link to="/admin/product">
          <Button mt="2" mr="8" width="150px" bgColor="#F7931E">Back</Button></Link>
          </Box>
        </Flex>
      ) : (
        <form onSubmit={editDetailFormik.handleSubmit}>
          <Stack>
            <FormControl isInvalid={editDetailFormik.errors.product_name}>
              <FormLabel>Product name</FormLabel>
              <Input
                value={editDetailFormik.values.product_name}
                defaultValue={"Otw"}
                name="product_name"
                onChange={formChangeHandler}
              />
              <FormErrorMessage>{editDetailFormik.errors.product_name}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={editDetailFormik.errors.description}>
              <FormLabel>Description</FormLabel>
              <Input
                value={editDetailFormik.values.description}
                name="description"
                onChange={formChangeHandler}
              />
              <FormErrorMessage>{editDetailFormik.errors.description}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={editDetailFormik.errors.price}>
              <FormLabel>Price</FormLabel>
              <Input
                value={editDetailFormik.values.price}
                name="price"
                onChange={formChangeHandler}
              />
              <FormErrorMessage>{editDetailFormik.errors.price}</FormErrorMessage>
            </FormControl>
            <Box>
            <Button 
            colorScheme="red"
            width="100px"
            onClick={() => setAdminUpdate(false)}
            marginRight="10px"
            >
              Cancel
            </Button>
            <Button 
            colorScheme="teal"
            width="100px"
            onClick={() => editDetailFormik.handleSubmit()}
            >
              Save
            </Button>
            </Box>
          </Stack>
        </form>
      )}
    </Box>
  );
};

export default DetailBookAdmin;
