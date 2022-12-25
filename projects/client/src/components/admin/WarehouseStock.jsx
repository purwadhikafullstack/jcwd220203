import {
  Box,
  Button,
  FormControl,
  Grid,
  Image,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import React, { useState } from "react"
import { useEffect } from "react"
import { IoIosAlert } from "react-icons/io"
import { TbSearch } from "react-icons/tb"
import { useParams } from "react-router-dom"
import { axiosInstance } from "../../api"
import EditStock from "./EditStock"
import * as Yup from "yup"
import Alert from "../profile/Alert"
import { useSelector } from "react-redux"
import { AiOutlineLeftCircle, AiOutlineRightCircle } from "react-icons/ai"

const WarehouseStock = ({}) => {
  const authSelector = useSelector((state) => state.auth)
  const [data, setData] = useState([])
  const params = useParams()
  console.log(params)
  const [sortBy, setSortBy] = useState("product_name")
  const [sortDir, setSortDir] = useState("ASC")
  const [maxPage, setMaxPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [currentSearch, setCurrentSearch] = useState("")
  const [page, setPage] = useState(1)
  const [openedEdit, setOpenedEdit] = useState(null)
  const cancelRef = React.useRef()
  const [deleteAlert, setDeleteAlert] = useState(null)
  const [filter, setFilter] = useState(0)
  const [category, setCategory] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    onOpen: onOpenAlert,
    isOpen: isOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure()

  const doubleOnClick1 = () => {
    editFormik.handleSubmit()
    onCloseAlert()
  }

  const fetchWarehouseData = async () => {
    const maxItemsPerPage = 8
    try {
      if (authSelector.RoleId === 2) {
        const response = await axiosInstance.get(
          `/stock/getAllProduct/${authSelector.WarehouseId}`,
          {
            params: {
              _page: page,
              _limit: maxItemsPerPage,
              product_name: currentSearch,
              CategoryId: filter,
              _sortBy: sortBy,
              _sortDir: sortDir,
            },
          }
        )

        setTotalCount(response.data.dataCount)
        setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage))

        if (page === 1) {
          setData(response.data.data)
        } else {
          setData(response.data.data)
        }
      }

      const warehouse = await axiosInstance.get("/stock/getAllWarehouse")
      const warehouseId = warehouse.data.data.filter((val) => {
        return val.warehouse_name == params.id
      })

      const response = await axiosInstance.get(
        `/stock/getAllProduct/${warehouseId[0].id}`,
        {
          params: {
            _page: page,
            _limit: maxItemsPerPage,
            product_name: currentSearch,
            CategoryId: filter,
            _sortBy: sortBy,
            _sortDir: sortDir,
          },
        }
      )

      setTotalCount(response.data.dataCount)
      setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage))

      if (page === 1) {
        setData(response.data.data)
      } else {
        setData(response.data.data)
      }
      setIsLoading(true)
    } catch (error) {
      console.log(error)
    }
  }

  const renderProduct = () => {
    return data.map((val) => {
      return (
        <Tr h="auto" key={val.id.toString()}>
          <Td w="100px">
            <Image src={val.Product.Image_Urls[0].image_url} />
          </Td>
          <Td w="400px">{val.Product.product_name}</Td>
          <Td w="150px">{val.Product.Category.category_name}</Td>
          <Td>Rp. {val.Product.price.toLocaleString()}</Td>
          <Td>{val.stock}</Td>
          <Td w="100px">
            <Button
              color={"white"}
              mb="2"
              w="120px"
              bgColor="#F7931E"
              _hover={false}
              onClick={() => setOpenedEdit(val)}
            >
              Update Stock
            </Button>
            <Button
              color={"white"}
              bgColor="#0095DA"
              _hover={false}
              onClick={() => setDeleteAlert(val)}
            >
              <Text overflow={"hidden"} textOverflow="ellipsis">
                Delete Stock
              </Text>
            </Button>
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

  const sortCategoryHandler = ({ target }) => {
    const { value } = target

    setSortBy(value.split(" ")[0])
    setSortDir(value.split(" ")[1])
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

  const toast = useToast()

  const editFormik = useFormik({
    initialValues: {
      stock: "",
    },
    onSubmit: async ({ stock }) => {
      try {
        const response = await axiosInstance.patch(
          `/stock/updateStock/${openedEdit.id}`,
          {
            stock,
          }
        )
        toast({
          title: "Stock Updated",
          description: response.data.message,
          status: "success",
        })

        editFormik.setFieldValue("stock", "")

        fetchWarehouseData()
        setOpenedEdit(null)
      } catch (error) {
        console.log(error)
        toast({
          title: "Failed Update Stock",
          description: error.response.data.message,
          status: "error",
        })
      }
    },
    validationSchema: Yup.object({
      username: Yup.number(),
    }),
    validateOnChange: false,
  })

  const deleteAdminHandler = async (id) => {
    try {
      await axiosInstance.patch(`/stock/deleteStock/${deleteAlert.id}`)

      fetchWarehouseData()

      toast({
        title: "Stock Deleted",
        status: "info",
      })
    } catch (error) {
      console.log(error.response)
      toast({
        title: "Failed Delete Stock",
        description: error.response.data.message,
        status: "error",
      })
    }
  }

  const doubleOnClick2 = () => {
    setDeleteAlert(null)
    deleteAdminHandler(deleteAlert.id)
  }

  const filterBookHandler = ({ target }) => {
    const { value } = target

    setFilter(value)
  }

  const fetchAllCategory = async () => {
    try {
      const response = await axiosInstance("/stock/getAllCategory")

      setCategory(response.data.data)
    } catch (error) {
      console.log(error.response)
    }
  }

  const renderCategory = () => {
    return category.map((val) => {
      return (
        <option value={val.id} key={val.id}>
          {val.category_name}
        </option>
      )
    })
  }

  useEffect(() => {
    fetchAllCategory()
  }, [])
  useEffect(() => {
    fetchWarehouseData()
  }, [sortDir, sortBy, currentSearch, page, openedEdit, filter])
  useEffect(() => {
    if (openedEdit) {
      editFormik.setFieldValue("stock", openedEdit.stock)
    }
  }, [openedEdit])
  return (
    <Box ml="220px" p="24px" bgColor={"var(--NN50,#F0F3F7);"} h="100vh">
      <Box mb="16px">
        <Text fontSize={"2xl"} fontWeight="bold" color={"#F7931E"}>
          Update Stock Warehouse {params.id}
        </Text>
      </Box>
      <Grid gap="4" templateColumns={"repeat(3, 1fr)"} mt="4" mb="4">
        <Select
          onChange={filterBookHandler}
          fontSize={"15px"}
          bgColor="white"
          color={"#6D6D6F"}
          placeholder="Filter"
        >
          <option selected>All</option>
          {renderCategory()}
        </Select>

        <Select
          onChange={sortCategoryHandler}
          fontSize={"15px"}
          fontWeight="normal"
          fontFamily="serif"
          bgColor="white"
          color={"#6D6D6F"}
          placeholder="Sort By"
        >
          <option value="product_name ASC" selected>
            Name A-Z
          </option>
          <option value="product_name DESC">Name Z-A</option>
          <option value="stock DESC">most stock</option>
          <option value="stock ASC">least stock</option>
        </Select>

        <form onSubmit={formikSearch.handleSubmit}>
          <FormControl>
            <InputGroup textAlign={"right"}>
              <Input
                type={"text"}
                placeholder="Search by product name"
                name="search"
                bgColor={"white"}
                onChange={searchAdminHandler}
                borderRightRadius="0"
                value={formikSearch.values.search}
              />

              <Button
                borderLeftRadius={"0"}
                bgColor={"white"}
                type="submit"
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
            <Th>Image</Th>
            <Th>Product Name</Th>
            <Th>Category</Th>
            <Th>Price</Th>
            <Th>Stock</Th>
            <Th>Option</Th>
          </Tr>
        </Thead>
        <Tbody>{isLoading && renderProduct()}</Tbody>
      </Table>
      {isLoading === false ? (
        <Skeleton
          startColor="#bab8b8"
          endColor="#d4d2d2"
          height="125px"
          borderRadius="8px"
        />
      ) : null}
      {!data.length && isLoading === true ? (
        <Box p="10px" bgColor={"#E5F9F6"}>
          <Box mx="auto">
            <Box display={"flex"} mx="auto" w="170px">
              <IoIosAlert fontSize={"25px"} color="#0095DA" />
              <Text fontWeight="medium" ml="2">
                No product found
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
      {/* Edit modal */}
      <EditStock
        editFormik={editFormik}
        isOpen={openedEdit}
        header={"Update Stock"}
        onClose={() => setOpenedEdit(null)}
        color={"#0095DA"}
        onOpen={onOpenAlert}
        onCloseMod={() => setOpenedEdit(null)}
      />
      {/* Alert edit modal */}
      <Alert
        body={"Is stock that you entered correct?"}
        cancelRef={cancelRef}
        color={"#0095DA"}
        header={"Update Stock"}
        isOpen={isOpenAlert}
        leftButton={"Cancel"}
        onClose={onCloseAlert}
        onSubmit={doubleOnClick1}
        rightButton={"Update Stock"}
      />
      <Alert
        body={`Are you sure to delete?`}
        cancelRef={cancelRef}
        color={"#0095DA"}
        header={"Delete Stock"}
        isOpen={deleteAlert}
        leftButton={"Cancel"}
        onClose={() => setDeleteAlert(null)}
        onSubmit={() => doubleOnClick2()}
        rightButton={"Delete"}
      />
    </Box>
  )
}

export default WarehouseStock
