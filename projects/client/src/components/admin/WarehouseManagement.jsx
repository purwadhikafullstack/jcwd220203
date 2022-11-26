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
import Warehouse from "./Warehouse";
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


  const [book, setBook] = useState([])
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
      setBook(fetchingWH.data.data)
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
      nama_warehouse: "",
      address: "",
    },
    onSubmit: async (values) => {
      try {
        let addWarehouse = {
          nama_warehouse: values.nama_warehouse,
          address: values.address,
          // UserId: values.UserId,
        };

        await axiosInstance.post(`/warehouse`, addWarehouse);

        setAdminUpdate(false);
        toast({ title: "Warehouse added", status: "success" });
        fetchWarehouse();
        setOpenedAdd(null);
        formik.setFieldValue("nama_warehouse", "");
        formik.setFieldValue("address", "");

      } catch (err) {
        console.log(err);
        toast({ title: "Server error while adding", status: "error" });
      }
    },
    validationSchema: Yup.object({
      nama_warehouse: Yup.string().required().min(1),
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
      nama_warehouse: openedEdit ? openedEdit.nama_warehouse : "",
      address: openedEdit ? openedEdit.address : "",
    },
    onSubmit: async (values) => {
      try {
        let editedWarehouse = {
          nama_warehouse: values.nama_warehouse,
          address: values.address,
          // UserId: values.UserId,
        };

        await axiosInstance.patch(
          `/warehouse/${openedEdit.id}`,
          editedWarehouse
        );

        toast({ title: "Warehouse edited", status: "success" });
        editFormik.setFieldValue("nama_warehouse", "");
        editFormik.setFieldValue("address", "");
        fetchWarehouse();
        setOpenedEdit(null);
      } catch (err) {
        console.log(err);
        toast({ title: "Server error while editing", status: "error" });
      }
    },
    validationSchema: Yup.object({
      nama_warehouse: Yup.string().required().min(3),
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
          nama_warehouse={val.nama_warehouse}
          address={val.address}
          state={val.state}
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
  }, [fetchWarehouse, openedEdit, page, setPages, pages, keyword, setBook]);

  useEffect(() => {
    if (openedEdit) {
      // console.log(editFormik.values, openedEdit);
      editFormik.setFieldValue("nama_warehouse", openedEdit.nama_warehouse);
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
            <Th>Nama</Th>
            <Th>Address</Th>
            <Th>State</Th>
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
          {!book.length ? (
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
        >
          Add
        </Button>

      {/* Modal nambah data */}
      <Modal isOpen={openedAdd} onClose={() => setOpenedAdd(null)}>
        <ModalContent bgColor={"#0095DA"} color="white">
          <ModalHeader>Edit Warehouse</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <FormControl isInvalid={formik.errors.nama_warehouse} />
                <FormLabel>Nama Warehouse</FormLabel>
                <Input
                  value={formik.values.nama_warehouse}
                  placeholder={"Input warehouse name"}
                  name="nama_warehouse"
                  onChange={formChangeHandler}
                  width="80%"
                  border="1px solid black"
                />
                <FormErrorMessage>
                  {formik.errors.nama_warehouse}
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
                    width="15%"
                    mr="5px"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={formik.handleSubmit}
                    colorScheme="green"
                    width="15%"
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
            <FormControl isInvalid={editFormik.errors.nama_warehouse}>
              <FormLabel>Warehouse Name</FormLabel>
              <Input
                name="nama_warehouse"
                type={"text"}
                onChange={editFormChangeHandler}
                value={editFormik.values.nama_warehouse}
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
    </Box>
  );
};

export default WarehouseManagement;