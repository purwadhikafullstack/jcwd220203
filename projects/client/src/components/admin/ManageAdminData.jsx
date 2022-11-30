import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import React, { useEffect } from "react"
import { useState } from "react"
import { axiosInstance } from "../../api"
import * as Yup from "yup"
import { BiShow } from "react-icons/bi"
import { BiHide } from "react-icons/bi"

const ManageAdminData = () => {
  const [userData, setUserData] = useState([])
  const [warehouseData, setWarehouseData] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const togglePassword = () => {
    setShowPassword(!showPassword)
  }
  const cancelRef = React.useRef()

  const toast = useToast()

  const {
    isOpen: isOpenAddNewAdmin,
    onOpen: onOpenAddNewAdmin,
    onClose: onCloseAddNewAdmin,
  } = useDisclosure()

  const { onOpen, isOpen, onClose } = useDisclosure()

  const {
    onOpen: onOpenAlert,
    isOpen: isOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure()

  const [openedEdit, setOpenedEdit] = useState(null)
  // console.log(openedEdit?.id)

  const [deleteAlert, setDeleteAlert] = useState(null)

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/userData/getAllWarehouseAdmin")

      setUserData(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const renderUser = () => {
    return userData.map((val) => {
      return (
        <Tr key={val.id.toString()}>
          <Td>{val.id.toString()}</Td>
          <Td>{val.profile_picture || "null"}</Td>
          <Td>{val.username || "null"}</Td>
          <Td>{val.email}</Td>
          <Td>{val.phone_number || "null"}</Td>
          <Td>{val.Role.role_name || "null"}</Td>
          <Td>{val.Warehouse?.nama_warehouse || "null "}</Td>
          <Td>
            <Box>
              <Box mb={"2"}>
                <Button
                  width={"100px"}
                  bgColor={"#0095DA"}
                  _hover={false}
                  color="white"
                  onClick={() => setOpenedEdit(val)}
                >
                  Edit
                </Button>
              </Box>
              <Box>
                <Button
                  width={"100px"}
                  bgColor={"#F7931E"}
                  _hover={false}
                  color="white"
                  onClick={() => setDeleteAlert(val)}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Td>
        </Tr>
      )
    })
  }

  const formikAddNewAdmin = useFormik({
    initialValues: {
      email: "",
      password: "",
      phone_number: "",
      username: "",
    },
    onSubmit: async ({
      email,
      password,
      phone_number,
      username,
      WarehouseId,
    }) => {
      try {
        const response = await axiosInstance.post("/userData/addNewAdmin", {
          email,
          password,
          phone_number,
          username,
          WarehouseId,
        })
        toast({
          title: "Registration Success",
          description: response.data.message,
          status: "success",
        })
        formikAddNewAdmin.setFieldValue("email", "")
        formikAddNewAdmin.setFieldValue("password", "")
        formikAddNewAdmin.setFieldValue("phone_number", "")
        formikAddNewAdmin.setFieldValue("username", "")
        fetchUserData()
      } catch (error) {
        console.log(error.response)
        toast({
          title: "Registration Failed",
          description: error.response.data.message,
          status: "error",
        })
      }
    },
    validationSchema: Yup.object({
      email: Yup.string().required().email(),
      password: Yup.string()
        .required(8)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
      phone_number: Yup.string()
        .required(10)
        .matches(
          /^(\+62 ((\d{3}([ -]\d{3,})([- ]\d{4,})?)|(\d+)))|(\(\d+\) \d+)|\d{3}( \d+)+|(\d+[ -]\d+)|\d+/
        ),
      username: Yup.string().required(6),
    }),
    validateOnChange: false,
  })

  const formChangeHandler = ({ target }) => {
    const { name, value } = target
    formikAddNewAdmin.setFieldValue(name, value)
  }

  const editFormik = useFormik({
    initialValues: {
      phone_number: "",
      profile_picture: "",
      username: "",
    },
    onSubmit: async ({ email, phone_number, profile_picture, username, WarehouseId }) => {
      try {
        const adminData = new FormData()

        if (email) {
          adminData.append("email", email)
        }

        if (phone_number) {
          adminData.append("phone_number", phone_number)
        }

        if (profile_picture) {
          adminData.append("profile_picture", profile_picture)
        }

        if (username) {
          adminData.append("username", username)
        }
        
        if (WarehouseId) {
          adminData.append("WarehouseId", WarehouseId)
        }

        const response = await axiosInstance.patch(
          `/userData/editAdmin/${openedEdit.id}`,
          adminData
        )
        toast({
          title: "Admin Edited",
          description: response.data.message,
          status: "success",
        })

        editFormik.setFieldValue("phone_number", "")
        editFormik.setFieldValue("profile_picture", "")
        editFormik.setFieldValue("username", "")
        fetchUserData()
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
      password: Yup.string().matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
      phone_number: Yup.number(),
      username: Yup.string(),
    }),
    validateOnChange: false,
  })

  const deleteAdminHandler = async (id) => {
    try {
      await axiosInstance.delete(`/userData/deleteAdmin/${id}`)

      fetchUserData()

      toast({
        title: "Admin Deleted",
        status: "info",
      })
    } catch (error) {
      console.log(error.response)
      toast({
        title: "Failed Delete Admin",
        description: error.response.data.message,
        status: "error",
      })
    }
  }

  const editFormChangeHandler = ({ target }) => {
    const { name, value } = target
    editFormik.setFieldValue(name, value)
  }

  const fetchAllWarehouse = async () => {
    try {
      const response = await axiosInstance.get("/userData/findAllWarehouse")

      setWarehouseData(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const renderWarehouse = () => {
    return warehouseData.map((val) => {
      return (
        <option key={val.id.toString()} value={val.id.toString()}>
          {val.nama_warehouse}
        </option>
      )
    })
  }

  const doubleOnClick = () => {
    onClose()
    onCloseAddNewAdmin()
    formikAddNewAdmin.handleSubmit()
  }

  const doubleOnClick1 = () => {
    editFormik.handleSubmit()
    onCloseAlert()
  }

  const doubleOnClick2 = () => {
    setDeleteAlert(null)
    deleteAdminHandler(deleteAlert.id)
  }

  useEffect(() => {
    fetchUserData()
  }, [openedEdit, deleteAlert])

  useEffect(() => {
    fetchAllWarehouse()
  }, [])

  useEffect(() => {
    if (openedEdit) {
      editFormik.setFieldValue("email", openedEdit.email)
      editFormik.setFieldValue("phone_number", openedEdit.phone_number)
      editFormik.setFieldValue("profile_picture", openedEdit.profile_picture)
      editFormik.setFieldValue("username", openedEdit.username)
    }
  }, [openedEdit])
  return (
    <Box marginLeft={"230px"}>
      <Box p="20px 0" display={"flex"} justifyContent="space-between" mr="2">
        <Text fontSize={"2xl"} fontWeight="bold" color={"#F7931E"}>
          Admin Data
        </Text>

        <Button
          bgColor={"#0095DA"}
          color="white"
          _hover={false}
          onClick={onOpenAddNewAdmin}
        >
          Add New Admin
        </Button>
      </Box>
      <Table>
        <Thead>
          <Tr>
            <Th w="10px">ID</Th>
            <Th w="100px">Photo Profile</Th>
            <Th>Username</Th>
            <Th>Email</Th>
            <Th>Phone Number</Th>
            <Th>Role</Th>
            <Th>Warehouse</Th>
            <Th>Option</Th>
          </Tr>
        </Thead>
        <Tbody>{renderUser()}</Tbody>
      </Table>

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

      {/* Modal Add New Admin */}
      <Modal
        isOpen={isOpenAddNewAdmin}
        onClose={onCloseAddNewAdmin}
        motionPreset="slideInBottom"
        size={"md"}
      >
        <form onSubmit={formikAddNewAdmin.handleSubmit}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize={"2xl"} fontWeight="bold">
              New Admin
            </ModalHeader>

            <ModalBody>
              <FormLabel>Username</FormLabel>
              <FormControl isInvalid={formikAddNewAdmin.errors.username}>
                <Input
                  value={formikAddNewAdmin.values.username}
                  name="username"
                  type="text"
                  onChange={formChangeHandler}
                />
                <FormErrorMessage>
                  {formikAddNewAdmin.errors.username}
                </FormErrorMessage>
              </FormControl>

              <FormLabel mt={"15px"}>Email</FormLabel>
              <FormControl isInvalid={formikAddNewAdmin.errors.email}>
                <Input
                  value={formikAddNewAdmin.values.email}
                  name="email"
                  type="email"
                  onChange={formChangeHandler}
                  //
                />
                <FormErrorMessage>
                  {formikAddNewAdmin.errors.email}
                </FormErrorMessage>
              </FormControl>

              <FormLabel mt={"15px"}>Password</FormLabel>
              <FormControl isInvalid={formikAddNewAdmin.errors.password}>
                <InputGroup>
                  <Input
                    value={formikAddNewAdmin.values.password}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={formChangeHandler}
                  />
                  <InputRightElement width="3rem">
                    <Button
                      size="sm"
                      _active={false}
                      _hover={false}
                      onClick={togglePassword}
                      color={"#0095DA"}
                      bgColor="transparent"
                    >
                      {showPassword ? <BiShow /> : <BiHide />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {formikAddNewAdmin.errors.password}
                </FormErrorMessage>
              </FormControl>

              <FormLabel mt={"15px"}>Warehouse</FormLabel>
              <FormControl
              // isInvalid={formikAddNewAdmin.errors.WarehouseId}
              >
                <Select
                  // isDisabled
                  onChange={formChangeHandler}
                  placeholder="Select warehouse"
                  name="WarehouseId"
                >
                  {renderWarehouse()}
                </Select>
                <FormErrorMessage>
                  {/* {formikAddNewAdmin.errors.WarehouseId} */}
                </FormErrorMessage>
              </FormControl>

              <FormLabel mt={"15px"}>Phone Number</FormLabel>
              <FormControl isInvalid={formikAddNewAdmin.errors.phone_number}>
                <InputGroup>
                  <InputLeftAddon children="+62" />
                  <Input
                    value={formikAddNewAdmin.values.phone_number}
                    name="phone_number"
                    type="tel"
                    onChange={formChangeHandler}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {formikAddNewAdmin.errors.phone_number}
                </FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onCloseAddNewAdmin}>
                Cancel
              </Button>
              <Button colorScheme="green" mr={3} onClick={onOpen}>
                Add New Admin
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      {/* Alert Add New Admin */}
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

      {/* Modal Edit Admin */}
      <Modal
        isOpen={openedEdit}
        onClose={() => setOpenedEdit(null)}
        motionPreset="slideInBottom"
        size={"2xl"}
      >
        <form onSubmit={editFormik.handleSubmit}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize={"2xl"} fontWeight="bold">
              Edit Admin
            </ModalHeader>

            <ModalBody>
              <Grid templateColumns={"2fr 3fr 3fr"} gap="4">
                <GridItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl isInvalid={editFormik.errors.profile_picture}>
                    <Image w={"150px"} h="150px" borderRadius={"0"} />
                    <Input
                      w="100%"
                      _hover={false}
                      fontWeight="bold"
                      bgColor={"white"}
                      onChange={(e) =>
                        editFormik.setFieldValue(
                          "profile_picture",
                          e.target.files[0]
                        )
                      }
                      accept="image/*"
                      name="profile_picture"
                      type="file"
                      color="transparent"
                      border="0"
                    />
                    <FormErrorMessage>
                      {editFormik.errors.profile_picture}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl isInvalid={editFormik.errors.username}>
                    <Input
                      value={editFormik.values.username}
                      name="username"
                      type="text"
                      onChange={editFormChangeHandler}
                    />
                    <FormErrorMessage>
                      {editFormik.errors.username}
                    </FormErrorMessage>
                  </FormControl>

                  <FormLabel mt="15px">Email</FormLabel>
                  <FormControl
                  // isInvalid={editFormik.errors.email}
                  >
                    <Input
                      disabled
                      // value={editFormik.values.email}
                      name="email"
                      type="text"
                      onChange={editFormChangeHandler}
                      //
                    />
                    <FormErrorMessage>
                      {/* {editFormik.errors.email} */}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormLabel>Warehouse</FormLabel>
                  <FormControl
                  // isInvalid={editFormik.errors.WarehouseId}
                  >
                    <Select
                      // isDisabled
                      // value={editFormik.values.WarehouseId}
                      onChange={editFormChangeHandler}
                      placeholder="Select Warehouse"
                      name="WarehouseId"
                      // onChange={(event) => setValue(event.target.value)}
                    >
                      {renderWarehouse()}
                    </Select>
                    <FormErrorMessage>
                      {/* {editFormik.errors.WarehouseId} */}
                    </FormErrorMessage>
                  </FormControl>

                  <FormLabel mt="15px">Phone Number</FormLabel>
                  <FormControl isInvalid={editFormik.errors.phone_number}>
                    <InputGroup>
                      <InputLeftAddon children="+62" />
                      <Input
                        value={editFormik.values.phone_number}
                        name="phone_number"
                        type="tel"
                        onChange={editFormChangeHandler}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {editFormik.errors.phone_number}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>
              </Grid>
            </ModalBody>

            <ModalFooter>
              <Button bgColor="#0095DA" color={"white"} mr={3} _hover={false}>
                Change Password
              </Button>
              <Button
                bgColor="white"
                border={"1px solid #F7931E"}
                _hover={false}
                color="#F7931E"
                mr={3}
                onClick={() => setOpenedEdit(null)}
              >
                Cancel
              </Button>
              <Button
                bgColor="#F7931E"
                color={"white"}
                _hover={false}
                mr={3}
                onClick={onOpenAlert}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      {/* Alert Edit admin */}
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
    </Box>
  )
}
export default ManageAdminData
