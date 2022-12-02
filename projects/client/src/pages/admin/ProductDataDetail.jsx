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
import { useSelector } from "react-redux";
import * as Yup from "yup"
import { useFormik } from "formik";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CarouselProductSlider from "../../components/CarouselProduct";

const DetailBookAdmin = () => {
  const authSelector = useSelector((state) => state.auth);
  const [dataDetail, setDataDetail] = useState({});
  const toast = useToast();
  const params = useParams();
  const [adminUpdate, setAdminUpdate] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [fullImages, setFullImages] = useState([])


  const fetchProductData = async () => {
    try {
      const response = await axiosInstance.get(`/product/detail/${params.id}`);

      setDataDetail(response.data.data);
      console.warn(dataDetail.Image_Urls)
      setFullImages(response.data.data.Image_Urls)
      // console.log(fullImages)
      editDetailFormik.setFieldValue("nama", response.data.data.nama)
      editDetailFormik.setFieldValue("deskripsi", response.data.data.deskripsi)
      editDetailFormik.setFieldValue("harga", response.data.data.harga)
      setIsLoading(true);

    } catch (err) {
      console.log(err);
    }
  };
  

  const destroyProduct = async () => {
    try {
      await axiosInstance.delete(`/product/${authSelector.id}`)

      toast({ title: "Product removed", status: "success" })
    } catch (err) {
      console.log(err)
      toast({ title: "Error deleting product", status: "error" })
    }
  } 

  const editDetailFormik = useFormik({
    initialValues: {
      nama: "",
      deskripsi: "",
      harga: "",
    },
    onSubmit: async (values) => {
      try {

        let updateBook = {
          nama: values.nama,
          deskripsi: values.deskripsi,
          harga: values.harga,
          }

          await axiosInstance.patch(`/book/${authSelector.id}`, updateBook)

        setAdminUpdate(false)
        toast({ title: "Profile edited", status:"success"})
        fetchProductData()
      } catch (err) {
        console.log(err);
      }
    },
    validationSchema: Yup.object({
      title: Yup.string().required().min(3),
      author: Yup.string().required(),
      release_year: Yup.string().required(),
      ISBN: Yup.string().required(),
      publisher: Yup.string().required(),
      genre: Yup.string().required(),
      pages: Yup.number().required(),
      language: Yup.string().required(),
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
          <Heading p={5}>PRODUCT DETAILS</Heading>
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
            <Text fontSize={"2xl"}>{dataDetail.nama}</Text>
            <br />
            <Heading size={"lg"}>Description</Heading>
            <Text fontSize={"2xl"}>{dataDetail.deskripsi}</Text>
            <br />
            {/* <Heading size={"lg"}>Image</Heading>
            <Image src={dataDetail.Image_Urls[0].image_url} />
            <br /> */}
            <Heading size={"lg"}>Price</Heading>
            <Text fontSize={"2xl"}>{(dataDetail?.harga) ? 
            dataDetail.harga.toLocaleString("in-ID", {style: "currency", currency: "IDR"}) : ""
            }</Text>
            
          </Box>
        <Box>
          <Button mt="8" mr="8" width="150px" onClick={() => setAdminUpdate(true)}>
            Edit Product Detail
          </Button>
          <br />
          <Button mt="10" mr="8" width="150px" onClick={destroyProduct}>
            Delete Product
            </Button>
          </Box>
        </Flex>
      ) : (
        <form onSubmit={editDetailFormik.handleSubmit}>
          <Stack>
            <FormControl isInvalid={editDetailFormik.errors.nama}>
              <FormLabel>Nama</FormLabel>
              <Input
                value={editDetailFormik.values.nama}
                defaultValue={"Otw"}
                name="nama"
                onChange={formChangeHandler}
              />
              <FormErrorMessage>{editDetailFormik.errors.nama}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={editDetailFormik.errors.deskripsi}>
              <FormLabel>Description</FormLabel>
              <Input
                value={editDetailFormik.values.deskripsi}
                name="deskripsi"
                onChange={formChangeHandler}
              />
              <FormErrorMessage>{editDetailFormik.errors.deskripsi}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={editDetailFormik.errors.harga}>
              <FormLabel>Price</FormLabel>
              <Input
                value={editDetailFormik.values.harga}
                name="harga"
                onChange={formChangeHandler}
              />
              <FormErrorMessage>{editDetailFormik.errors.harga}</FormErrorMessage>
            </FormControl>
            <Box>
            <Button 
            type="submit" 
            colorScheme="red"
            width="100px"
            onClick={() => setAdminUpdate(false)}
            marginRight="10px"
            >
              Cancel
            </Button>
            <Button 
            type="submit" 
            colorScheme="teal"
            width="100px"
            onClick={editDetailFormik.handleSubmit}
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
