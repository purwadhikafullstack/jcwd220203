import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertTitle,
  HStack,
} from "@chakra-ui/react";
// import { useSelector } from "react-redux";
import { axiosInstance } from "../../api";
import Warehouse from "../../components/admin/Warehouse";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCallback } from "react";
import React, { useEffect, useState } from 'react';
import { CgChevronLeft, CgChevronRight } from "react-icons/cg"


const WarehouseManagement = () => {
  const [data, setData] = useState([]);
  const toast = useToast();
  const [adminUpdate, setAdminUpdate] = useState(false);
  // const authSelector = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(null);
  const [openedAdd, setOpenedAdd] = useState(null);
  
  
  const [rows, setRows] = useState(0)
  const [admin, setAdmin] = useState([])
  const [pages, setPages] = useState(0)
  const [maxPage, setMaxPage] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState("")
  const [keywordHandler, setKeywordHandler] = useState("")
  const maxItemsPage = 5


  const fetchWarehouse = useCallback(async () => {
    try {
      const fetchingWH = await axiosInstance.get(`/warehouse`, {
        params: {
          _keywordHandler: keyword,
          _page: pages,
          _limit: maxItemsPage,
  
        },
      });
      setData(fetchingWH.data.data);
      setIsLoading(true);
      setRows(fetchingWH.data.totalRows - maxItemsPage)
      setMaxPage(Math.ceil((fetchingWH.data.totalRows) / maxItemsPage))

      // console.log(fetchingWH.data.totalRows)
      setAdmin(fetchingWH.data.data)
    } catch (error) {
      console.log(error);
    }
  }, [pages, keyword]);

  const nextPage = () => {
    setPages(pages + 1)
  }

  const prevPage = () => {
    setPages(pages - 1)
  }

  const searchKey = () => {
    setPages(0)
    setKeyword(keywordHandler)
}

  const deleteBtnHandler = async (id) => {
    try {
      await axiosInstance.delete(`/warehouse/${id}`);

      fetchWarehouse();
      toast({ title: "Warehouse deleted", status: "info" });
    } catch (err) {
      console.log(err);
      toast({ title: "Error deleting data warehouse", status: "error" });
    }
  };

  const formik = useFormik({
    initialValues: {
      warehouse_name: "",
      address: "",
    },
    onSubmit: async (values) => {
      try {
        let addWarehouse = {
          warehouse_name: values.warehouse_name,
          address: values.address,
          // UserId: values.UserId,
        };

        await axiosInstance.post(`/warehouse`, addWarehouse);

        setAdminUpdate(false);
        toast({ title: "Warehouse added", status: "success" });
        fetchWarehouse();
        setOpenedAdd(null);
        formik.setFieldValue("warehouse_name", "");
        formik.setFieldValue("address", "");

      } catch (err) {
        console.log(err);
        toast({ title: "Server error while adding", status: "error" });
      }
    },
    validationSchema: Yup.object({
      warehouse_name: Yup.string().required().min(1),
      address: Yup.string().required(),
      // UserId: Yup.number().required(),
    }),
    validateOnChange: false,
  });

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;
    formik.setFieldValue(name, value);
  };
  const editFormik = useFormik({
    initialValues: {
      warehouse_name: openedEdit ? openedEdit.warehouse_name : "",
      address: openedEdit ? openedEdit.address : "",
    },
    onSubmit: async (values) => {
      try {
        let editedWarehouse = {
          warehouse_name: values.warehouse_name,
          address: values.address,
          // UserId: values.UserId,
        };

        await axiosInstance.patch(
          `/warehouse/${openedEdit.id}`,
          editedWarehouse
        );

        toast({ title: "Warehouse edited", status: "success" });
        editFormik.setFieldValue("warehouse_name", "");
        editFormik.setFieldValue("address", "");
        fetchWarehouse();
        setOpenedEdit(null);
      } catch (err) {
        console.log(err);
        toast({ title: "Server error while editing", status: "error" });
      }
    },
    validationSchema: Yup.object({
      warehouse_name: Yup.string().required().min(3),
      address: Yup.string().required(),
      // UserId: Yup.number().required(),
    }),
    validateOnChange: false,
  });

  const editFormChangeHandler = ({ target }) => {
    const { name, value } = target;
    editFormik.setFieldValue(name, value);
  };

  const renderWarehouse = () => {
    // console.log(isLoading);
    return data.map((val) => {
      return (
        <Warehouse
          key={val.id.toString()}
          id={val.id.toString()}
          warehouse_name={val.warehouse_name}
          address={val.address}
          state={val.state}
          username={val?.User?.username}
          latitude={val.latitude}
          longitude={val.longitude}
          onDelete={() => deleteBtnHandler(val.id)}
          onEdit={() => setOpenedEdit(val)}
        />
      );
    });
  };
  // console.log(data[0].address)
  const addWarehouse = () => {
    setAdminUpdate(true);
    setOpenedAdd(true);

  };
  const backWarehouse = async () => {
    setAdminUpdate(false);
  };

  console.warn({pages})
  useEffect(() => {
    fetchWarehouse();
  }, [fetchWarehouse, openedEdit, page, setPages, pages, keyword, setAdmin]);

  useEffect(() => {
    if (openedEdit) {
      // console.log(editFormik.values, openedEdit);
      editFormik.setFieldValue("warehouse_name", openedEdit.warehouse_name);
      editFormik.setFieldValue("address", openedEdit.address);
    }
  }, [openedEdit, openedAdd]);

  useEffect(() => {
  }, [pages])

 
  return (
    <Box marginBottom={"50px"} ml="275px" mt="65px">
      <Text fontSize={"30px"} fontWeight="bold">
        Warehouse Data
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
      <Text></Text>
      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>product_name</Th>
            <Th>Address</Th>
            <Th>State</Th>
            <Th>User</Th>
            {/* <Th>Latitude</Th>
            <Th>Longitude</Th> */}
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>{isLoading && renderWarehouse()}</Tbody>
      </Table>
      <Text>
        Page: {pages +1} of {maxPage}
      </Text>
      <Grid templateColumns={"repeat(3, 1fr"} mt={15}>
        <GridItem />
        <GridItem />
        <GridItem>
          {!admin.length ? (
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>No post found</AlertTitle>
            </Alert>
          ) : null}
          <HStack justifyContent={"end"} gap={"2px"}>
            {(pages +1) === 1 ? null : (
              <CgChevronLeft onClick={prevPage} color={"#9E7676"}>
                {""}
              </CgChevronLeft>
            )}
            <Text fontSize={"md"}>{(pages +1)}</Text>
            {(pages +1) >= maxPage ? null : (
              <CgChevronRight onClick={nextPage} color={"#9E7676"}>
                Next
              </CgChevronRight>
            )}
          </HStack>
        </GridItem>
      </Grid>
      <Divider />
        <Button
          colorScheme={"green"}
          marginLeft="64%"
          marginTop={"5%"}
          onClick={() => addWarehouse()}
          w="100px"
        >
          Add
        </Button>

      {/* Modal nambah data */}
      <Modal isOpen={openedAdd} onClose={() => setOpenedAdd(null)}>
        <ModalContent bgColor={"#0095DA"} color="white">
          <ModalHeader>Edit Warehouse</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <FormControl isInvalid={formik.errors.warehouse_name} />
                <FormLabel>product_name Warehouse</FormLabel>
                <Input
                  value={formik.values.warehouse_name}
                  placeholder={"Input warehouse name"}
                  name="warehouse_name"
                  onChange={formChangeHandler}
                  width="80%"
                  border="1px solid black"
                />
                <FormErrorMessage>
                  {formik.errors.warehouse_name}
                </FormErrorMessage>
                <FormControl isInvalid={formik.errors.address} />
                <FormLabel>Address Format: Kota, Provinsi, Negara</FormLabel>
                <Input
                  value={formik.values.address}
                  placeholder={"Input address"}
                  name="address"
                  onChange={formChangeHandler}
                  width="80%"
                />
                <FormErrorMessage>{formik.errors.address}</FormErrorMessage>
          </ModalBody>

          <ModalFooter>
          {/* <HStack justifyContent={"right"}> */}
                  <Button
                    onClick={backWarehouse}
                    colorScheme="orange"
                    w="100px"
                    mr="5px"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={formik.handleSubmit}
                    colorScheme="green"
                    w="100px"
                    type="submit"
                  >
                    Save
                  </Button>
                {/* </HStack> */}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal untuk Editing data */}
      <Modal isOpen={openedEdit} onClose={() => setOpenedEdit(null)}>
        <ModalContent bgColor={"#0095DA"} color="white">
          <ModalHeader>Edit Warehouse</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={editFormik.errors.warehouse_name}>
              <FormLabel>Warehouse Name</FormLabel>
              <Input
                name="warehouse_name"
                type={"text"}
                onChange={editFormChangeHandler}
                value={editFormik.values.warehouse_name}
              />
            </FormControl>
            <FormControl isInvalid={editFormik.errors.address}>
              <FormLabel>Address Format: Kota, Provinsi, Negara</FormLabel>
              <Text></Text>
              <Input
                name="address"
                type={"text"}
                onChange={editFormChangeHandler}
                value={editFormik.values.address}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              w="100px"
              mr={3}
              onClick={() => setOpenedEdit(null)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="green"
              w="100px"
              mr={3}
              onClick={() => editFormik.handleSubmit()}
              type="submit"
            >
              Edit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default WarehouseManagement;
