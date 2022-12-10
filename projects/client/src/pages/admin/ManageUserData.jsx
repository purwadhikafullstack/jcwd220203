import {
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
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useEffect } from "react"
import { useState } from "react"
import { IoIosAlert } from "react-icons/io"
import { TbSearch } from "react-icons/tb"
import { axiosInstance } from "../../api"
import AddressModal from "../../components/admin/AddressModal"

const ManageUserData = () => {
  const [userData, setUserData] = useState([])
  const [currentSearch, setCurrentSearch] = useState("")
  const [totalCount, setTotalCount] = useState(0)
  const [sortBy, setSortBy] = useState("username")
  const [sortDir, setSortDir] = useState("ASC")
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [openedAddress, setOpenedAddress] = useState(false)

  const nextPage = () => {
    setPage(page + 1)
  }

  const previousPage = () => {
    setPage(page - 1)
  }

  const fetchUserData = async () => {
    const maxItemsPerPage = 8
    try {
      const response = await axiosInstance.get("/userData/getAllUser", {
        params: {
          _page: page,
          _limit: maxItemsPerPage,
          username: currentSearch,
          _sortBy: sortBy,
          _sortDir: sortDir,
        },
      })

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
  const apiImg = process.env.REACT_APP_IMAGE_URL

  const renderUser = () => {
    return userData.map((val) => {
      return (
        <Tr h="auto">
          <Td p="5px" w={"100px"}>
            <Avatar
              size={"lg"}
              borderRadius={"0"}
              name={val.username}
              src={`${apiImg}/${val.profile_picture}`}
            />
          </Td>
          <Td p="5px">{val.username || "null"}</Td>
          <Td p="5px">{val.email}</Td>
          <Td p="5px">{val.phone_number || "null"}</Td>
          <Td p="5px" maxW={"200px"}>
            <Button onClick={() => setOpenedAddress(val)}>Details</Button>
          </Td>
        </Tr>
      )
    })
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

  useEffect(() => {
    fetchUserData()
  }, [currentSearch, page, sortDir, sortBy, openedAddress])
  return (
    <Box marginLeft={"230px"}>
      <Box p="20px 0" display={"flex"} justifyContent="space-between" mr="4">
        <Box display={"flex"} gap="4" my={"auto"}>
          <Text fontSize={"2xl"} fontWeight="bold" color={"#F7931E"}>
            User Data
          </Text>
          <Text fontSize={"2xl"} fontWeight="bold" color={"#0095DA"}>
            Total User:{totalCount}
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
        </Box>
      </Box>
      <Table>
        <Thead>
          <Tr>
            <Th p="5px">Photo Profile</Th>
            <Th p="5px">Username</Th>
            <Th p="5px">Email</Th>
            <Th p="5px">Phone Number</Th>
            <Th p="5px">Address</Th>
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
                No user found
              </Text>
            </Box>
          </Box>
        </Box>
      ) : null}
      <Box p="20px">
        <Box>
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

      <AddressModal
        color={"#F7931E"}
        header="Details Address"
        isOpen={openedAddress}
        onClose={() => setOpenedAddress(null)}
        val={openedAddress?.Addresses?.map((val) => {
          if (!val) {
            return "halo"
          } else {
            return (
              <>
                <Text>Receptients Name: {val.recipients_name} </Text>
                <Text>Full Address: {val.full_address}</Text>
                <Text>Phone Number:{val.phone_number}</Text>
              </>
            )
          }
        })}
      />
    </Box>
  )
}
export default ManageUserData
