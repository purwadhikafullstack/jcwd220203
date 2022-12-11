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
  Select,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../../api/index";
import * as Yup from "yup";
import { useFormik } from "formik";
import CarouselProductSlider from "../../components/CarouselProduct";
import { TbCameraPlus } from "react-icons/tb";

const AdminProductDataDetail = () => {
  const [dataDetail, setDataDetail] = useState({});
  const toast = useToast();
  const params = useParams();
  const [adminUpdate, setAdminUpdate] = useState(false);

  const [category, setCategory] = useState({});
  const inputFileRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    isOpen: isOpenAddNewProduct,
    onOpen: onOpenAddNewProduct,
    onClose: onCloseAddNewProduct,
  } = useDisclosure();

  const fetchProductData = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/product/detail/${params.id}`
      );

      setDataDetail(response.data.data);
      console.log(dataDetail);
      // console.log(dataDetail.Image_Urls)
      // console.warn(response.data.data.Image_Urls)
      editDetailFormik.setFieldValue(
        "product_name",
        response.data.data.product_name
      );
      editDetailFormik.setFieldValue(
        "description",
        response.data.data.description
      );
      editDetailFormik.setFieldValue("price", response.data.data.price);
      editDetailFormik.setFieldValue(
        "category_name",
        response.data.data.Category.category_name
      );
      editDetailFormik.setFieldValue(
        "CategoryId",
        response.data.data.Category.CategoryId
      );

      const categoryRes = await axiosInstance.get("/admin/product/category");
      setCategory(categoryRes.data.data);
      console.log(category);
    } catch (err) {
      console.log(err);
    }
  };
  const renderCategory = () => {
    return Array.from(category).map((val) => {
      return (
        <option value={val.id} key={val.id.toString()}>
          {val.category_name}
        </option>
      );
    });
  };

  const destroyProduct = async () => {
    try {
      await axiosInstance.delete(`/admin/product/detail/${params.id}`);
      toast({ title: "Product removed", status: "success" });
    } catch (err) {
      console.log(err);
      toast({ title: "Error deleting product", status: "error" });
    }
  };

  const editDetailFormik = useFormik({
    initialValues: {
      product_name: "",
      description: "",
      price: "",
      CategoryId: "",
    },
    onSubmit: async (values) => {
      try {
        let updateProduct = {
          product_name: values.product_name,
          description: values.description,
          price: values.price,
          CategoryId: values.CategoryId,
        };
        console.log("test");
        await axiosInstance.patch(
          `/admin/product/detail/${params.id}`,
          updateProduct
        );

        setAdminUpdate(false);
        toast({ title: "Product edited", status: "success" });
        fetchProductData();
      } catch (err) {
        console.log(err);
      }
    },
    validationSchema: Yup.object({
      product_name: Yup.string().required().min(3),
      description: Yup.string().required(),
      price: Yup.number().required(),
      CategoryId: Yup.number().required(),
    }),
    validateOnChange: false,
  });
  const addPictureFormik = useFormik({
    initialValues: {
      image_url: "",
    },
    onSubmit: async ({
      image_url,
    }) => {
      try {
        const data = new FormData();

        if (image_url) {
          console.log(image_url)
          data.append("image_url", image_url);
        }
        console.log("test");
        await axiosInstance.post(
          `/admin/product/detail/${params.id}`,
          data
        );

        setAdminUpdate(false);
        toast({ title: "Product image added successfully", status: "success" });
        fetchProductData();
      } catch (err) {
        console.log(err);
      }
    },
    validateOnChange: false,
  });

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;
    editDetailFormik.setFieldValue(name, value);
  };

  const onCloseModal = () => {
    addPictureFormik.handleSubmit();
    onCloseAddNewProduct();
  };

  // console.warn(dataDetail);
  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <Box ml="325px" p={"40px"} pt={"5px"}>
      <Grid templateColumns="repeat(2, 1fr)">
        <GridItem w="100%">
          <Heading p={5} color="#0095DA">
            PRODUCT DETAILS
          </Heading>
        </GridItem>
      </Grid>

      {!adminUpdate ? (
        <Flex direction={{ base: "column", md: "column", lg: "row" }}>
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
            <Text fontSize={"2xl"}>
              {dataDetail?.price
                ? dataDetail.price.toLocaleString("in-ID", {
                    style: "currency",
                    currency: "IDR",
                  })
                : ""}
            </Text>
            <Heading size={"lg"}>Category</Heading>
            <Text fontSize={"2xl"}>{dataDetail?.Category?.category_name}</Text>
          </Box>
          <Box>
          <Button
            bgColor={"green"}
            color="white"
            _hover={false}
            onClick={onOpenAddNewProduct}
          >
            Add New Picture
          </Button>
          <br />
            <Button
              mt="2"
              mr="8"
              width="150px"
              onClick={() => setAdminUpdate(true)}
              bgColor="#0095DA"
            >
              Edit Product Detail
            </Button>
            <br />
            <Link to="/admin/product">
              <Button
                mt="2"
                mr="8"
                width="150px"
                onClick={destroyProduct}
                bgColor="red"
              >
                Delete Product
              </Button>
            </Link>
            <br />
            <Link to="/admin/product">
              <Button mt="2" mr="8" width="150px" bgColor="#F7931E">
                Back
              </Button>
            </Link>
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
              <FormErrorMessage>
                {editDetailFormik.errors.product_name}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={editDetailFormik.errors.description}>
              <FormLabel>Description</FormLabel>
              <Input
                value={editDetailFormik.values.description}
                name="description"
                onChange={formChangeHandler}
              />
              <FormErrorMessage>
                {editDetailFormik.errors.description}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={editDetailFormik.errors.price}>
              <FormLabel>Price</FormLabel>
              <Input
                value={editDetailFormik.values.price}
                name="price"
                onChange={formChangeHandler}
              />
              <FormErrorMessage>
                {editDetailFormik.errors.price}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={editDetailFormik.errors.CategoryId}>
              <Select
                name="CategoryId"
                onChange={formChangeHandler}
                placeholder="Select category"
              >
                {renderCategory()}
              </Select>
              <FormErrorMessage>
                {editDetailFormik.errors.CategoryId}
              </FormErrorMessage>
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
      <Modal
        isOpen={isOpenAddNewProduct}
        onClose={onCloseAddNewProduct}
        motionPreset="slideInBottom"
        size={"3xl"}
      >
        <form onSubmit={addPictureFormik.handleSubmit}>
          <ModalOverlay />
          <ModalContent bgColor={"#0095DA"} p="20px">
            <ModalHeader fontSize={"xl"} fontWeight="bold">
              Add Picture
            </ModalHeader>

            <ModalBody>
              <HStack>
                <FormControl isInvalid={addPictureFormik.errors.image_url}>
                  <Image
                    w={"150px"}
                    h="150px"
                    objectFit={"cover"}
                    borderRadius={"8px"}
                    border="3px solid"
                    color={"#0095DA"}
                    mx="auto"
                    src={
                      selectedImage
                        ? selectedImage
                        : "Input Your Profile Picture"
                    }
                  />
                  <Button
                    borderRadius={"50%"}
                    w="auto"
                    h="30px"
                    border="2px solid"
                    onClick={() => inputFileRef.current.click()}
                    color={"#F7931E"}
                    _hover={false}
                    ml="58%"
                    size={"xs"}
                    mt="-33px"
                  >
                    <TbCameraPlus color={"#F7931E"} />
                  </Button>

                  <Input
                    w="100%"
                    _hover={false}
                    fontWeight="bold"
                    bgColor={"white"}
                    onChange={(e) => {
                      addPictureFormik.setFieldValue(
                        "image_url",
                        e.target.files[0]
                      );
                      setSelectedImage(URL.createObjectURL(e.target.files[0]));
                    }}
                    accept="image/*"
                    name="image_url"
                    type="file"
                    color="transparent"
                    border="0"
                    display={"none"}
                    ref={inputFileRef}
                  />
                  <FormErrorMessage>
                    {addPictureFormik.errors.image_url}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onCloseAddNewProduct}>
                Cancel
              </Button>
              <Button colorScheme="green" mr={3} onClick={onCloseModal}>
                Add New Picture
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Box>
  );
};

export default AdminProductDataDetail;
