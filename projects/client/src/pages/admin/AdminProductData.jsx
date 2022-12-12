import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
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
  Image,
  Avatar,
  Select,
} from "@chakra-ui/react";
import { axiosInstance } from "../../api/index";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";
import { TbCameraPlus } from "react-icons/tb";
import upload from "../../assets/upload.png"

const AdminProductData = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [openedEdit, setOpenedEdit] = useState(null);
  const [rows, setRows] = useState(0);
  const [admin, setAdmin] = useState([]);
  const [pages, setPages] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [keywordHandler, setKeywordHandler] = useState("");
  const maxItemsPage = 5;

  const [selectedImage, setSelectedImage] = useState(null);
  const inputFileRef = useRef();

  const [category, setCategory] = useState({});

  const fetchProductData = async () => {
    try {
      const productData = await axiosInstance.get("/admin/product", {
        params: {
          _keywordHandler: keyword,
          _page: pages,
          _limit: maxItemsPage,
        },
      });
      setData(productData.data.data);
      setAdmin(productData.data.data);
      console.log(productData.data.data);
      // console.warn(productData.data.data.Image_Urls);
      // console.warn(data.Image_Urls);
      setRows(productData.data.totalRows - maxItemsPage);
      setMaxPage(Math.ceil(productData.data.totalRows / maxItemsPage));

      const categoryRes = await axiosInstance.get("/admin/product/category");
      setCategory(categoryRes.data.data);
      console.log(category);

      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  const renderCategory = () => {
    console.log(isLoading);
    console.warn(category);
    return Array.from(category).map((val) => {
      return (
        <option value={val.id} key={val.id.toString()}>
          {val.category_name}
        </option>
      );
    });
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

  const deleteBtnHandler = async (val) => {
    try {
      await axiosInstance.delete(`/admin/product/detail/${val.id}`);
      toast({ title: "Successfully deleted product", status: "success" });
      fetchProductData();
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(data.Image_Urls[0]);
  const renderProductData = () => {
    return data.map((val) => {
      return (
        <Tr key={val.id.toString()}>
          <Td>{val.id.toString()}</Td>
          <Td>
            <Image
              width="100px"
              height="100px"
              src={val?.Image_Urls[0]?.image_url}
            />
          </Td>
          <Td>{val.product_name || "null"}</Td>
          <Td>{val.description || "null"}</Td>
          <Td>
            {val.price
              ? val.price.toLocaleString("in-ID", {
                  style: "currency",
                  currency: "IDR",
                })
              : "null"}
          </Td>
          <Td>{val?.Category?.category_name}</Td>
          <Td>
            <Box>
              <Box mb={"2"}>
                <Link to={`/admin/product/detail/${val.id}`}>
                  <Button
                    width={"100px"}
                    bgColor={"#0095DA"}
                    _hover={false}
                    color="white"
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
      image_url:{},
      product_name: "",
      description: "",
      price: "",
      CategoryId: "",
    },
    onSubmit: async ({
      image_url,
      product_name,
      description,
      price,
      CategoryId,
    }) => {
      try {
        const data = new FormData();

        if (image_url) {
          console.log(image_url)
          data.append("image_url", image_url);
        }
        if (product_name) {
          data.append("product_name", product_name);
        }
        if (description) {
          data.append("description", description);
          console.log(description)
        }
        if (price) {
          data.append("price", price);
        }
        if (CategoryId) {
          data.append("CategoryId", CategoryId);
        }
        console.warn(data.image_url)
        const response = await axiosInstance.post("/admin/product/", 
          data
        );

        toast({
          title: "Registration Success",
          description: response.data.message,
          status: "success",
        });
        formikAddProduct.setFieldValue("image_url", "");
        formikAddProduct.setFieldValue("product_name", "");
        formikAddProduct.setFieldValue("description", "");
        formikAddProduct.setFieldValue("price", "");
        formikAddProduct.setFieldValue("CategoryId", "");
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
      CategoryId: Yup.number().required(),
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

  const onCloseModal = () => {
    formikAddProduct.handleSubmit();
    onCloseAddNewProduct();
  };
  useEffect(() => {
    fetchProductData();
    // fetchCategory();
  }, [openedEdit, pages, setPages, keyword]);

  useEffect(() => {
    if (openedEdit) {
      console.log(openedEdit.id);
      editFormik.setFieldValue("product_name", openedEdit.product_name);
      editFormik.setFieldValue("description", openedEdit.description);
      editFormik.setFieldValue("price", openedEdit.price);
      editFormik.setFieldValue("CategoryId", openedEdit.CategoryId);
    }
  }, [openedEdit]);

  return (
    <>
      <Box marginLeft="250px" marginTop="65px">
        <HStack justifyContent="space-between">
          <Text fontSize={"2xl"} fontWeight="bold" color={"#0095DA"}>
            Product Data
          </Text>
          <br />
          <Button
            bgColor={"#F7931E"}
            color="white"
            _hover={false}
            onClick={onOpenAddNewProduct}
          >
            Add New Product
          </Button>
        </HStack>
        <HStack mt="5px">
          <FormControl>
            <Input
              name="input"
              value={keywordHandler}
              onChange={(event) => setKeywordHandler(event.target.value)}
            />
          </FormControl>

          <Button onClick={searchKey} mr={0} bgColor="#F7931E" color="white">
            Search
          </Button>
        </HStack>
        <Table>
          <Thead>
            <Tr>
              <Th w="10px">ID</Th>
              <Th w="100px">Photo Profile</Th>
              <Th w="150px">Name</Th>
              <Th w="450px">Description</Th>
              <Th>Price</Th>
              <Th>Category</Th>
              <Th>Action</Th>
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
        size={"4xl"}
      >
        <form onSubmit={formikAddProduct.handleSubmit}>
          <ModalOverlay />
          <ModalContent bgColor={"#0095DA"} p="20px">
            <ModalHeader fontSize={"2xl"} fontWeight="bold">
              New Product
            </ModalHeader>

            <ModalBody>
              <HStack>
                <FormControl isInvalid={formikAddProduct.errors.image_url}>
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
                        : upload

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
                      console.log(e.target.files[0].File)
                      formikAddProduct.setFieldValue(
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
                    {formikAddProduct.errors.image_url}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
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
                />
                <FormErrorMessage>
                  {formikAddProduct.errors.price}
                </FormErrorMessage>
              </FormControl>

              <FormLabel mt={"15px"}>Category</FormLabel>
              <FormControl isInvalid={formikAddProduct.errors.CategoryId}>
                <Select
                  name="CategoryId"
                  onChange={formChangeHandler}
                  placeholder="Select category"
                >
                  {isLoading && renderCategory()}
                </Select>
                <FormErrorMessage>
                  {formikAddProduct.errors.CategoryId}
                </FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onCloseAddNewProduct}>
                Cancel
              </Button>
              <Button colorScheme="green" mr={3} onClick={onCloseModal}>
                Add New Product
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default AdminProductData;
