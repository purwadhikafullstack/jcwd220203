import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { axiosInstance } from "../../api";
import Warehouse from "./Warehouse";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCallback } from "react";

const WarehouseManagement = () => {
  const [data, setData] = useState({});
  const toast = useToast();
  const [adminUpdate, setAdminUpdate] = useState(false);
  // const authSelector = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(null);

  const fetchWarehouse = useCallback(async () => {
    try {
      const fetchingWH = await axiosInstance.get(`/warehouse`);
      setData(fetchingWH.data.data);
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const deleteBtnHandler = async (id) => {
    try {
      await axiosInstance.delete(`/warehouse/${id}`);

      fetchWarehouse();
      toast({ title: "Post deleted", status: "info" });
    } catch (err) {
      console.log(err);
      toast({ title: "Error deleting data", status: "error" });
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
      } catch (err) {
        console.log(err);
        toast({ title: "Server error while adding", status: "error" });
      }
    },
    validationSchema: Yup.object({
      nama_warehouse: Yup.string().required().min(3),
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
      nama_warehouse: "",
      address: "",
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
          onDelete={() => deleteBtnHandler(val.id)}
          onEdit={() => setOpenedEdit(val)}
        />
      );
    });
  };
  // console.log(data[0].address)
  const addWarehouse = () => {
    setAdminUpdate(true);
  };
  const backWarehouse = async () => {
    setAdminUpdate(false);
  };
  useEffect(() => {
    fetchWarehouse();
  }, [fetchWarehouse, openedEdit]);

  useEffect(() => {
    if (openedEdit) {
      editFormik.setFieldValue("nama_warehouse", openedEdit.nama_warehouse);
      editFormik.setFieldValue("address", openedEdit.address);
    }
  }, [openedEdit, editFormik]);

  return (
    <Box marginBottom={"50px"}>
      <Text fontSize={"30px"} fontWeight="bold">
        Warehouse Data
      </Text>
      <Text></Text>
      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Nama</Th>
            <Th>Address</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>{isLoading && renderWarehouse()}</Tbody>
      </Table>
      <Divider />
      {!adminUpdate ? (
        <Button
          colorScheme={"green"}
          marginLeft="64%"
          marginTop={"5%"}
          onClick={() => addWarehouse()}
        >
          Add
        </Button>
      ) : (
        <Box>
          <Box
            className="formborder"
            border={"2px solid black"}
            marginRight="20%"
            paddingLeft={"20px"}
            paddingBottom={"20px"}
          >
            <form onSubmit={formik.handleSubmit}>
              <Stack>
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
                <FormLabel>Address</FormLabel>
                <Input
                  value={formik.values.address}
                  placeholder={"Input address"}
                  name="address"
                  onChange={formChangeHandler}
                  width="80%"
                />
                <FormErrorMessage>{formik.errors.address}</FormErrorMessage>
                {/* <FormControl isInvalid={formik.errors.UserId} />
              <FormLabel>UserId</FormLabel>
              <Input
                value={formik.values.UserId}
                placeholder={"Input UserId"}
                name="UserId"
                onChange={formChangeHandler}
                width="80%"
              />
              <FormErrorMessage>{formik.errors.UserId}</FormErrorMessage> */}
                <HStack justifyContent={"right"}>
                  <Button
                    onClick={backWarehouse}
                    colorScheme="orange"
                    width="15%"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={formik.handleSubmit}
                    colorScheme="green"
                    width="15%"
                  >
                    Save
                  </Button>
                </HStack>
              </Stack>
            </form>
          </Box>
        </Box>
      )}
      <Modal isOpen={openedEdit} onClose={() => setOpenedEdit(null)}>
        <ModalContent>
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
              <FormLabel>Address</FormLabel>
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
