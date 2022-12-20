import {
  Box,
  Button,
  FormControl,
  Grid,
  Image,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
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
import React, { useEffect } from "react"
import { useState } from "react"
import { TbSearch } from "react-icons/tb"
import { axiosInstance } from "../../api"
import Alert from "../../components/profile/Alert"
import RejectForm from "../order/RejectForm"
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiOutlineLeftCircle,
  AiOutlineRightCircle,
} from "react-icons/ai"
import { Link } from "react-router-dom"
import moment from "moment"
import { IoIosAlert } from "react-icons/io"
import { useSelector } from "react-redux"

const AdminOrder = () => {
  const [order, setOrder] = useState([])
  const [approve, setApprove] = useState(null)
  const [reject, setReject] = useState(null)
  const [modalImage, setModalImage] = useState(null)
  const [currentSearch, setCurrentSearch] = useState("")
  const [totalCount, setTotalCount] = useState(0)
  const [sortBy, setSortBy] = useState("id")
  const [sortDir, setSortDir] = useState("ASC")
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [orderStatus, setOrderStatus] = useState([])
  const [paymentStatus, setPaymentStatus] = useState([])
  const [warehouse, setWarehouse] = useState([])
  const [orderSort, setOrderSort] = useState(0)
  const [paymentSort, setPaymentSort] = useState(0)
  const [warehouseSort, setWarehouseSort] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const authSelector = useSelector((state) => state.auth)

  const toast = useToast()

  const cancelRef = React.useRef()

  const {
    onOpen: onOpenAlert,
    isOpen: isOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure()

  const fetchOrder = async () => {
    try {
      const maxItemsPerPage = 10
      const response = await axiosInstance.get(
        "/adminOrder/waitingConfirmation",
        {
          params: {
            _page: page,
            _limit: maxItemsPerPage,
            // username: currentSearch,
            transaction_name: currentSearch,
            PaymentStatusId: paymentSort,
            OrderStatusId: orderSort,
            WarehouseId: warehouseSort,
            payment_method: paymentMethod,
            _sortBy: sortBy,
            _sortDir: sortDir,
          },
        }
      )

      setTotalCount(response.data.dataCount)
      setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage))

      if (page === 1) {
        setOrder(response.data.data)
      } else {
        setOrder(response.data.data)
      }
      setIsLoading(true)
    } catch (error) {
      console.log(error.response)
    }
  }

  const fetchOrderStatus = async () => {
    try {
      const response = await axiosInstance.get("/adminOrder/findOrderStatus")
      setOrderStatus(response.data.data)
    } catch (error) {
      console.log(error.response)
    }
  }

  const fetchPaymentStatus = async () => {
    try {
      const response = await axiosInstance.get("/adminOrder/findPaymentStatus")
      setPaymentStatus(response.data.data)
    } catch (error) {
      console.log(error.response)
    }
  }
  
  const fetchWarehouse = async () => {
    try {
      const response = await axiosInstance.get("/adminOrder/findWarehouse")
      setWarehouse(response.data.data)
    } catch (error) {
      console.log(error.response)
    }
  }

  const approveBtnHandler = async () => {
    try {
      await axiosInstance.patch(`/adminOrder/approvePayment/${approve.id}`)

      fetchOrder()

      toast({
        title: "Payment Approved",
        status: "success",
      })
    } catch (error) {
      console.log(error.response)
      toast({
        title: "Payment Approved Failed",
        status: "error",
        description: error.response.data.message,
      })
    }
  }

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: async ({ message }) => {
      try {
        console.log(reject.id)
        await axiosInstance.patch(`/adminOrder/rejectPayment/${reject.id}`, {
          message,
        })

        fetchOrder()
        setReject(null)

        toast({
          title: "Payment Rejected",
          status: "info",
        })
      } catch (error) {
        console.log(error)
        toast({
          title: "Filed Reject Payment",
          description: error.response.data.message,
          status: "error",
        })
      }
    },
  })

  const formikSearch = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: ({ search }) => {
      setCurrentSearch(search)
      setPage(1)
    },
  })

  const searchHandler = ({ target }) => {
    const { name, value } = target
    formikSearch.setFieldValue(name, value)
  }

  const doubleOnClick = () => {
    approveBtnHandler(approve.id)
    setApprove(null)
  }

  const doubleOnClick1 = () => {
    formik.handleSubmit()
    onCloseAlert()
  }

  const nextPage = () => {
    setPage(page + 1)
  }

  const previousPage = () => {
    setPage(page - 1)
  }

  const orderStatusHandler = ({ target }) => {
    const { value } = target
    setOrderSort(value)
  }

  const paymentStatusHandler = ({ target }) => {
    const { value } = target
    setPaymentSort(value)
  }

  const paymentMethodHandler = ({ target }) => {
    const { value } = target
    setPaymentMethod(value)
  }

  const warehouseHandler = ({ target }) => {
    const { value } = target
    setWarehouseSort(value)
  }

  const sortHandler = ({ target }) => {
    const { value } = target
    setSortBy(value.split(" ")[0])
    setSortDir(value.split(" ")[1])
  }

  useEffect(() => {
    fetchOrder()
  }, [
    approve,
    reject,
    currentSearch,
    page,
    sortDir,
    sortBy,
    paymentSort,
    paymentMethod,
    orderSort,
    warehouseSort,
  ])

  useEffect(() => {
    fetchOrderStatus()
    fetchPaymentStatus()
    fetchWarehouse()
  }, [])
  return (
    <Box ml="220px" p="24px" bgColor={"var(--NN50,#F0F3F7);"} h="100vh">
      <Box mb="16px">
        <Text fontSize={"2xl"} fontWeight="bold" color={"#F7931E"}>
          Order List
        </Text>
      </Box>

      {authSelector.RoleId === 2 ? (
        <Grid gap="4" templateColumns={"repeat(5, 1fr)"} mt="4" mb="4">
          <Select
            onChange={sortHandler}
            fontSize={"15px"}
            fontWeight="normal"
            color={"#6D6D6F"}
            placeholder="Sort"
            bgColor={"white"}
          >
            <option value="createdAt DESC">Latest</option>
            <option value="createdAt ASC">Old</option>
          </Select>

          <Select
            fontSize={"15px"}
            fontWeight="normal"
            onChange={orderStatusHandler}
            color={"#6D6D6F"}
            placeholder="Order Status"
            bgColor={"white"}
          >
            {orderStatus.map((val) => {
              return <option value={val.id}>{val.order_status_name}</option>
            })}
          </Select>

          <Select
            fontSize={"15px"}
            fontWeight="normal"
            onChange={paymentStatusHandler}
            color={"#6D6D6F"}
            placeholder="Payment Status"
            bgColor={"white"}
          >
            {paymentStatus.map((val) => {
              return <option value={val.id}>{val.payment_status_name}</option>
            })}
          </Select>

          <Select
            onChange={paymentMethodHandler}
            fontSize={"15px"}
            fontWeight="normal"
            color={"#6D6D6F"}
            placeholder="Payment Method"
            bgColor={"white"}
          >
            <option value="BCA Virtual Account">BCA Virtual Account</option>
            <option value="BNI Virtual Account">BNI Virtual Account</option>
            <option value="Mandiri Virtual Account">
              Mandiri Virtual Account
            </option>
          </Select>

          {authSelector.RoleId === 3 ? (
            <Select
              onChange={warehouseHandler}
              fontSize={"15px"}
              fontWeight="normal"
              color={"#6D6D6F"}
              placeholder="Warehouse"
              bgColor={"white"}
            >
              {warehouse.map((val) => {
                return <option value={val.id}>{val.warehouse_name}</option>
              })}
            </Select>
          ) : null}

          <form onSubmit={formikSearch.handleSubmit}>
            <FormControl>
              <InputGroup textAlign={"right"}>
                <Input
                  type={"text"}
                  placeholder="Search here"
                  name="search"
                  bgColor={"white"}
                  onChange={searchHandler}
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
      ) : (
        <Grid gap="4" templateColumns={"repeat(6, 1fr)"} mt="4" mb="4">
          <Select
            onChange={sortHandler}
            fontSize={"15px"}
            fontWeight="normal"
            color={"#6D6D6F"}
            placeholder="Sort"
            bgColor={"white"}
          >
            <option value="createdAt DESC">Latest</option>
            <option value="createdAt ASC">Old</option>
          </Select>

          <Select
            fontSize={"15px"}
            fontWeight="normal"
            onChange={orderStatusHandler}
            color={"#6D6D6F"}
            placeholder="Order Status"
            bgColor={"white"}
          >
            {orderStatus.map((val) => {
              return <option value={val.id}>{val.order_status_name}</option>
            })}
          </Select>

          <Select
            fontSize={"15px"}
            fontWeight="normal"
            onChange={paymentStatusHandler}
            color={"#6D6D6F"}
            placeholder="Payment Status"
            bgColor={"white"}
          >
            {paymentStatus.map((val) => {
              return <option value={val.id}>{val.payment_status_name}</option>
            })}
          </Select>

          <Select
            onChange={paymentMethodHandler}
            fontSize={"15px"}
            fontWeight="normal"
            color={"#6D6D6F"}
            placeholder="Payment Method"
            bgColor={"white"}
          >
            <option value="BCA Virtual Account">BCA Virtual Account</option>
            <option value="BNI Virtual Account">BNI Virtual Account</option>
            <option value="Mandiri Virtual Account">
              Mandiri Virtual Account
            </option>
          </Select>

          {authSelector.RoleId === 3 ? (
            <Select
              onChange={warehouseHandler}
              fontSize={"15px"}
              fontWeight="normal"
              color={"#6D6D6F"}
              placeholder="Warehouse"
              bgColor={"white"}
            >
              {warehouse.map((val) => {
                return <option value={val.id}>{val.warehouse_name}</option>
              })}
            </Select>
          ) : null}

          <form onSubmit={formikSearch.handleSubmit}>
            <FormControl>
              <InputGroup textAlign={"right"}>
                <Input
                  type={"text"}
                  placeholder="Search here"
                  name="search"
                  bgColor={"white"}
                  onChange={searchHandler}
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
      )}

      <Table
        variant={"striped"}
        colorScheme={"blue"}
        bgColor="white"
        borderRadius="8px"
        boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
      >
        <Thead>
          <Tr>
            <Th p={"10px"}>Transaction Name</Th>
            <Th p={"10px"}>Order Status</Th>
            <Th p={"10px"}>Payment Status</Th>
            <Th p={"10px"}>Payment Method</Th>
            <Th p={"10px"}>Payment Date</Th>
            <Th p={"10px"}>Payment Proof</Th>
            <Th p={"10px"}>Total Price</Th>
            <Th p={"10px"}>User</Th>
            {authSelector.RoleId === 3 ? <Th p={"10px"}>Warehouse</Th> : null}
          </Tr>
        </Thead>
        <Tbody>
          {isLoading &&
            order.map((val) => {
              return (
                <Tr>
                  <Td p={"10px "}>{val.transaction_name}</Td>
                  <Td p={"10px "}>{val.Order_status?.order_status_name}</Td>
                  <Td p={"10px "}>{val.Payment_status?.payment_status_name}</Td>
                  <Td p={"10px "}>{val.payment_method}</Td>
                  <Td p={"10px "}>
                    {moment(val.payment_date).format(
                      "dddd, DD MMMM YYYY, HH:mm:ss"
                    )}
                  </Td>
                  <Td p={"10px "}>
                    {val.payment_proof ? (
                      <Image
                        w="100px"
                        src={`${process.env.REACT_APP_IMAGE_URL}/${val.payment_proof}`}
                        onClick={() => setModalImage(val)}
                      />
                    ) : (
                      <Text>Not Uploaded</Text>
                    )}
                  </Td>

                  <Td p={"10px "}>Rp. {val.total_price.toLocaleString()}</Td>
                  <Td p={"10px "}>{val.User.username}</Td>
                  {authSelector.RoleId === 3 ? (
                    <Td>{val.Warehouse.warehouse_name}</Td>
                  ) : null}
                  <Td p={"10px "}>
                    {val?.PaymentStatusId == 2 ? (
                      <Box display={"flex"} fontSize="40px" gap="4px">
                        <Link>
                          <AiFillCheckCircle
                            type="button"
                            onClick={() => setApprove(val)}
                            color="#0095DA"
                          />
                        </Link>
                        <Link>
                          <AiFillCloseCircle
                            onClick={() => setReject(val)}
                            color="#F7931E"
                          />
                        </Link>
                      </Box>
                    ) : null}
                  </Td>
                </Tr>
              )
            })}
        </Tbody>
      </Table>
      {isLoading === false ? (
        <Skeleton
          startColor="#bab8b8"
          endColor="#d4d2d2"
          height="100px"
          borderRadius="8px"
        />
      ) : null}
      {!order.length && isLoading === true ? (
        <Box p="10px" bgColor={"#E5F9F6"}>
          <Box mx="auto">
            <Box display={"flex"} mx="auto" w="170px">
              <IoIosAlert fontSize={"25px"} color="#0095DA" />
              <Text fontWeight="medium" ml="2">
                No orders found
              </Text>
            </Box>
          </Box>
        </Box>
      ) : null}

      <RejectForm
        formik={formik}
        header={"send message to user"}
        isOpen={reject}
        onClose={() => setReject(null)}
        onOpen={onOpenAlert}
      />

      <Alert
        header={"Payment reject"}
        body={"Is data that you entered is correct"}
        cancelRef={cancelRef}
        isOpen={isOpenAlert}
        leftButton={"Cancel"}
        onClose={onCloseAlert}
        rightButton={"Reject Payment"}
        onSubmit={doubleOnClick1}
        color={"#0095DA"}
      />

      <Alert
        header={"Payment approve"}
        body={"Is data that you entered is correct"}
        cancelRef={cancelRef}
        isOpen={approve}
        leftButton={"Cancel"}
        onClose={() => setApprove(null)}
        rightButton={"Approve Payment"}
        onSubmit={() => doubleOnClick()}
        color={"#0095DA"}
      />

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

      <Modal
        isOpen={modalImage}
        onClose={() => setModalImage(null)}
        motionPreset="slideInBottom"
        size={"2xl"}
      >
        <ModalOverlay />
        <ModalContent my="auto" borderRadius="8px" overflow={false}>
          <ModalBody p="24px 40px" fontSize={"14px"}>
            <Box textAlign={"center"}>
              <Image
                src={`${process.env.REACT_APP_IMAGE_URL}/${modalImage?.payment_proof}`}
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default AdminOrder
