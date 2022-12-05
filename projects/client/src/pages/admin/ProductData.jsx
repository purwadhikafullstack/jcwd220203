import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Img,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  useDisclosure,
  FormErrorMessage,
  ModalOverlay,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { axiosInstance } from "../../api/index";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg"


const ProductData = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [openedEdit, setOpenedEdit] = useState(null);
  const [images, setImages] = useState({});

  const [rows, setRows] = useState(0)
  const [admin, setAdmin] = useState([])
  const [pages, setPages] = useState(0)
  const [maxPage, setMaxPage] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState("")
  const [keywordHandler, setKeywordHandler] = useState("")
  const maxItemsPage = 5

  const fetchProductData = async () => {
    try {
      const productData = await axiosInstance.get("/product", {
        params: {
          _keywordHandler: keyword,
          _page: pages,
          _limit: maxItemsPage,
  
        },
      });;
      setData(productData.data.data);
      setAdmin(productData.data.data);
      setRows(productData.data.totalRows - maxItemsPage);
      setMaxPage(Math.ceil(productData.data.totalRows / maxItemsPage));
      console.warn(pages)
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  const nextPage = () => {
    setPages(pages + 1);
  };

  const prevPage = () => {
    setPages(pages - 1);
  };

  const searchKey = () => {
    setPages(0);
    setKeyword(keywordHandler);
  };

  // const fetchImages = async (id) => {
  //   try {
  //     const productDataImage = await axiosInstance.get(
  //       `/product/detail/images/${id}`
  //     );
  //     setImages(productDataImage.data.data);
  //     console.log(images);
  //     console.warn("test");
  //     setIsLoading(true);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const deleteBtnHandler = async (id) => {
    try {
      await axiosInstance.delete(`/product/${id}`);
      toast({ title: "Successfully deleted product", status: "success" });
      fetchProductData();
    } catch (error) {
      console.log(error);
    }
  };

  const renderProductData = () => {
    return data.map((val) => {
      return (
        <Tr key={val.id.toString()}>
          <Td>{val.id.toString()}</Td>
          <Td>{val.product_name || "null"}</Td>
          <Td>{val.description || "null"}</Td>
          <Td>
            {val.price.toLocaleString("in-ID", {
              style: "currency",
              currency: "IDR",
            }) || "null"}
          </Td>
          <Td>
            <Box>
              <Box mb={"2"}>
                <Link to={`/product/detail/${val.id}`}>
                  <Button
                    width={"100px"}
                    bgColor={"#0095DA"}
                    _hover={false}
                    color="white"
                    onClick={() => {}}
                  >
                    Edit
                  </Button>
                </Link>
              </Box>
              <Box>
                <Button
                  width={"100px"}
                  bgColor={"#F7931E"}
                  _hover={false}
                  color="white"
                  onClick={() => deleteBtnHandler(val)}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Td>
        </Tr>
      );
    });
  };

  const {
    isOpen: isOpenAddNewProduct,
    onOpen: onOpenAddNewProduct,
    onClose: onCloseAddNewProduct,
  } = useDisclosure();

  const formikAddProduct = useFormik({
    initialValues: {
      product_name: "",
      description: "",
      price: "",
    },
    onSubmit: async ({ product_name, description, price }) => {
      try {
        const response = await axiosInstance.post("/product/", {
          product_name,
          description,
          price,
        });
        toast({
          title: "Registration Success",
          description: response.data.message,
          status: "success",
        });
        formikAddProduct.setFieldValue("product_name", "");
        formikAddProduct.setFieldValue("description", "");
        formikAddProduct.setFieldValue("price", "");
        fetchProductData();
      } catch (error) {
        console.log(error.response);
        toast({
          title: "Registration Failed",
          description: error.response.data.message,
          status: "error",
        });
      }
    },
    validationSchema: Yup.object({
      product_name: Yup.string().required().min(3),
      description: Yup.string().required().min(3),
      price: Yup.number().required().min(3),
    }),
    validateOnChange: false,
  });

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;
    formikAddProduct.setFieldValue(name, value);
  };

  const editFormik = useFormik({
    initialValues: {
      product_name: "",
      description: "",
      price: "",
    },
    onSubmit: async (values) => {
      try {
        let editedWarehouse = {
          product_name: values.product_name,
          description: values.description,
          price: values.price,
          // UserId: values.UserId,
        };

        await axiosInstance.patch(
          `/warehouse/${openedEdit.id}`,
          editedWarehouse
        );

        toast({ title: "Warehouse edited", status: "success" });
        editFormik.setFieldValue("product_name", "");
        editFormik.setFieldValue("description", "");
        editFormik.setFieldValue("price", "");
        fetchProductData();
        setOpenedEdit(null);
      } catch (err) {
        console.log(err);
        toast({ title: "Server error while editing", status: "error" });
      }
    },
    validationSchema: Yup.object({
      product_name: Yup.string().required().min(3),
      description: Yup.string().required().min(3),
      price: Yup.number().required().min(3),
      // UserId: Yup.number().required(),
    }),
    validateOnChange: false,
  });

  const editFormChangeHandler = ({ target }) => {
    const { name, value } = target;
    editFormik.setFieldValue(name, value);
  };

  //Carousel
  const settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  useEffect(() => {
    fetchProductData();
  }, [openedEdit, images, pages, setPages, keyword]);

  useEffect(() => {
    // console.log(openedEdit.id)
    if (openedEdit) {
      // fetchImages(openedEdit.id);
      console.log(openedEdit.id);
      editFormik.setFieldValue("product_name", openedEdit.product_name);
      editFormik.setFieldValue("description", openedEdit.description);
      editFormik.setFieldValue("price", openedEdit.price);
    }
  }, [openedEdit]);

  return (
    <>
      <Box marginLeft="250px" marginTop="65px">
        <HStack justifyContent="space-between">
          <Text fontSize={"2xl"} fontWeight="bold" color={"#F7931E"}>
            Product Data
          </Text>
          <FormControl>
            <Input
              name="input"
              value={keywordHandler}
              onChange={(event) => setKeywordHandler(event.target.value)}
            />

            <Button onClick={searchKey} mr={0}>
              Search
            </Button>
          </FormControl>
          <Button
            bgColor={"#0095DA"}
            color="white"
            _hover={false}
            onClick={onOpenAddNewProduct}
          >
            Add New Product
          </Button>
        </HStack>

        <Table>
          <Thead>
            <Tr>
              <Th w="10px">ID</Th>
              {/* <Th w="100px">Photo Profile</Th> */}
              <Th w="150px">Name</Th>
              <Th w="450px">Description</Th>
              <Th>Price</Th>
            </Tr>
          </Thead>
          <Tbody>{isLoading && renderProductData()}</Tbody>
        </Table>
      </Box>
      <Text>
        Page: {pages + 1} of {maxPage}
      </Text>
      <Grid templateColumns={"repeat(3, 1fr"} mt={15}>
        <GridItem />
        <GridItem />
        <GridItem>
          {!admin.length ? (
            <Alert status="warning" ml="275px">
              <AlertIcon />
              <AlertTitle>No post found</AlertTitle>
            </Alert>
          ) : null}
          <HStack justifyContent={"end"} gap={"2px"}>
            {pages + 1 === 1 ? null : (
              <CgChevronLeft onClick={prevPage} color={"#9E7676"}>
                {""}
              </CgChevronLeft>
            )}
            <Text fontSize={"md"}>{pages + 1}</Text>
            {pages + 1 >= maxPage ? null : (
              <CgChevronRight onClick={nextPage} color={"#9E7676"}>
                Next
              </CgChevronRight>
            )}
          </HStack>
        </GridItem>
      </Grid>

      {/* Modal Add New Admin */}
      <Modal
        isOpen={isOpenAddNewProduct}
        onClose={onCloseAddNewProduct}
        motionPreset="slideInBottom"
        size={"md"}
      >
        <form onSubmit={formikAddProduct.handleSubmit}>
          <ModalOverlay />
          <ModalContent bgColor={"#0095DA"} color="white" p="20px">
            <ModalHeader fontSize={"2xl"} fontWeight="bold">
              New Product
            </ModalHeader>

            <ModalBody>
              <FormLabel>Name</FormLabel>
              <FormControl isInvalid={formikAddProduct.errors.product_name}>
                <Input
                  value={formikAddProduct.values.product_name}
                  name="product_name"
                  type="text"
                  onChange={formChangeHandler}
                />
                <FormErrorMessage>
                  {formikAddProduct.errors.product_name}
                </FormErrorMessage>
              </FormControl>

              <FormLabel mt={"15px"}>Description</FormLabel>
              <FormControl isInvalid={formikAddProduct.errors.description}>
                <Input
                  value={formikAddProduct.values.description}
                  name="description"
                  onChange={formChangeHandler}
                  //
                />
                <FormErrorMessage>
                  {formikAddProduct.errors.description}
                </FormErrorMessage>
              </FormControl>

              <FormLabel mt={"15px"}>Price</FormLabel>
              <FormControl isInvalid={formikAddProduct.errors.price}>
                <Input
                  value={formikAddProduct.values.price}
                  name="price"
                  onChange={formChangeHandler}
                  //
                />
                <FormErrorMessage>
                  {formikAddProduct.errors.price}
                </FormErrorMessage>
              </FormControl>

              {/* <FormLabel mt={"15px"}>Product Picture</FormLabel>
              <FormControl isInvalid={formikAddNewAdmin.errors.image_url}>
                  <Input
                    value={formikAddNewAdmin.values.image_url}
                    name="image_url"
                    type="tel"
                    onChange={formChangeHandler}
                  />
                <FormErrorMessage>
                  {formikAddNewAdmin.errors.image_url}
                </FormErrorMessage>
              </FormControl> */}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onCloseAddNewProduct}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                mr={3}
                onClick={formikAddProduct.handleSubmit}
              >
                Add New Product
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      {/* Modal edit */}
      <Modal isOpen={openedEdit} onClose={() => setOpenedEdit(null)}>
        <ModalContent bgColor="#0095DA" color="white">
          <ModalHeader>Editing Product Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack>
              <Box>
                <div className="carousel">
                  <Slider {...settings}>
                    {/* {isLoading && renderImages()} */}
                  </Slider>
                  <Text> Images </Text>
                </div>
              </Box>
              <Box>
                <FormControl isInvalid={editFormik.errors.product_name}>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    name="product_name"
                    type={"text"}
                    onChange={editFormChangeHandler}
                    value={editFormik.values.product_name}
                  />
                </FormControl>
                <FormControl isInvalid={editFormik.errors.description}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    name="description"
                    type={"text"}
                    onChange={editFormChangeHandler}
                    value={editFormik.values.description}
                  />
                </FormControl>
                <FormControl isInvalid={editFormik.errors.price}>
                  <FormLabel>Price</FormLabel>
                  <Input
                    name="price"
                    type={"text"}
                    onChange={editFormChangeHandler}
                    value={editFormik.values.price}
                  />
                </FormControl>
              </Box>
            </HStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => setOpenedEdit(null)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => editFormik.handleSubmit()}
              type="submit"
            >
              Edit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductData;
