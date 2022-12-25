import {
    Box,
    Text,
    Th,
    Thead,
    Tr,
    Table,
    TableContainer,
    Tbody,
    Td,
    Select,
    HStack,
    Grid,
    GridItem,
    Input,
    InputGroup,
    Button,
} from "@chakra-ui/react"
import { useEffect } from "react"
import { useState } from "react"
import { CgChevronLeft, CgChevronRight } from "react-icons/cg"
import { axiosInstance } from "../../api"
import { useSelector } from "react-redux"
import { TbSearch } from "react-icons/tb"

const AdminSalesReport = () => {
    const [salesData, setSalesData] = useState([])
    const [warehouseData, setWarehouseData] = useState([])
    const [categoryData, setCategoryData] = useState([])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [filterWarehouse, setFilterWarehouse] = useState("")
    const [filterCategory, setFilterCategory] = useState("")
    const [filterMonth, setFilterMonth] = useState("")
    const [productSearch, setProductSearch] = useState("")
    const [categorySearch, setCategorySearch] = useState("")
    const [sort, setSort] = useState("")
    const authSelector = useSelector((state) => state.auth)

    const maxItemsPerPage = 10
    const fetchData = async () => {
        try {
            let url = `/admin/sales-report/get2`

            if (authSelector.WarehouseId) {
                url += `?WarehouseId=${authSelector.WarehouseId}`
            }
            console.log("url", url)
            const response = await axiosInstance.get(url, {
                params: {
                    _page: page,
                    _limit: maxItemsPerPage,
                    WarehouseId: filterWarehouse,
                    CategoryId: filterCategory,
                    createdAt: filterMonth,
                    product_name: productSearch,
                    category_name: categorySearch,
                    _sortBy: sort,
                },
            })
            setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage))
            if (page === 1) {
                setSalesData(response.data.data)
            } else {
                setSalesData(response.data.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    // const fetchData2 = async () => {
    //     try {
    //         let url = `/admin/sales-report/get`

    //         if (authSelector.WarehouseId) {
    //             url += `?WarehouseId=${authSelector.WarehouseId}`
    //         }

    //         const response = await axiosInstance.get(url, {
    //             params: {
    //                 _page: page,
    //                 _limit: maxItemsPerPage,
    //                 WarehouseId: filterWarehouse,
    //                 CategoryId: filterCategory,
    //                 createdAt: filterMonth,
    //             },
    //         })
    //         setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage))
    //         if (page === 1) {
    //             setSalesData(response.data.data)
    //         } else {
    //             setSalesData(response.data.data)
    //         }
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }
    const fetchWarehouse = async () => {
        try {
            const response = await axiosInstance.get("/warehouse")
            setWarehouseData(response.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchCategory = async () => {
        try {
            const response = await axiosInstance.get("/categories")
            setCategoryData(response.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    const filterWarehouseBtnHandler = ({ target }) => {
        const { value } = target
        setFilterWarehouse(value)
        // setSortBy(value)
    }

    const filterCategoryBtnHandler = ({ target }) => {
        const { value } = target
        setFilterCategory(value)
    }

    const filterMonthBtnHandler = ({ target }) => {
        const { value } = target
        setFilterMonth(value)
    }

    const categorySearchBtnHandler = (e) => {
        setCategorySearch(e.target.value)
    }

    const productSearchBtnHandler = (e) => {
        setProductSearch(e.target.value)
    }

    const handleKeyEnter = (e) => {
        if (e.key === "Enter") {
            setProductSearch(productSearch)
        }
    }
    // const searching = () => {
    //     if (categorySearch) {
    //         categorySearchBtnHandler()
    //     } else if (productSearch) {
    //         productSearchBtnHandler()
    //     }
    // }

    const sortHandler = ({ target }) => {
        const { value } = target
        setSort(value)
    }

    const nextPageBtnHandler = () => {
        setPage(page + 1)
    }

    const prevPageBtnHandler = () => {
        setPage(page - 1)
    }
    // console.log("trans", transactionData.map((val) => val.WarehouseId)[0])
    console.log("cat", categoryData)
    console.log(
        "sal",
        salesData.map((val) => val.category_name)
    )
    console.log("salllll", salesData)

    console.log("sss", sort)
    useEffect(() => {
        fetchData()
        // fetchData2()
    }, [
        filterWarehouse,
        filterCategory,
        filterMonth,
        page,
        sort,
        productSearch,
        categorySearch,
        authSelector,
    ])

    useEffect(() => {
        fetchWarehouse()
        fetchCategory()
    }, [])
    return (
        <>
            <Box ml="250px" mr="1.5em">
                <Box mt="2em">
                    <Text
                        fontSize="3xl"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                    >
                        Sales Report
                    </Text>
                    <Box mt="3vh">
                        <Grid
                            p="5px"
                            gap="5"
                            w="full"
                            gridTemplateColumns="repeat(5,1fr)"
                        >
                            {/* Sort */}
                            <GridItem
                                w="full"
                                justifySelf="center"
                                border="1px solid #dfe1e3"
                                borderRadius="8px"
                                onChange={sortHandler}
                            >
                                <Select>
                                    {/* <option value="">---Sort---</option> */}
                                    <option value={"ASC"}>ASC</option>
                                    <option value={"DESC"}>DESC</option>
                                </Select>
                            </GridItem>

                            {/* Month */}
                            <GridItem
                                w="full"
                                justifySelf="center"
                                border="1px solid #dfe1e3"
                                borderRadius="8px"
                                onChange={filterMonthBtnHandler}
                            >
                                <Select>
                                    <option value="">---By Month---</option>
                                    <option value={1}>January</option>
                                    <option value={2}>February</option>
                                    <option value={3}>March</option>
                                    <option value={4}>April</option>
                                    <option value={5}>May</option>
                                    <option value={6}>June</option>
                                    <option value={7}>July</option>
                                    <option value={8}>August</option>
                                    <option value={9}>September</option>
                                    <option value={10}>October</option>
                                    <option value={11}>November</option>
                                    <option value={12}>December</option>
                                </Select>
                            </GridItem>

                            {/* Category */}
                            <GridItem
                                w="full"
                                justifySelf="center"
                                border="1px solid #dfe1e3"
                                borderRadius="8px"
                                onChange={filterCategoryBtnHandler}
                            >
                                <Select>
                                    <option value="">---By Category---</option>
                                    {categoryData.map((val) => (
                                        <option value={val.id}>
                                            {val.category_name}
                                        </option>
                                    ))}
                                </Select>
                            </GridItem>

                            {/* Warehouse */}
                            <GridItem
                                w="full"
                                justifySelf="center"
                                onChange={filterWarehouseBtnHandler}
                                border="1px solid #dfe1e3"
                                borderRadius="8px"
                            >
                                {/* RAW QUERY */}
                                <Select>
                                    <option value="">---By Warehouse---</option>
                                    {authSelector.WarehouseId ===
                                    salesData.map((val) => val.WarehouseId)[0]
                                        ? salesData.map((val) => (
                                              <option value={val.WarehouseId}>
                                                  {val.warehouse_name}
                                              </option>
                                          ))[0]
                                        : warehouseData.map((val) => (
                                              <option value={val.id}>
                                                  {val.warehouse_name}
                                              </option>
                                          ))}
                                </Select>

                                {/* <Select>
                                    <option value="">---By Warehouse---</option>
                                    {authSelector.WarehouseId === salesData.map((val) => val.WarehouseId)[0]
                                    ? salesData.map((val) => (
                                        <option value={val.WarehouseId}
                                    ))
                                    }
                                </Select> */}
                            </GridItem>

                            {/* Search */}
                            <GridItem
                                w="full"
                                justifySelf="center"
                                border="1px solid #dfe1e3"
                                borderRadius="8px"
                                onSubmit={(e) => productSearchBtnHandler(e)}
                            >
                                <InputGroup>
                                    <Input
                                        onKeyDown={handleKeyEnter}
                                        value={productSearch}
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
                            </GridItem>
                        </Grid>
                    </Box>

                    <TableContainer
                        border="1px solid #dfe1e3"
                        mt="3vh"
                        borderRadius="8px"
                    >
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th w="130px">
                                        <Text fontSize="10px">Date</Text>
                                    </Th>
                                    <Th w="100px">
                                        <Text fontSize="10px">Category</Text>
                                    </Th>
                                    <Th w="200px">
                                        <Text fontSize="10px">
                                            Product Name
                                        </Text>
                                    </Th>
                                    {/* <Th w="200px">
                                        <Text fontSize="10px">Description</Text>
                                    </Th> */}
                                    <Th w="100px">
                                        <Text fontSize="10px">Price</Text>
                                    </Th>
                                    <Th w="50px">
                                        <Text fontSize="10px">qty</Text>
                                    </Th>
                                    <Th w="100px">
                                        <Text fontSize="10px">Total</Text>
                                    </Th>
                                    <Th w="100px">
                                        <Text fontSize="10px">Warehouse</Text>
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {salesData.map((val) => (
                                    <Tr>
                                        <Td maxW="130px">
                                            {/* RAW QUERY */}
                                            <Text>
                                                {val.createdAt.split("T")[0]} /{" "}
                                                {val.createdAt
                                                    .split("T")[1]
                                                    .split(".000Z")}
                                            </Text>

                                            {/* <Text maxW="150px">
                                                {val.createdAt.split("T")[0]} /{" "}
                                                {val.createdAt
                                                    .split("T")[1]
                                                    .split(".000Z")}
                                            </Text> */}
                                        </Td>

                                        <Td maxW="100px">
                                            <Text>
                                                {/* {val.User.username} */}

                                                {/* raw query */}
                                                {val.category_name}
                                            </Text>
                                        </Td>
                                        <Td maxW="200px">
                                            <Text
                                                overflow="hidden"
                                                textOverflow="ellipsis"
                                            >
                                                {val.product_name}
                                            </Text>
                                        </Td>
                                        {/* <Td maxW="200px">
                                            <Text
                                                overflow="hidden"
                                                textOverflow="ellipsis"
                                            >
                                                {val.description}
                                            </Text>
                                        </Td> */}
                                        <Td maxW="100px">
                                            <Text>
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                        minimumFractionDigits: 0,
                                                    }
                                                ).format(val.price)}
                                            </Text>
                                        </Td>
                                        <Td maxW="50px">
                                            <Text>
                                                {/* {
                                                    val.Order_status
                                                        .order_status_name
                                                } */}

                                                {/* raw query */}
                                                {val.quantity}
                                            </Text>
                                        </Td>

                                        <Td maxW="100px">
                                            <Text>
                                                {/* {val.Warehouse.warehouse_name} */}

                                                {/* raw query */}
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                        minimumFractionDigits: 0,
                                                    }
                                                ).format(val.total)}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Text>{val.warehouse_name}</Text>
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
        </>
    )
}

export default AdminSalesReport
