import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  Input,
  InputGroup,
  Select,
  Skeleton,
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
import { AiOutlineLeftCircle, AiOutlineRightCircle } from "react-icons/ai"
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
  const [isLoading, setIsLoading] = useState(false)

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
      setIsLoading(true)
    } catch (error) {
      console.log(error)
    }
  }
  const apiImg = process.env.REACT_APP_IMAGE_URL

  const renderUser = () => {
    return userData.map((val) => {
      return (
        <Tr h="auto">
          <Td p="10px" w={"100px"}>
            <Avatar
              size={"lg"}
              borderRadius={"0"}
              name={val.username}
              src={`${apiImg}/${val.profile_picture}`}
            />
          </Td>
          <Td p="10px">{val.username || "null"}</Td>
          <Td p="10px">{val.email}</Td>
          <Td p="10px">{val.phone_number || "null"}</Td>
          <Td p="10px" maxW={"200px"}>
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
    <Box ml="220px" p="24px" bgColor={"var(--NN50,#F0F3F7);"} h="100vh">
      <Box mb="16px">
        <Text fontSize={"2xl"} fontWeight="bold" color={"#F7931E"}>
          User Data({totalCount})
        </Text>
      </Box>

      <Grid gap="4" templateColumns={"repeat(2, 1fr)"} mt="4" mb="4">
        <Select
          onChange={sortCategoryHandler}
          fontSize={"15px"}
          color={"#6D6D6F"}
          placeholder="Sort"
          bgColor={"white"}
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
                bgColor={"white"}
                onChange={searchAdminHandler}
                borderRightRadius="0"
                value={formikSearch.values.search}
              />

              <Button
                borderLeftRadius={"0"}
                type="submit"
                bgColor={"white"}
                border="1px solid #e2e8f0"
                borderLeft={"0px"}
              >
                <TbSearch />
              </Button>
            </InputGroup>
          </FormControl>
        </form>
      </Grid>

      <Table
        variant={"striped"}
        colorScheme={"blue"}
        bgColor="white"
        borderRadius="8px"
        boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
      >
        <Thead>
          <Tr>
            <Th p="10px">Photo Profile</Th>
            <Th p="10px">Username</Th>
            <Th p="10px">Email</Th>
            <Th p="10px">Phone Number</Th>
            <Th p="10px">Address</Th>
          </Tr>
        </Thead>
        <Tbody>{isLoading && renderUser()}</Tbody>
      </Table>
      {!userData.length && isLoading === true ? (
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
      {isLoading === false ? (
        <Skeleton
          startColor="#bab8b8"
          endColor="#d4d2d2"
          height="90px"
          borderRadius="8px"
        />
      ) : null}

      <Box p="20px" fontSize={"16px"}>
        <Box textAlign={"center"}>
          <Button
            onClick={previousPage}
            disabled={page === 1 ? true : null}
            _hover={false}
            _active={false}
          >
            <AiOutlineLeftCircle fontSize={"20px"} />
          </Button>

          <Box display={"inline"}>{page}</Box>

          <Button
            onClick={nextPage}
            disabled={page >= maxPage ? true : null}
            _hover={false}
            _active={false}
          >
            <AiOutlineRightCircle fontSize={"20px"} />
          </Button>
          <Box>
            Page: {page} of {maxPage}
          </Box>
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
