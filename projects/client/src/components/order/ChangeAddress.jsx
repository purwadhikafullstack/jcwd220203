import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { axiosInstance } from "../../api"
import AddressChangeCard from "./AddressChangeCard"
import FormAddress from "../profile/FormAddress"
import { useFormik } from "formik"
import * as Yup from "yup"
import Alert from "../profile/Alert"
import EditForm from "../profile/EditForm"

const ChangeAddress = () => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const {
    onOpen: onOpenAddNewAddress,
    isOpen: isOpenAddNewAddress,
    onClose: onCloseAddNewAddress,
  } = useDisclosure()

  const {
    onOpen: onOpenAlertAddNewAddress,
    isOpen: isOpenAlertAddNewAddress,
    onClose: onCloseAlertAddNewAddress,
  } = useDisclosure()

  const {
    onOpen: onOpenAlert,
    isOpen: isOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure()

  const cancelRef = React.useRef()
  const toast = useToast()
  const [address, setAddress] = useState([])
  const [allAddress, setAllAddress] = useState([])
  const [defaultAlert, setDefaultAlert] = useState(null)
  const [selectedNewProvince, setSelectedNewProvince] = useState(0)
  const [selectedNewCity, setSelectedNewCity] = useState(0)
  const [selectedEditProvince, setSelectedEditProvince] = useState(0)
  const [selectedEditCity, setSelectedEditCity] = useState(0)
  const [openedEdit, setOpenedEdit] = useState(null)
  console.log(openedEdit)
  const fetchAddress = async () => {
    try {
      const response = await axiosInstance.get(
        "/checkoutAddress/defaultAddress"
      )
      setAddress(response.data.data)
    } catch (error) {
      console.log(error.response)
    }
  }

  const fetchAllAddress = async () => {
    try {
      const response = await axiosInstance.get("/checkoutAddress/allAddress")
      setAllAddress(response.data.data)
      console.log(response)
    } catch (error) {
      console.log(error.response)
    }
  }

  const setAsDefault = async (id) => {
    try {
      const response = await axiosInstance.patch(`/address/setDefault/${id}`)

      toast({
        message: "Address set as default",
        description: response.data.message,
        status: "success",
      })
      fetchAllAddress()
      fetchAddress()
    } catch (error) {
      console.log(error.response)
      toast({
        message: "Fail to set default",
        description: error.response.data.message,
        status: "error",
      })
    }
  }

  const formikAddNewAddress = useFormik({
    initialValues: {
      recipients_name: "",
      phone_number: "",
      address_labels: "",
      province: "",
      city: "",
      districts: "",
      full_address: "",
    },
    onSubmit: async ({
      recipients_name,
      phone_number,
      address_labels,
      districts,
      full_address,
    }) => {
      try {
        const response = await axiosInstance.post("/address/addNewAddress", {
          recipients_name,
          phone_number,
          address_labels,
          province: selectedNewProvince,
          city: selectedNewCity,
          districts,
          full_address,
        })
        toast({
          title: "Success to add new adderess",
          description: response.data.message,
          status: "success",
        })

        formikAddNewAddress.setFieldValue("recipients_name", "")
        formikAddNewAddress.setFieldValue("phone_number", "")
        formikAddNewAddress.setFieldValue("address_labels", "")
        formikAddNewAddress.setFieldValue("province", "")
        formikAddNewAddress.setFieldValue("city", "")
        formikAddNewAddress.setFieldValue("districts", "")
        formikAddNewAddress.setFieldValue("full_address", "")
        fetchAddress()
        fetchAllAddress()
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
      districts: "",
      full_address: "",
    },
    onSubmit: async ({
      recipients_name,
      phone_number,
      address_labels,
      province,
      city,
      districts,
      full_address,
    }) => {
      try {
        const response = await axiosInstance.patch(
          `/address/updateAddress/${openedEdit.id}`,
          {
            recipients_name,
            phone_number,
            address_labels,
            province: selectedEditProvince,
            city: selectedEditCity,
            districts,
            full_address,
          }
        )
        toast({
          title: "Address Edited",
          description: response.data.message,
          status: "success",
        })

        editFormik.setFieldValue("recipients_name", "")
        editFormik.setFieldValue("phone_number", "")
        editFormik.setFieldValue("address_labels", "")
        editFormik.setFieldValue("full_address", "")
        editFormik.setFieldValue("districts", "")
        fetchAddress()
        fetchAllAddress()
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
      districts: Yup.string(),
      full_address: Yup.string(),
    }),
    validateOnChange: false,
  })

  const editFormChangeHandler = ({ target }) => {
    const { name, value } = target
    editFormik.setFieldValue(name, value)
  }

  const doubleOnClick = () => {
    onCloseAlertAddNewAddress()
    onCloseAddNewAddress()
    setSelectedNewProvince(0)
    setSelectedNewCity(0)
    formikAddNewAddress.handleSubmit()
  }

  const doubleOnClick1 = () => {
    editFormik.handleSubmit()
    setSelectedEditProvince(0)
    setSelectedEditCity(0)
    onCloseAlert()
  }

  useEffect(() => {
    fetchAddress()
  }, [])

  useEffect(() => {
    fetchAllAddress()
  }, [isOpen])

  useEffect(() => {
    if (openedEdit) {
      editFormik.setFieldValue("address_labels", openedEdit.address_labels)
      editFormik.setFieldValue("full_address", openedEdit.full_address)
      editFormik.setFieldValue("recipients_name", openedEdit.recipients_name)
      editFormik.setFieldValue("phone_number", openedEdit.phone_number)
      editFormik.setFieldValue("districts", openedEdit.districts)
    }
  }, [openedEdit])
  return (
    <>
      <Box borderBottom="1px solid var(--N100,#DBDEE2)">
        <Text fontSize={"14px"} fontWeight="bold" pb="14px">
          Shipping Address
        </Text>
      </Box>
      <Box pb="15px" pt="10px">
        <Box>
          <Box display={"flex"} mb="4px">
            <Text fontWeight={"bold"} mr="2px">
              {address.recipients_name}
            </Text>
            <Text mr="1">{address.address_labels} </Text>
            <Box
              fontWeight={"bold"}
              fontSize="10px"
              backgroundColor="#E5F9F6"
              p="0 8px"
              my="auto"
              borderRadius={"3px"}
              color="#0095DA"
            >
              Main
            </Box>
          </Box>
          <Box mb="4px">
            <Text>{address.phone_number}</Text>
          </Box>
          <Box>
            <Text>{address.full_address}</Text>
            <Text>
              {address.districts}, {address.city}, {address.province}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box borderTop="1px solid var(--N100,#DBDEE2)" pt="15px" pb="5">
        <Button
          p="0 16px"
          mb="10px"
          border="1px solid var(--N100,#DBDEE2)"
          bgColor={"white"}
          onClick={onOpen}
        >
          <Text fontWeight={"bold"}>Choose Another Address</Text>
        </Button>
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        size={"3xl"}
      >
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
            <Text m="24px 0 16px">Address List</Text>
          </ModalHeader>
          <ModalCloseButton _hover={false} mt="10px" />

          <ModalBody
            overflowY={"scroll"}
            maxH="529px"
            p="24px 40px"
            fontSize={"14px"}
          >
            <Box
              p="20px"
              fontSize={"16px"}
              fontWeight="bold"
              mb="18px"
              border="1px dashed var(--N100,#DBDEE2)"
              borderRadius={"4px"}
              onClick={onOpenAddNewAddress}
            >
              <Text textAlign={"center"}> Add a New Address</Text>
            </Box>

            {allAddress.map((val) => {
              return (
                <AddressChangeCard
                  key={val.id.toString()}
                  address_labels={val.address_labels}
                  recipients_name={val.recipients_name}
                  full_address={val.full_address}
                  phone_number={val.phone_number}
                  id={val.id}
                  on_edit={() => setOpenedEdit(val)}
                  on_default={() => setAsDefault(val.id)}
                  is_default={val?.is_default}
                />
              )
            })}
          </ModalBody>
        </ModalContent>
      </Modal>

      <FormAddress
        isOpen={isOpenAddNewAddress}
        onClose={onCloseAddNewAddress}
        onOpen={onOpenAlertAddNewAddress}
        formChangeHandler={formChangeHandler}
        formik={formikAddNewAddress}
        header={"Add Address"}
        selectProvince={setSelectedNewProvince}
        selectCity={setSelectedNewCity}
      />

      <Alert
        header={"Add New Address"}
        body={"Is the address you entered correct?"}
        cancelRef={cancelRef}
        isOpen={isOpenAlertAddNewAddress}
        onClose={onCloseAlertAddNewAddress}
        onSubmit={() => doubleOnClick()}
        rightButton={"Add Address"}
        leftButton={"Change Address"}
        color={"#F7931E"}
      />

      {/* modal edit address */}
      <EditForm
        editFormChangeHandler={editFormChangeHandler}
        formik={editFormik}
        isOpenMod={openedEdit}
        onSubmit={onOpenAlert}
        onCloseMod={() => setOpenedEdit(null)}
        selectProvince={setSelectedEditProvince}
        selectCity={setSelectedEditCity}
      />

      {/* Alert Edit address */}
      <Alert
        header={"Edit Address"}
        body={"Is the address you entered correct?"}
        cancelRef={cancelRef}
        isOpen={isOpenAlert}
        onClose={onCloseAlert}
        onSubmit={() => doubleOnClick1()}
        rightButton={"Edit Address"}
        leftButton={"Change Address"}
        color={"#F7931E"}
      />
    </>
  )
}

export default ChangeAddress
