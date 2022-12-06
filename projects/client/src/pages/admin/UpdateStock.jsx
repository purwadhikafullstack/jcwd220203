import {
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
import { useEffect } from "react"
import { useState } from "react"
import { TbSearch } from "react-icons/tb"
import { axiosInstance } from "../../api"
import { useFormik } from "formik"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import WarehouseStock from "../../components/admin/WarehouseStock"
import { IoIosAlert } from "react-icons/io"

const UpdateStock = () => {
  const [warehouse, setWarehouse] = useState([])
  const [maxPage, setMaxPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [currentSearch, setCurrentSearch] = useState("")
  const [sortBy, setSortBy] = useState("warehouse_name")
  const [sortDir, setSortDir] = useState("ASC")
  const [page, setPage] = useState(1)

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
          <Td>{val.province}</Td>
          <Td>{val.city}</Td>
          <Td>{val.districts}</Td>
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
    <Box marginLeft={"230px"}>
      <Box p="20px 0" display={"flex"} justifyContent="space-between" mr="4">
        <Box display={"flex"} gap="4" my={"auto"}>
          <Text fontSize={"2xl"} fontWeight="bold" color={"#F7931E"}>
            Update Stock
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
            <Th>Warehouse Name</Th>
            <Th>Address Labels</Th>
            <Th>Province</Th>
            <Th>City</Th>
            <Th>Districs</Th>
            <Th>Warehouse Admin</Th>
          </Tr>
        </Thead>
        <Tbody>{renderWarehouse()}</Tbody>
      </Table>
      {!warehouse.length ? (
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
    </Box>
  )
}

export default UpdateStock
