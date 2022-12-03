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
  useDisclosure,
} from "@chakra-ui/react";
// import { useSelector } from "react-redux";
import { axiosInstance } from "../../api";
import Warehouse from "../../components/admin/Warehouse";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCallback } from "react";
import React, { useEffect, useState } from "react";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";
import WarehouseAddress from "./WarehouseAddress";
import WarehouseAddressEdit from "./WarehouseAddressEdit";


const WarehouseManagement = () => {
  const [data, setData] = useState([]);
  const toast = useToast();
  // const authSelector = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(null);

  const [rows, setRows] = useState(0);
  const [pages, setPages] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [keywordHandler, setKeywordHandler] = useState("");
  const maxItemsPage = 5;

  const [selectedProvince, setSelectedProvince] = useState(0);
  const [selectedCity, setSelectedCity] = useState(0);

  const { onOpen, isOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenAddNewWarehouseAddress,
    onOpen: onOpenAddNewWarehouseAddress,
    onClose: onCloseAddNewWarehouseAddress,
  } = useDisclosure();
  const {
    isOpen: isOpenEditWarehouseAddress,
    onOpen: onOpenEditWarehouseAddress,
    onClose: onCloseEditWarehouseAddress,
  } = useDisclosure();


  const { onOpen, isOpen, onClose } = useDisclosure()

  const {
    isOpen: isOpenAddNewWarehouseAddress,
    onOpen: onOpenAddNewWarehouseAddress,
    onClose: onCloseAddNewWarehouseAddress,
  } = useDisclosure()
  
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
      setRows(fetchingWH.data.totalRows - maxItemsPage);
      setMaxPage(Math.ceil(fetchingWH.data.totalRows / maxItemsPage));
      editFormik.setFieldValue("nama_warehouse", openedEdit.nama_warehouse);
      editFormik.setFieldValue("address_labels", openedEdit.address_labels);
      editFormik.setFieldValue("province", openedEdit.province);
      editFormik.setFieldValue("city", openedEdit.city);
      editFormik.setFieldValue("districts", openedEdit.districts);
      editFormik.setFieldValue("full_address", openedEdit.full_address);
    } catch (error) {
      console.log(error);
    }
  }, [pages, keyword]);

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

  const addFormik = useFormik({
    initialValues: {
      nama_warehouse: "",
      address_labels: "",
      province: "",
      city: "",
      districts: "",
      full_address: "",
    },
    onSubmit: async (values) => {
      try {
        let addWarehouse = {
          nama_warehouse: values.nama_warehouse,
          address_labels: values.address_labels,
          province: selectedProvince,
          city: selectedCity,
          districts: values.districts,
          full_address: values.full_address,
        };

        const response = await axiosInstance.post(`/warehouse`, addWarehouse);
        console.log(response);

        toast({ title: "Warehouse added", status: "success" });
        fetchWarehouse();
        addFormik.setFieldValue("nama_warehouse", "");
        addFormik.setFieldValue("address_labels", "");
        addFormik.setFieldValue("province", "");
        addFormik.setFieldValue("city", "");
        addFormik.setFieldValue("districts", "");
        addFormik.setFieldValue("full_address", "");

      } catch (err) {
        console.log(err);
        toast({ title: "Server error while adding", status: "error" });
      }
    },
    validationSchema: Yup.object({
      nama_warehouse: Yup.string().required().min(1),
      address_labels: Yup.string().required(),
      districts: Yup.string().required(),
      full_address: Yup.string().required(),
    }),
    validateOnChange: false,
  });

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;
    addFormik.setFieldValue(name, value);
  };

  const onOpenedEditHandler = (val) => {
    onOpenEditWarehouseAddress()
    setOpenedEdit(val)
  }
  const onSubmitAddForm = () => {
    addFormik.handleSubmit();
    onCloseAddNewWarehouseAddress();
  };
  const onSubmitEditForm = () => {
    editFormik.handleSubmit();
    onCloseEditWarehouseAddress();
  };
  
  const editFormik = useFormik({
    initialValues: {
      nama_warehouse: openedEdit ? openedEdit.nama_warehouse : "",
      address_labels: openedEdit ? openedEdit.address_labels : "",
      province: openedEdit ? openedEdit.province : "",
      city: openedEdit ? openedEdit.city : "",
      districts: openedEdit ? openedEdit.districts : "",
      full_address: openedEdit ? openedEdit.full_address : "",
    },
    onSubmit: async (values) => {
      try {
        let editedWarehouse = {
          nama_warehouse: values.nama_warehouse,
          address_labels: values.address_labels,
          province: values.province,
          city: values.city,
          districts: values.districts,
          full_address: values.full_address,
        };

        await axiosInstance.patch(
          `/warehouse/${openedEdit.id}`,
          editedWarehouse
        );

        toast({ title: "Warehouse edited", status: "success" });
        editFormik.setFieldValue("nama_warehouse", "");
        editFormik.setFieldValue("address_labels", "");
        editFormik.setFieldValue("province", "");
        editFormik.setFieldValue("city", "");
        editFormik.setFieldValue("districts", "");
        editFormik.setFieldValue("full_address", "");
        fetchWarehouse();
        setOpenedEdit(null);
      } catch (err) {
        console.log(err);
        toast({ title: "Server error while editing", status: "error" });
      }
    },
    validationSchema: Yup.object({
      nama_warehouse: Yup.string().required().min(1),
      address_labels: Yup.string().required(),
      districts: Yup.string().required(),
      full_address: Yup.string().required(),
    }),
    validateOnChange: false,
  });

  const editFormChangeHandler = ({ target }) => {
    const { name, value } = target;
    editFormik.setFieldValue(name, value);
  };

  const renderWarehouse = () => {
    return data.map((val) => {
      return (
        <Warehouse
          key={val.id.toString()}
          id={val.id.toString()}
          nama_warehouse={val.nama_warehouse}
          full_address={val.full_address}
          address_labels={val.address_labels}
          province={val.province}
          city={val.city}
          districts={val.districts}
          username={val?.User?.username}
          latitude={val.latitude}
          longitude={val.longitude}
          onDelete={() => deleteBtnHandler(val.id)}
          onEdit={() => onOpenedEditHandler(val)}
        />
      );
    });
  };

  useEffect(() => {
    fetchWarehouse();
  }, [openedEdit, page, pages]);

  useEffect(() => {}, [pages]);

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
            <Th>Full Address</Th>
            <Th>Province</Th>
            <Th>City</Th>
            <Th>District</Th>
            <Th>User</Th>
            {/* <Th>Latitude</Th>
            <Th>Longitude</Th> */}
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>{isLoading && renderWarehouse()}</Tbody>
      </Table>
      <Text>
        Page: {pages + 1} of {maxPage}
      </Text>
      <Grid templateColumns={"repeat(3, 1fr"} mt={15}>
        <GridItem />
        <GridItem />
        <GridItem>
          {!data.length ? (
            <Alert status="warning">
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
      <Divider />

      <HStack justifyContent={"space-between"}>     
      <Box></Box>
      <Button
        colorScheme={"green"}
        marginLeft="64%"
        marginTop={"5%"}
        onClick={() => onOpenAddNewWarehouseAddress()}
        w="100px"
      >
        Add
      </Button>
      </HStack>

      {/* Modal nambah data */}
      <WarehouseAddress
        isOpen={isOpenAddNewWarehouseAddress}
        onClose={onCloseAddNewWarehouseAddress}
        onSubmit={() => onSubmitAddForm()}
        formChangeHandler={formChangeHandler}
        formik={addFormik}
        header={"Add Form"}
        selectProvince={setSelectedProvince}
        selectCity={setSelectedCity}
      />


      {/* Modal untuk Editing data */}
      <WarehouseAddressEdit
        isOpen={isOpenEditWarehouseAddress}
        onClose={onCloseEditWarehouseAddress}
        onSubmit={() => onSubmitEditForm()}
        formChangeHandler={editFormChangeHandler}
        formik={editFormik}
        header={"Change Form"}
        selectProvince={setSelectedProvince}
        selectCity={setSelectedCity}
      />


    </Box>
  );
};

export default WarehouseManagement;
