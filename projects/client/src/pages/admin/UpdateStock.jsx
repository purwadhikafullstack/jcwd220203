import {
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
import { useEffect } from "react"
import { useState } from "react"
import { TbSearch } from "react-icons/tb"
import { axiosInstance } from "../../api"
import { useFormik } from "formik"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import WarehouseStock from "../../components/admin/WarehouseStock"
import { IoIosAlert } from "react-icons/io"
import { AiOutlineLeftCircle, AiOutlineRightCircle } from "react-icons/ai"

const UpdateStock = () => {
  const [warehouse, setWarehouse] = useState([])
  const [maxPage, setMaxPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [currentSearch, setCurrentSearch] = useState("")
  const [sortBy, setSortBy] = useState("warehouse_name")
  const [sortDir, setSortDir] = useState("ASC")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const handleRowClick = (warehouse_name) => {
    navigate(`/admin/update-stock/${warehouse_name}`)
  }

  const nextPage = () => {
    setPage(page + 1)
  }

  const previousPage = () => {
    setPage(page - 1)
  }

  const fetchAllWarehouse = async () => {
    const maxItemsPerPage = 8
    try {
      const response = await axiosInstance.get("/stock/getAllWarehouse", {
        params: {
          _page: page,
          _limit: maxItemsPerPage,
          warehouse_name: currentSearch,
          _sortBy: sortBy,
          _sortDir: sortDir,
        },
      })

      setTotalCount(response.data.dataCount)
      setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage))

      if (page === 1) {
        setWarehouse(response.data.data)
      } else {
        setWarehouse(response.data.data)
      }
      setIsLoading(true)
    } catch (error) {
      console.log(error.response)
    }
  }

  const renderWarehouse = () => {
    return warehouse.map((val) => {
      return (
        <Tr
          h="auto"
          key={val.id.toString()}
          onClick={() => handleRowClick(val.warehouse_name)}
        >
          <Td>{val.warehouse_name || "null"}</Td>
          <Td>{val.address_labels}</Td>
          <Td>
            {val.province}, {val.city}, {val.districts}
          </Td>
          <Td>{val.User?.username || "Not assign"}</Td>
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
    fetchAllWarehouse()
  }, [currentSearch, page, sortDir, sortBy])
  return (
    <Box ml="220px" p="24px" bgColor={"var(--NN50,#F0F3F7);"} h="100vh">
      <Box mb="16px">
        <Text fontSize={"2xl"} fontWeight="bold" color={"#F7931E"}>
          Update Stock
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
          <option value="warehouse_name ASC" selected>
            Name A-Z
          </option>
          <option value="warehouse_name DESC">Name Z-A</option>
          <option value="createdAt DESC">Latest</option>
          <option value="createdAt ASC">Old</option>
        </Select>

        <form onSubmit={formikSearch.handleSubmit}>
          <FormControl>
            <InputGroup textAlign={"right"}>
              <Input
                type={"text"}
                placeholder="Search by warehouse name"
                name="search"
                onChange={searchAdminHandler}
                borderRightRadius="0"
                value={formikSearch.values.search}
                bgColor="white"
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
            <Th>Warehouse Name</Th>
            <Th>Address Labels</Th>
            <Th>Address</Th>
            <Th>Warehouse Admin</Th>
          </Tr>
        </Thead>
        <Tbody>{isLoading && renderWarehouse()}</Tbody>
      </Table>
      {isLoading === false ? (
        <Skeleton
          startColor="#bab8b8"
          endColor="#d4d2d2"
          height="60px"
          borderRadius="8px"
        />
      ) : null}
      {!warehouse.length && isLoading === true ? (
        <Box p="10px" bgColor={"#E5F9F6"}>
          <Box mx="auto">
            <Box display={"flex"} mx="auto" w="170px">
              <IoIosAlert fontSize={"25px"} color="#0095DA" />
              <Text fontWeight="medium" ml="2">
                No warehouse found
              </Text>
            </Box>
          </Box>
        </Box>
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
    </Box>
  )
}

export default UpdateStock
