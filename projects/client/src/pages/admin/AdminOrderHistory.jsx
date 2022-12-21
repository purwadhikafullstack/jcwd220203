import {
    Box,
    Button,
    Flex,
    Text,
    Th,
    Thead,
    Tr,
    Table,
    TableContainer,
    Tbody,
    Td,
    Image,
    Spacer,
    Select,
    HStack,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    Stack,
} from "@chakra-ui/react"
import { useEffect } from "react"
import { useState } from "react"
import { CgChevronLeft, CgChevronRight } from "react-icons/cg"
import { axiosInstance } from "../../api"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { useSelector } from "react-redux"

const AdminOrderHistory = () => {
    const [transactionData, setTransactionData] = useState([])
    const [warehouseData, setWarehouseData] = useState([])
    const [imageData, setImageData] = useState([])
    const [productData, setProductData] = useState({
        product_name: "",
        description: "",
        price: "",
        id: "",
    })
    const [productId, setProductId] = useState(0)
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [filter, setFilter] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const authSelector = useSelector((state) => state.auth)

    const maxItemsPerPage = 7
    // const fetchData = async () => {
    //     try {
    //         let url = `/admin/order-history/get`

    //         console.log("CCCCCC", authSelector)
    //         if (authSelector.WarehouseId) {
    //             await axiosInstance.get(
    //                 (url += `?WarehouseId=${authSelector.WarehouseId}`)
    //             )
    //         }
    //         console.log("URLLL", url)
    //         const response = await axiosInstance.get(url, {
    //             params: {
    //                 _page: page,
    //                 _limit: maxItemsPerPage,
    //                 WarehouseId: filter,
    //             },
    //         })
    //         console.log(`AAAAAAAAAAAAA`, authSelector.WarehouseId)
    //         setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage))
    //         console.log("response", response.data)
    //         if (page === 1) {
    //             setTransactionData(response.data.data)
    //         } else {
    //             setTransactionData(response.data.data)
    //         }
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    const fetchData2 = async () => {
        try {
            let url = `/admin/order-history/get2`

            if (authSelector.WarehouseId) {
                url += `?WarehouseId=${authSelector.WarehouseId}`
            }

            const response = await axiosInstance.get(url, {
                params: {
                    _page: page,
                    _limit: maxItemsPerPage,
                    WarehouseId: filter,
                },
            })
            setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage))
            if (page === 1) {
                setTransactionData(response.data.data)
            } else {
                setTransactionData(response.data.data)
            }
        } catch (err) {
            console.log(err)
        }
    }
    const fetchWarehouse = async () => {
        try {
            const response = await axiosInstance.get("/warehouse")
            setWarehouseData(response.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchProduct = async () => {
        try {
            const response = await axiosInstance.get(`/product/${productId}`)
            setProductData(response.data.data)
            setImageData(response.data.data.Image_Urls)
        } catch (err) {
            console.log(err)
        }
    }

    const filterBtnHandler = ({ target }) => {
        const { value } = target
        setFilter(value)
        // setSortBy(value)
    }

    const nextPageBtnHandler = () => {
        setPage(page + 1)
    }

    const prevPageBtnHandler = () => {
        setPage(page - 1)
    }
    console.log("trans", transactionData.map((val) => val.WarehouseId)[0])
    useEffect(() => {
        // fetchData()
        fetchData2()
        fetchWarehouse()
        fetchProduct()
    }, [page, filter, productId, authSelector])
    return (
        <>
            <Box ml="250px" mr="1.5em">
                <Box mt="2em">
                    <Text
                        fontSize="3xl"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                    >
                        Transaction History
                    </Text>
                    <Flex mt="3vh">
                        {/* <Box
                            display="flex"
                            border="1px solid #dfe1e3"
                            borderRadius="8px"
                            p="5px"
                            gap="2"
                            w="40vh"
                        >
                            <Button
                                bgColor="#F7931E"
                                color="white"
                                _hover="white"
                            >
                                <Text fontSize="sm">All transaction</Text>
                            </Button>
                            <Button
                                variant="ghost"
                                _hover={{ bgColor: "#F7931E", color: "white" }}
                            >
                                <Text fontSize="sm">Completed</Text>
                            </Button>
                            <Button
                                variant="ghost"
                                _hover={{ bgColor: "#F7931E", color: "white" }}
                            >
                                <Text fontSize="sm">Pending</Text>
                            </Button>
                            <Button
                                variant="ghost"
                                _hover={{ bgColor: "#F7931E", color: "white" }}
                            >
                                <Text fontSize="sm">Canceled</Text>
                            </Button>
                        </Box> */}
                        <Spacer />
                        <Box display="flex" alignSelf="center">
                            <HStack gap="2">
                                <Text alignSelf="center">Filter: </Text>
                                <Select onChange={filterBtnHandler}>
                                    <option value="">---Select---</option>
                                    {/* raw query */}
                                    {/* {warehouseData.map((val) => (
                                        <option value={val.id}>
                                            {val.warehouse_name}
                                        </option>
                                    ))} */}

                                    {authSelector.WarehouseId ===
                                    transactionData.map(
                                        (val) => val.WarehouseId
                                    )[0]
                                        ? transactionData.map((val) => (
                                              <option value={val.WarehouseId}>
                                                  {val.Warehouse.warehouse_name}
                                              </option>
                                          ))[0]
                                        : warehouseData.map((val) => (
                                              <option value={val.id}>
                                                  {val.warehouse_name}
                                              </option>
                                          ))}
                                </Select>
                            </HStack>
                        </Box>
                    </Flex>

                    <TableContainer
                        border="1px solid #dfe1e3"
                        mt="3vh"
                        borderRadius="8px"
                    >
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th w="100px">
                                        <Text fontSize="10px">invoice</Text>
                                    </Th>
                                    <Th w="100px">
                                        <Text fontSize="10px">User</Text>
                                    </Th>
                                    <Th w="100px">
                                        <Text fontSize="10px">Order Date</Text>
                                    </Th>
                                    <Th w="100px">
                                        <Text fontSize="10px">
                                            Total quantity
                                        </Text>
                                    </Th>
                                    <Th w="100px">
                                        <Text fontSize="10px">Total Price</Text>
                                    </Th>
                                    <Th w="150px">
                                        <Text fontSize="10px">
                                            Order status
                                        </Text>
                                    </Th>
                                    <Th w="200px">
                                        <Text fontSize="10px">
                                            Warehouse Branch
                                        </Text>
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {transactionData.map((val) => (
                                    <Tr>
                                        <Td>
                                            <Button
                                                variant="link"
                                                onClick={() => {
                                                    setProductId(
                                                        val.TransactionItems.map(
                                                            (val) =>
                                                                val.ProductId
                                                        )
                                                    )

                                                    // val.productId  //raw query
                                                    // )
                                                    onOpen()
                                                }}
                                            >
                                                <Text color="#0095DA">
                                                    #
                                                    {
                                                        val.transaction_name

                                                        // val.transaction_name //raw query
                                                    }
                                                </Text>
                                            </Button>
                                        </Td>
                                        <Td maxW="100px">
                                            <Text
                                                overflow="hidden"
                                                textOverflow="ellipsis"
                                            >
                                                {val.User.username}

                                                {/* raw query */}
                                                {/* {val.username}  */}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Text>
                                                {val.createdAt.split("T")[0]}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Text>{val.total_quantity}</Text>
                                        </Td>
                                        <Td>
                                            <Text>
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                        minimumFractionDigits: 0,
                                                    }
                                                ).format(val.total_price)}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Text>
                                                {
                                                    val.Order_status
                                                        .order_status_name
                                                }

                                                {/* raw query */}
                                                {/* {val.order_status} */}
                                            </Text>
                                        </Td>

                                        <Td>
                                            <Text>
                                                {val.Warehouse.warehouse_name}

                                                {/* raw query */}
                                                {/* {val.warehouse_name} */}
                                            </Text>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>

                    {/* Page */}
                    <HStack justifyContent="center" gap="2" mt="1em">
                        {page === 1 ? null : (
                            <CgChevronLeft
                                bgColor="#0095DA"
                                onClick={prevPageBtnHandler}
                                color="#0095DA"
                                cursor="pointer"
                                size={20}
                            />
                        )}
                        <Text color="#0095DA">{page}</Text>
                        {page >= maxPage ? null : (
                            <CgChevronRight
                                bgColor="#0095DA"
                                color="#0095DA"
                                onClick={nextPageBtnHandler}
                                cursor="pointer"
                                size={20}
                            />
                        )}
                    </HStack>
                </Box>
            </Box>

            {/* Modal */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            mx="auto"
                            mt="20px"
                            w="auto"
                            h="350px"
                            display="block"
                        >
                            <Box display="flex" gap="20px">
                                <Box
                                    borderRadius="12px"
                                    display="block"
                                    w="348px"
                                    h="420px"
                                >
                                    <Carousel
                                        showStatus={false}
                                        showArrows={true}
                                        showIndicators={false}
                                        verticalSwipe="natural"
                                        swipeable={true}
                                    >
                                        {imageData.map((val) => (
                                            <Stack>
                                                <Box
                                                    w="348px"
                                                    h="348px"
                                                    borderRadius="12px"
                                                    display="block"
                                                >
                                                    <Image
                                                        src={val.image_url}
                                                        w="348px"
                                                        h="348px"
                                                        objectFit="cover"
                                                        borderRadius="12px"
                                                    />
                                                </Box>
                                            </Stack>
                                        ))}
                                    </Carousel>
                                </Box>
                                <Box
                                    borderRadius="12px"
                                    w="468px"
                                    h="700px"
                                    display="block"
                                >
                                    <Box display="grid" gap="20px">
                                        <Stack w="468px" h="48px">
                                            <Text
                                                fontSize="16"
                                                fontFamily="sans-serif"
                                                fontWeight="bold"
                                            >
                                                {productData?.product_name}
                                            </Text>
                                        </Stack>
                                        <Stack
                                            w="468px"
                                            h="80px"
                                            borderBottom="1px solid #dfe1e3"
                                        >
                                            <Text
                                                fontSize="28"
                                                fontFamily="sans-serif"
                                                fontWeight="bold"
                                            >
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                        minimumFractionDigits: 0,
                                                    }
                                                ).format(productData?.price)}
                                            </Text>
                                        </Stack>
                                        <Stack w="468px" h="110px">
                                            <Text
                                                fontSize="14"
                                                fontFamily="sans-serif"
                                                overflow="hidden"
                                                textOverflow="ellipsis"
                                                noOfLines={[1, 5]}
                                            >
                                                {productData?.description}
                                            </Text>
                                        </Stack>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AdminOrderHistory
