import {
  Box,
  Button,
  Text,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormLabel,
  FormControl,
  Input,
  FormErrorMessage,
  Select,
  ModalCloseButton,
  Grid,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Textarea,
} from "@chakra-ui/react"
import { BiUser } from "react-icons/bi"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import AddressCard from "../../components/profile/AddressCard"
import { axiosInstance } from "../../api/index"
import React, { useState } from "react"
import { useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import FormAddress from "../../components/profile/FormAddress"

const AddressList = () => {
 const authSelector = useSelector((state) => state.auth)
  const [province, setProvince] = useState([])
  const [city, setCity] = useState([])
  const [districts, setDistricts] = useState([])
  const [ward, setWard] = useState([])
  const [selectedProvince, setSelectedProvince] = useState(0)
  const [selectedCity, setSelectedCity] = useState(0)
  const [selectedDistricts, setSelectedDistricts] = useState(0)
  const [openedEdit, setOpenedEdit] = useState(null)
  const authSelector = useSelector((state) => state.auth)
  const [address, setAddress] = useState([])
  const [deleteAlert, setDeleteAlert] = useState(null)
  const {
    onOpen: onOpenAlert,
    isOpen: isOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure()
  const {
    isOpen: isOpenAddNewAddress,
    onOpen: onOpenAddNewAddress,
    onClose: onCloseAddNewAddress,
  } = useDisclosure()

  const doubleOnClick1 = () => {
    editFormik.handleSubmit()
    onCloseAlert()
  }

  const doubleOnClick2 = () => {
    setDeleteAlert(null)
    deleteHandler(deleteAlert.id)
  }

  const toast = useToast()
  const { onOpen, isOpen, onClose } = useDisclosure()

  const doubleOnClick = () => {
    onClose()
    onCloseAddNewAddress()
    formikAddNewAddress.handleSubmit()
  }

  const cancelRef = React.useRef()

  const fetchAddres = async () => {
    try {
      const response = await axiosInstance.get("/address/userAddress")
      setAddress(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const renderAddress = () => {
    return address.map((val) => {
      return (
        <AddressCard
          key={val.id.toString()}
          address_labels={val.address_labels}
          recipients_name={val.recipients_name}
          full_address={val.full_address}
          phone_number={val.phone_number}
          id={val.id}
          on_delete={() => setDeleteAlert(val)}
          on_edit={() => setOpenedEdit(val)}
        />
      )
    })
  }

  const formikAddNewAddress = useFormik({
    initialValues: {
      recipients_name: "",
      phone_number: "",
      address_labels: "",
      // province: "",
      // city: "",
      // districts: "",
      full_address: "",
    },
    onSubmit: async ({
      recipients_name,
      phone_number,
      address_labels,
      // province,
      // city,
      // districts,
      full_address,
    }) => {
      try {
        const response = await axiosInstance.post("/address/addNewAddress", {
          recipients_name,
          phone_number,
          address_labels,
          // province,
          // city,
          // districts,
          full_address,
        })
        toast({
          title: "Success to add new adderess",
          description: response.data.message,
          status: "success",
        })
        fetchAddres()
      } catch (error) {
        console.log(error.response)
        toast({
          title: "Failed to add",
          description: error.response.data.message,
          status: "error",
        })
      }
    },
    validationSchema: Yup.object({
      recipients_name: Yup.string().required(),
      phone_number: Yup.string()
        .required(9)
        .matches(
          /(\+62 ((\d{3}([ -]\d{3,})([- ]\d{4,})?)|(\d+)))|(\(\d+\) \d+)|\d{3}( \d+)+|(\d+[ -]\d+)|\d+/,
          "Phone number must be valid"
        ),
      address_labels: Yup.string().required(),
      full_address: Yup.string().required(),
    }),
    validateOnChange: false,
  })

  const formChangeHandler = ({ target }) => {
    const { name, value } = target
    formikAddNewAddress.setFieldValue(name, value)
  }

  const editFormik = useFormik({
    initialValues: {
      recipients_name: "",
      phone_number: "",
      address_labels: "",
      // province: "",
      // city: "",
      districts: "",
      full_address: "",
    },
    onSubmit: async ({
      recipients_name,
      phone_number,
      address_labels,
      // province,
      // city,
      // districts,
      full_address,
    }) => {
      try {
        const response = await axiosInstance.patch(
          `/userData/editAdmin/${openedEdit.id}`,
          {
            recipients_name,
            phone_number,
            address_labels,
            // province,
            // city,
            // districts,
            full_address,
          }
        )
        toast({
          title: "Admin Edited",
          description: response.data.message,
          status: "success",
        })

        editFormik.setFieldValue("recipients_name", "")
        editFormik.setFieldValue("phone_number", "")
        editFormik.setFieldValue("address_labels", "")
        // editFormik.setFieldValue("province", "")
        // editFormik.setFieldValue("city", "")
        // editFormik.setFieldValue("districts", "")
        editFormik.setFieldValue("full_address", "")
        fetchAddres()
        setOpenedEdit(null)
      } catch (error) {
        console.log(error)
        toast({
          title: "Failed Edit Admin",
          description: error.response.data.message,
          status: "error",
        })
      }
    },
    validationSchema: Yup.object({
      recipients_name: Yup.string(),
      phone_number: Yup.number(),
      address_labels: Yup.string(),
      full_address: Yup.string(),
    }),
    validateOnChange: false,
  })

  const editFormChangeHandler = ({ target }) => {
    const { name, value } = target
    editFormik.setFieldValue(name, value)
  }

  const fetchProvince = async () => {
    try {
      const response = await axiosInstance.get("/address/province")

      setProvince(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const renderProvince = () => {
    return province.map((val) => {
      return (
        <option value={val.id} key={val.id.toString()}>
          {val.name}
        </option>
      )
    })
  }

  const fetchCity = async () => {
    try {
      const response = await axiosInstance.get(
        `/address/city/${selectedProvince}`
      )

      setCity(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const renderCity = () => {
    return city.map((val) => {
      return (
        <option value={val.id} key={val.id.toString()}>
          {val.name}
        </option>
      )
    })
  }

  const fetchDistricts = async () => {
    try {
      const response = await axiosInstance.get(
        `/address/districts/${selectedCity}`
      )

      setDistricts(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const renderDistricts = () => {
    return districts.map((val) => {
      return (
        <option value={val.id} key={val.id.toString()}>
          {val.name}
        </option>
      )
    })
  }

  const fetchWard = async () => {
    try {
      const response = await axiosInstance.get(
        `/address/ward/${selectedDistricts}`
      )

      setWard(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const renderWard = () => {
    return ward.map((val) => {
      return (
        <option value={val.id} key={val.id.toString()}>
          {val.name}
        </option>
      )
    })
  }

  const provinceHandler = ({ target }) => {
    const { value } = target
    console.log(value)
    setSelectedProvince(value)
  }

  const cityHandler = ({ target }) => {
    const { value } = target
    console.log(value)
    setSelectedCity(value)
  }

  const districtsHandler = ({ target }) => {
    const { value } = target
    console.log(value)
    setSelectedDistricts(value)
  }

  const deleteHandler = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/address/deleteAddress/${id}`
      )
      toast({
        message: "address deleted",
        description: response.data.message,
        status: "success",
      })
      fetchAddres()
    } catch (error) {
      console.log(error.response)
      toast({
        message: "Failed to delete",
        description: error.response.data.message,
        status: "error",
      })
    }
  }

  useEffect(() => {
    fetchAddres()
  }, [openedEdit, deleteAlert])
  useEffect(() => {
    if (openedEdit) {
      editFormik.setFieldValue("address_labels", openedEdit.address_labels)
      editFormik.setFieldValue("full_address", openedEdit.full_address)
      editFormik.setFieldValue("recipients_name", openedEdit.recipients_name)
      editFormik.setFieldValue("phone_number", openedEdit.phone_number)
    }
  }, [openedEdit])
  useEffect(() => {
    fetchProvince()
  }, [])
  useEffect(() => {
    fetchCity()
  }, [selectedProvince])
  useEffect(() => {
    fetchDistricts()
  }, [selectedCity])
  useEffect(() => {
    fetchWard()
  }, [selectedDistricts])
  return (
    <Box mt="55px" fontSize={"16px"} color="rgba(0,0,0,.54)">
      <Box w="1208px" marginX={"auto"}>
        <Box display={"flex"} mt="80px" mb="16px">
          <Box mr="8px" my={"auto"}>
            <BiUser fontSize={"20px"} />
          </Box>
          <Text fontSize={"16px"} fontWeight="bold" my={"auto"}>
            {authSelector.username}
          </Text>
        </Box>
        <Box border={"1px solid #dfe1e3"} borderRadius="10px">
          <HStack>
            {/* Personal Info */}
            <Box display={"flex"} height="53px" fontWeight={"bold"}>
              <Link to="/user/profile">
                <Box p="16px 24px" _hover={{ color: "#0095DA" }}>
                  <Text>Personal Info</Text>
                </Box>
              </Link>
            </Box>

            {/* Change Password */}
            <Box display={"flex"} height="53px" fontWeight={"bold"}>
              <Link to="/user/profile/change-password">
                <Box p="16px 24px" _hover={{ color: "#0095DA" }}>
                  <Text>Change Password</Text>
                </Box>
              </Link>
            </Box>

            {/* Address List */}
            <Box display={"flex"} height="53px" fontWeight={"bold"}>
              <Button
                p="16px 24px"
                color="#0095DA"
                borderBottom={"2px solid #0095DA"}
                borderRadius="1px"
                variant="link"
              >
                <Text>Address List</Text>
              </Button>
            </Box>
          </HStack>
          <Box borderTop={"1px solid #dfe1e3"} p="30px 16px 16px">
            <Box textAlign={"right"}>
              <Button
                m="0 4px"
                _hover={false}
                color="white"
                bgColor={"#F7931E"}
                onClick={onOpenAddNewAddress}
              >
                Add A New Address
              </Button>
            </Box>
            {renderAddress()}
          </Box>
        </Box>
      </Box>

      {/* add new address modal */}
      <FormAddress
        isOpenAddNewAddress={isOpenAddNewAddress}
        onCloseAddNewAddress={onCloseAddNewAddress}
        onOpen={onOpen}
        formChangeHandler={formChangeHandler}
        formik={formikAddNewAddress}
      />

      {/* Alert Add New Address */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            p={"32px 32px 24px"}
            my="auto"
            boxSize={"-moz-fit-content"}
            maxW="600px"
          >
            <AlertDialogHeader p="0"></AlertDialogHeader>
            <AlertDialogBody textAlign={"center"} p="0">
              <Text fontSize={"16px"} m="0px 16px 16px">
                Is the data you entered correct?
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter p="0" alignSelf="center">
              <Button
                ref={cancelRef}
                onClick={onClose}
                w="164px"
                h="48px"
                mr={"6px"}
                borderRadius="8px"
                fontWeight={"bold"}
                bgColor="white"
                border="1px solid #F7931E"
                color={" #F7931E"}
                _hover={false}
              >
                Change
              </Button>
              <Button
                fontWeight={"bold"}
                bgColor="#F7931E"
                color={"white"}
                type="submit"
                onClick={() => doubleOnClick()}
                w="164px"
                h="48px"
                borderRadius="8px"
                _hover={false}
              >
                Yes, right
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* modal edit address */}
      <Modal
        isOpen={openedEdit}
        // onClose={setOpenedEdit(null)}
        motionPreset="slideInBottom"
        size={"3xl"}
      >
        <form>
          <ModalOverlay />
          <ModalContent mt={"90px"} borderRadius="8px" overflow={false}>
            <ModalHeader
              fontSize={"24px"}
              fontWeight="bold"
              textAlign={"center"}
              borderBottom="1px solid #dfe1e3"
              p="0"
              h="36px"
            >
              <Text m="24px 0 16px">Change Address</Text>
            </ModalHeader>
            <ModalCloseButton _hover={false} mt="10px" />

            <ModalBody
              overflowY={"scroll"}
              maxH="529px"
              p="24px 40px"
              fontSize={"14px"}
            >
              <Text
                mb={"24px"}
                fontSize={"20px"}
                fontWeight="bold"
                color={"black"}
              >
                Complete the address details
              </Text>
              <Box mt="34px" mb="4px">
                <FormLabel mb="8px">Address Labels</FormLabel>
                <FormControl isInvalid={editFormik.errors.address_labels}>
                  <Input
                    value={editFormik.values.address_labels}
                    name="address_labels"
                    type="text"
                    onChange={editFormChangeHandler}
                  />
                  <FormErrorMessage>
                    {editFormik.errors.address_labels}
                  </FormErrorMessage>
                </FormControl>
              </Box>

              <Box mt="12px">
                <FormLabel mb={"8px"}>Full Address</FormLabel>
                <FormControl isInvalid={editFormik.errors.full_address}>
                  <Textarea
                    value={editFormik.values.full_address}
                    name="full_address"
                    size={"md"}
                    resize="none"
                    maxLength={200}
                    p="12px 8px"
                    h={"119px"}
                    onChange={editFormChangeHandler}
                  />

                  <FormErrorMessage>
                    {editFormik.errors.full_address}
                  </FormErrorMessage>
                </FormControl>
              </Box>

              <Box mt="34px" mb="4px">
                <FormLabel mb="8px">Recipient's Name</FormLabel>
                <FormControl isInvalid={editFormik.errors.recipients_name}>
                  <Input
                    value={editFormik.values.recipients_name}
                    name="recipients_name"
                    type={"text"}
                    onChange={editFormChangeHandler}
                  />

                  <FormErrorMessage>
                    {editFormik.errors.recipients_name}
                  </FormErrorMessage>
                </FormControl>
              </Box>

              <Box mt="12px">
                <Grid templateColumns={"repeat(2, 1fr)"} gap="4">
                  <Box>
                    <FormLabel mb="8px">Province</FormLabel>
                    <FormControl
                    // isInvalid={editFormik.errors.province}
                    >
                      <Select
                        onChange={provinceHandler}
                        placeholder="Select Province"
                        // value={editFormik.values.province}
                      >
                        {renderProvince()}
                      </Select>
                      <FormErrorMessage>
                        {/* {editFormik.errors.province} */}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormLabel mb={"8px"}>City</FormLabel>
                    <FormControl
                    // isInvalid={editFormik.errors.city}
                    >
                      <Select onChange={cityHandler} placeholder="Select City">
                        {/* {renderCity()} */}
                      </Select>
                      <FormErrorMessage>
                        {/* {editFormik.errors.city} */}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormLabel mb="8px">Districts</FormLabel>
                    <FormControl
                      onChange={districtsHandler}
                      // isInvalid={editFormik.errors.province}
                    >
                      <Select
                        onChange={districtsHandler}
                        placeholder="Select Districs"
                        // value={editFormik.values.province}
                      >
                        {/* {renderDistricts()} */}
                      </Select>
                      <FormErrorMessage>
                        {/* {editFormik.errors.province} */}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormLabel mb={"8px"}>Ward</FormLabel>
                    <FormControl
                    // isInvalid={editFormik.errors.city}
                    >
                      <Select placeholder="Select Ward">
                        {/* {renderWard()} */}
                      </Select>
                      <FormErrorMessage>
                        {/* {editFormik.errors.city} */}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                </Grid>
              </Box>

              <Box mt="34px" mb="4px">
                <FormLabel mb="8px">Phone Number</FormLabel>
                <FormControl isInvalid={editFormik.errors.phone_number}>
                  <Input
                    value={editFormik.values.phone_number}
                    name="phone_number"
                    type="number"
                    onChange={editFormChangeHandler}
                  />
                  <FormErrorMessage>
                    {editFormik.errors.phone_number}
                  </FormErrorMessage>
                </FormControl>
              </Box>

              <Text m="10px 12px" textAlign={"center"}>
                By clicking "Save", you agree to the
                <Text
                  color={"#F7931E"}
                  ml="2px"
                  display="inline"
                  fontWeight="bold"
                >
                  Terms & Conditions
                </Text>
              </Text>
              <Box m="16px 0px" textAlign={"center"}>
                <Button
                  p="0px 16px"
                  fontSize={"16px"}
                  color="white"
                  fontWeight={"bold"}
                  w="80px"
                  _hover={false}
                  bgColor="#F7931E"
                  onClick={onOpenAlert}
                >
                  Save
                </Button>
              </Box>
            </ModalBody>
          </ModalContent>
        </form>
      </Modal>

      {/* Alert Edit address */}
      <AlertDialog
        isOpen={isOpenAlert}
        leastDestructiveRef={cancelRef}
        onClose={onCloseAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            p={"32px 32px 24px"}
            my="auto"
            boxSize={"-moz-fit-content"}
            maxW="600px"
          >
            <AlertDialogHeader p="0"></AlertDialogHeader>
            <AlertDialogBody textAlign={"center"} p="0">
              <Text fontSize={"16px"} m="0px 16px 16px">
                Is the data you entered correct?
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter p="0" alignSelf="center">
              <Button
                ref={cancelRef}
                onClick={onCloseAlert}
                w="164px"
                h="48px"
                mr={"6px"}
                borderRadius="8px"
                fontWeight={"bold"}
                bgColor="white"
                border="1px solid #F7931E"
                color={" #F7931E"}
                _hover={false}
              >
                Change
              </Button>
              <Button
                fontWeight={"bold"}
                bgColor="#F7931E"
                color={"white"}
                type="submit"
                onClick={doubleOnClick1}
                w="164px"
                h="48px"
                borderRadius="8px"
                _hover={false}
              >
                Yes, right
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Alert Delete */}
      <AlertDialog
        isOpen={deleteAlert}
        leastDestructiveRef={cancelRef}
        onClose={() => setDeleteAlert(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            p={"32px 32px 24px"}
            my="auto"
            boxSize={"-moz-fit-content"}
            maxW="600px"
          >
            <AlertDialogHeader p="0"></AlertDialogHeader>
            <AlertDialogBody textAlign={"center"} p="0">
              <Text fontSize={"16px"} m="0px 16px 16px">
                Is the data you entered correct??
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter p="0" alignSelf="center">
              <Button
                ref={cancelRef}
                onClick={() => setDeleteAlert(null)}
                w="164px"
                h="48px"
                mr={"6px"}
                borderRadius="8px"
                fontWeight={"bold"}
                bgColor="white"
                border="1px solid #F7931E"
                color={" #F7931E"}
                _hover={false}
              >
                Change
              </Button>
              <Button
                fontWeight={"bold"}
                bgColor="#F7931E"
                color={"white"}
                type="submit"
                onClick={() => doubleOnClick2()}
                w="164px"
                h="48px"
                borderRadius="8px"
                _hover={false}
              >
                Sure
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

export default AddressList
