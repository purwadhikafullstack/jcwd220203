import {
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
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
import AddNewAdmin from "../../components/admin/AddNewAdmin"
import Alert from "../../components/profile/Alert"
import EditAdmin from "../../components/admin/EditAdmin"
import { TbSearch } from "react-icons/tb"
import { IoIosAlert } from "react-icons/io"

const ManageAdminData = () => {
  const [userData, setUserData] = useState([])
  const cancelRef = React.useRef()
  const [currentSearch, setCurrentSearch] = useState("")
  const [totalCount, setTotalCount] = useState(0)
  const [sortBy, setSortBy] = useState("username")
  const [sortDir, setSortDir] = useState("ASC")
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

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
  const [selectedImage, setSelectedImage] = useState(null)
  const [deleteAlert, setDeleteAlert] = useState(null)

  const fetchAdminData = async () => {
    const maxItemsPerPage = 6
    try {
      const response = await axiosInstance.get(
        "/userData/getAllWarehouseAdmin",
        {
          params: {
            _page: page,
            _limit: maxItemsPerPage,
            username: currentSearch,
            _sortBy: sortBy,
            _sortDir: sortDir,
          },
        }
      )

      setTotalCount(response.data.dataCount)
      setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage))

      if (page === 1) {
        setUserData(response.data.data)
      } else {
        setUserData(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const renderUser = () => {
    return userData.map((val) => {
      return (
        <Tr key={val.id.toString()}>
          <Td p="5px" w="100px">
            <Avatar
              size={"lg"}
              borderRadius={"0"}
              name={val.username}
              src={val.profile_picture}
            />
          </Td>
          <Td p="5px">{val.username}</Td>
          <Td p="5px" w="240px">
            {val.email}
          </Td>
          <Td p="5px" w="160px">
            {val.phone_number || "null"}
          </Td>
          <Td p="5px">{val.Role.role_name || "null"}</Td>
          <Td p="5px">{val.Warehouse?.warehouse_name || "null "}</Td>
          <Td p="5px">
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

  const nextPage = () => {
    setPage(page + 1)
  }

  const previousPage = () => {
    setPage(page - 1)
  }

  const formikAddNewAdmin = useFormik({
    initialValues: {
      email: "",
      password: "",
      phone_number: "",
      username: "",
      WarehouseId: "",
    },
    onSubmit: async ({
      email,
      password,
      phone_number,

      profile_picture,
      username,
      WarehouseId,
    }) => {
      try {
        const adminData = new FormData()

        if (email) {
          adminData.append("email", email)
        }

        if (password) {
          adminData.append("password", password)
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

        const response = await axiosInstance.post(
          "/userData/addNewAdmin",
          adminData
        )

        toast({
          title: "Registration Success",
          description: response.data.message,
          status: "success",
        })
        formikAddNewAdmin.setFieldValue("email", "")
        formikAddNewAdmin.setFieldValue("password", "")
        formikAddNewAdmin.setFieldValue("phone_number", "")
        formikAddNewAdmin.setFieldValue("username", "")
        formikAddNewAdmin.setFieldValue("WarehouseId", "")
        fetchAdminData()
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
      phone_number: Yup.number().required(9),
      profile_picture: Yup.string().required(),
      username: Yup.string().required(6),
    }),
    validateOnChange: false,
  })

  const editFormik = useFormik({
    initialValues: {
      phone_number: "",
      profile_picture: "",
      username: "",
      WarehouseId: "",
    },
    onSubmit: async ({
      email,
      phone_number,
      profile_picture,
      username,
      WarehouseId,
    }) => {
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
        editFormik.setFieldValue("WarehouseId", "")
        fetchAdminData()
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

      fetchAdminData()

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

  const formikSearch = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: ({ search }) => {
      setCurrentSearch(search)
      setPage(1)
    },
  })

  const searchAdminHandler = ({ target }) => {
    const { name, value } = target
    formikSearch.setFieldValue(name, value)
  }
  const sortCategoryHandler = ({ target }) => {
    const { value } = target
    setSortBy(value.split(" ")[0])
    setSortDir(value.split(" ")[1])
  }
  const doubleOnClick = () => {
    onClose()
    onCloseAddNewAdmin()
    formikAddNewAdmin.handleSubmit()
  }

  const doubleOnClick1 = () => {
    editFormik.handleSubmit()
    onCloseAlert()
    setSelectedImage(null)
  }

  const doubleOnClick2 = () => {
    setDeleteAlert(null)
    deleteAdminHandler(deleteAlert.id)
  }

  useEffect(() => {
    fetchAdminData()
  }, [
    openedEdit,
    deleteAlert,
    selectedImage,
    currentSearch,
    page,
    sortDir,
    sortBy,
  ])

  useEffect(() => {
    if (openedEdit) {
      editFormik.setFieldValue("email", openedEdit.email)
      editFormik.setFieldValue("phone_number", openedEdit.phone_number)
      editFormik.setFieldValue("profile_picture", openedEdit.profile_picture)
      editFormik.setFieldValue("username", openedEdit.username)
      editFormik.setFieldValue("WarehouseId", openedEdit.WarehouseId)
    }
  }, [openedEdit])
  return (
    <Box marginLeft={"230px"}>
      <Box p="20px 0" display={"flex"} justifyContent="space-between" mr="2">
        <Box display={"flex"} gap="4" my={"auto"}>
          <Text fontSize={"2xl"} fontWeight="bold" color={"#F7931E"}>
            Admin Data
          </Text>
          <Text fontSize={"2xl"} fontWeight="bold" color={"#0095DA"}>
            Total Admin:{totalCount}
          </Text>
        </Box>

        <Box gap="4" display={"flex"}>
          <Text my="auto">Sort</Text>
          <Select
            onChange={sortCategoryHandler}
            fontSize={"15px"}
            fontWeight="normal"
            fontFamily="serif"
            width={"137px"}
            color={"#6D6D6F"}
            _placeholder="Sort By"
          >
            <option value="username ASC" selected>
              Name A-Z
            </option>
            <option value="username DESC">Name Z-A</option>
            <option value="createdAt DESC">Latest</option>
            <option value="createdAt ASC">Old</option>
          </Select>

          <form onSubmit={formikSearch.handleSubmit}>
            <FormControl>
              <InputGroup textAlign={"right"}>
                <Input
                  type={"text"}
                  placeholder="Search by username"
                  name="search"
                  w="200px"
                  onChange={searchAdminHandler}
                  _placeholder={"halo"}
                  borderRightRadius="0"
                  value={formikSearch.values.search}
                />

                <Button borderLeftRadius={"0"} type="submit">
                  <TbSearch />
                </Button>
              </InputGroup>
            </FormControl>
          </form>

          <Button
            w={"200px"}
            bgColor={"#0095DA"}
            color="white"
            _hover={false}
            onClick={onOpenAddNewAdmin}
          >
            Add New Admin
          </Button>
        </Box>
      </Box>
      <Table>
        <Thead>
          <Tr>
            <Th p="5px">Photo Profile</Th>
            <Th p="5px">Username</Th>
            <Th p="5px">Email</Th>
            <Th p="5px">Phone Number</Th>
            <Th p="5px">Role</Th>
            <Th p="5px">Warehouse</Th>
            <Th p="5px">Option</Th>
          </Tr>
        </Thead>
        <Tbody>{renderUser()}</Tbody>
      </Table>
      {!userData.length ? (
        <Box p="10px" bgColor={"#E5F9F6"}>
          <Box mx="auto">
            <Box display={"flex"} mx="auto" w="170px">
              <IoIosAlert fontSize={"25px"} color="#0095DA" />
              <Text fontWeight="medium" ml="2">
                No admin found
              </Text>
            </Box>
          </Box>
        </Box>
      ) : null}

      {/* Alert Delete */}
      <Alert
        body={`Areyou sure to delete "${deleteAlert?.username}"`}
        cancelRef={cancelRef}
        color={"#0095DA"}
        header={"Delete Admin"}
        isOpen={deleteAlert}
        leftButton={"Cancel"}
        onClose={() => setDeleteAlert(null)}
        onSubmit={() => doubleOnClick2()}
        rightButton={"Delete"}
      />

      {/* Modal Add New Admin */}

      <AddNewAdmin
        formikAddNewAdmin={formikAddNewAdmin}
        isOpenAddNewAdmin={isOpenAddNewAdmin}
        onCloseAddNewAdmin={onCloseAddNewAdmin}
        header="Add New Admin"
        onOpen={onOpen}
        color="#0095DA"
      />

      {/* Alert Add New Admin */}
      <Alert
        header={"Add New Admin"}
        body={"Is data that you entered is correct"}
        cancelRef={cancelRef}
        isOpen={isOpen}
        leftButton={"Cancel"}
        onClose={onClose}
        rightButton={"Add New Admin"}
        onSubmit={() => doubleOnClick()}
        color={"#0095DA"}
      />

      {/* Modal Edit Admin */}
      <EditAdmin
        editFormik={editFormik}
        isOpen={openedEdit}
        header={"Edit Admin"}
        onClose={() => setOpenedEdit(null)}
        color={"#0095DA"}
        onOpen={onOpenAlert}
        onCloseMod={() => setOpenedEdit(null)}
      />

      {/* Alert Edit admin */}
      <Alert
        body={"Is data that you entered correct?"}
        cancelRef={cancelRef}
        color={"#0095DA"}
        header={"Edit Admin"}
        isOpen={isOpenAlert}
        leftButton={"Cancel"}
        onClose={onCloseAlert}
        onSubmit={doubleOnClick1}
        rightButton={"Edit Admin"}
      />

      <Box p="20px">
        <Box textAlign={"center"}>
          {page === 1 ? null : (
            <Button onClick={previousPage} disabled={page === 1 ? true : null}>
              {"<"}
            </Button>
          )}
          {page >= maxPage ? null : (
            <Button
              onClick={nextPage}
              ml="10px"
              disabled={page >= maxPage ? true : null}
            >
              {">"}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}
export default ManageAdminData
