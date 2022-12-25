import { Box, Button, FormControl, FormErrorMessage, FormLabel, GridItem, HStack, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, Tbody, Text, Tfoot, Th, Thead, Tr, useDisclosure, useToast, VStack } from "@chakra-ui/react"
import { useFormik } from "formik"
import React, { useEffect, useRef, useState } from "react"
import { axiosInstance } from "../../api"
import AdminCategoryItems from "../../components/admin/AdminCategoryItems"
import { BiSearchAlt2 } from "react-icons/bi"
import { MdAddCircle } from "react-icons/md"
import { BsFillArrowLeftSquareFill, BsFillArrowRightSquareFill } from "react-icons/bs";
import { useSelector } from "react-redux"

const AdminCategory = () => {

    const authSelector = useSelector((state) => state.auth)

    const [showCategory, setShowCategory] = useState([])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [currentSearch, setCurrentSearch] = useState("")
    const [sortBy, setSortBy] = useState("id")
    const [sortDir, setSortDir] = useState("ASC")

    const inputFileRef = useRef(null)

    const cancelRef = React.useRef()

    const toast = useToast()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [openedEdit, setOpenedEdit] = useState(null)

    const {
        isOpen: isOpenAddNewCategory,
        onOpen: onOpenAddNewCategory,
        onClose: onCloseAddNewCategory,
    } = useDisclosure()

    const doubleOnClick = () => {
        onCloseAddNewCategory()
        formikAddNewCategory.handleSubmit()
    }

    const nextPage = () => {
        setPage(page + 1)
    }

    const previousPage = () => {
        setPage(page - 1)
    }

    const formikAddNewCategory = useFormik({
        initialValues: {
            category_name: "",
            category_image: null,
        },
        onSubmit: async ({ category_name, category_image }) => {
            try {
                let newCategory = new FormData()

                newCategory.append("category_name", category_name)
                newCategory.append("category_image", category_image)

                const response = await axiosInstance.post('/admin/categories', newCategory)

                formikAddNewCategory.setFieldValue("category_name", "")
                formikAddNewCategory.setFieldValue("category_image", null)

                toast({
                    title: "Category created",
                    description: response.data.message,
                    status: "success",
                })

                fetchCategory()
            } catch (err) {
                console.log(err)
                toast({
                    title: "Failed create new Category",
                    description: err.response.data.message,
                    status: "error",
                })
            }
        }
    })

    const editFormik = useFormik({
        initialValues: {
            category_name: "",
            category_image: null
        },
        onSubmit: async ({ category_name, category_image }) => {
            try {

                const newCategory = new FormData()

                if (category_name) {
                    newCategory.append("category_name", category_name)
                }

                if (category_image) {
                    newCategory.append("category_image", category_image)
                }

                const response = await axiosInstance.patch(`/admin/categories/${openedEdit.id}`, newCategory)

                toast({
                    title: "Category Edited",
                    description: response.data.message,
                    status: "success",
                })

                setOpenedEdit(null)
                fetchCategory()
            } catch (error) {
                console.log(error)
                toast({
                    title: "Failed Edit Category",
                    description: error.response.data.message,
                    status: "error",
                })
            }
        }
    })


    const fetchCategory = async () => {
        const maxItemsPerPage = 5
        try {
            const response = await axiosInstance.get('/admin/categories', {
                params: {
                    _page: page,
                    _limit: maxItemsPerPage,
                    category_name: currentSearch,
                    _sortBy: sortBy,
                    _sortDir: sortDir,
                }
            })

            setShowCategory(response.data.data)

            setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage))

        } catch (err) {
            console.log(err)
        }
    }

    const formik = useFormik({
        initialValues: {
            search: "",
        },
        onSubmit: ({ search }) => {
            setCurrentSearch(search)
            setPage(1)
        },
    })

    const searchBookHandler = ({ target }) => {
        const { name, value } = target
        formik.setFieldValue(name, value)
    }

    const inputChangeHandler = ({ target }) => {
        const { name, value } = target

        formikAddNewCategory.setFieldValue(name, value)
    }

    const editChangeHandler = ({ target }) => {
        const { name, value } = target

        editFormik.setFieldValue(name, value)
    }

    const sortCategoryHandler = ({ target }) => {
        const { value } = target

        setSortBy(value)
    }

    const sortDateHandler = ({ target }) => {
        const { value } = target

        setSortDir(value)
    }

    const renderCategory = () => {
        return showCategory.map((val) => {
            return (
                <AdminCategoryItems
                    key={val.id.toString()}
                    category_name={val.category_name}
                    category_image={val.category_image}
                    fetchCategory={fetchCategory}
                    onDelete={() => deleteCategoryHandler(val.id)}
                    onEdit={() => setOpenedEdit(val)}
                />
            )
        })
    }

    const deleteCategoryHandler = async (id) => {
        try {
            await axiosInstance.delete(`/admin/categories/${id}`)

            fetchCategory()

            toast({
                title: "Category Deleted",
                status: "info",
            })

            onClose()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [page, currentSearch, sortBy, sortDir, openedEdit])

    useEffect(() => {
        if (openedEdit) {
            editFormik.setFieldValue("category_name", openedEdit.category_name)
            editFormik.setFieldValue("category_image", openedEdit.category_image)
        }
    }, [openedEdit])

    return (
        <>
            <Box mt={'40px'} width="750px" h={'750px'} ml={'500px'}>
                <Box p="" display={"flex"} justifyContent="space-between">
                    <VStack>
                        <Text fontSize={"2xl"} fontWeight="bold" color={"#0095DA"} mb={'10px'} mr={'330px'}>
                            Admin Product Category
                        </Text>

                        {/* Search Category */}
                        <HStack>
                            <GridItem display={"flex"} >
                                <Box display={"flex"} mr={'80px'}>
                                    <Box display={"flex"} my={"auto"}>
                                        <form onSubmit={formik.handleSubmit}>
                                            <FormControl>
                                                <InputGroup>
                                                    <Input
                                                        size={'md'}
                                                        type={'text'}
                                                        placeholder="Search category"
                                                        width={"200px"}
                                                        onChange={searchBookHandler}
                                                        name="search"
                                                        value={formik.values.search}
                                                    />
                                                    <InputRightElement width='5rem' >
                                                        <Button
                                                            h='2rem'
                                                            ml={"30px"}
                                                            bgColor="#fff"
                                                            color={"#0095DA"}
                                                            type="submit"
                                                            _hover={'none'}
                                                        >
                                                            <BiSearchAlt2 fontSize={'15px'} />
                                                        </Button>
                                                    </InputRightElement>
                                                </InputGroup>
                                            </FormControl>
                                        </form>
                                    </Box>
                                </Box>
                            </GridItem>
                            {/* sort category data */}
                            <Box mt={'54px'} mr={'70px'}>
                                <HStack>
                                    <Text
                                        fontSize={"15px"}
                                        fontWeight="semibold"
                                        mr="3px"
                                        color={'#212121'}
                                    >
                                        Sort :
                                    </Text>
                                    <Select
                                        onChange={sortCategoryHandler}
                                        fontSize={'15px'}
                                        fontWeight="normal"
                                        fontFamily="serif"
                                        width={'137px'}
                                        color={'#6D6D6F'}
                                    >
                                        <option value="id" > ❮ Sort By ❯</option>
                                        <option value="category_name">Name</option>
                                        <option value="updatedAt">Date modified</option>
                                    </Select>

                                    <Select
                                        onChange={sortDateHandler}
                                        fontWeight="normal"
                                        fontSize={'15px'}
                                        fontFamily="serif"
                                        width={'130px'}
                                        color={'#6D6D6F'}
                                    >
                                        <option value="ASC"> ❮ Sort Dir ❯</option>
                                        <option value="ASC">Asc</option>
                                        <option value="DESC">Desc</option>
                                    </Select>
                                </HStack>
                            </Box>
                        </HStack>
                    </VStack>
                </Box>

                {/* Table Category Data */}
                <Box
                    mt={"25px"}
                    pt={"0px"}
                    borderTop={'10px solid #0095DA'}
                    boxShadow={"rgba(0, 0, 0, 0.15) 0px 0.5rem 1rem"}
                    borderRadius={'10px'}
                    h={'650px'}
                    width={'610px'}
                >
                    <Table mt={'-5px'} variant={'striped'}>
                        <Thead bgColor={"#0095DA"} border={"1px solid #0095DA"} borderRadius={'10px'} >
                            <Tr h={"25px"}>
                                <Th width={'200px'} color={"#fff"} fontSize={"14px"}>Category Name</Th>
                                <Th width={'425px'} textAlign={'center'} color={"#fff"} fontSize={"14px"}>Category Image</Th>
                                <Th>
                                    <Button
                                        boxShadow={"rgba(0.24, 0.24, 0.24, 0.24) 0px 3px 8px"}
                                        bgColor={"#fff"}
                                        borderRadius={'50%'}
                                        color={authSelector.RoleId !== 3 ? "red" : "green"}
                                        _hover={false}
                                        onClick={onOpenAddNewCategory}
                                        pb={"-5px"}
                                        p={'0px 0px 0px 0px'}
                                        isDisabled={authSelector.RoleId !== 3 ? true : false}
                                        ml={'0px'}
                                    >
                                        <MdAddCircle fontSize={'40px'} />
                                    </Button>
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody bgColor={"#fff"} >
                            {renderCategory()}
                        </Tbody>
                        <Tfoot>
                            <Tr></Tr>
                        </Tfoot>
                    </Table>
                </Box>
            </Box>

            {/* Change Page */}
            <GridItem >
                <HStack justifyContent={"center"} mt={'50px'} mb={'50px'} ml={'50px'}>
                    <Button
                        bgColor={"white"}
                        color={"#0095DA"}
                        onClick={previousPage}
                        w={'50px'}
                        isDisabled={page === 1 ? true : null}
                    >
                        <BsFillArrowLeftSquareFill fontSize={'30px'} />
                    </Button>
                    <Button
                        w={"10px"}
                        p={"10px"}
                        bgColor={'#0095DA'}
                        color={'white'}
                        fontSize={"14px"}
                        _hover={'none'}
                        onClick={'none'}
                    >
                        {page}
                    </Button>
                    <Button
                        bgColor={"white"}
                        color="#0095DA"
                        onClick={nextPage}
                        w={'50px'}
                        isDisabled={page >= maxPage ? true : null}
                    >
                        <BsFillArrowRightSquareFill fontSize={'30px'} />
                    </Button>
                </HStack>
            </GridItem>

            {/* Modal Add new Category */}
            < Modal
                isOpen={isOpenAddNewCategory}
                onClose={onCloseAddNewCategory}
                motionPreset="slideInBottom"
                size={"md"}
                closeOnEsc={false}
            >
                <form onSubmit={formikAddNewCategory.handleSubmit}>
                    <ModalOverlay bg="blackAlpha.400" />
                    <ModalContent>
                        <ModalHeader fontSize={"2xl"} fontWeight="bold">
                            New Category
                        </ModalHeader>

                        <ModalBody>
                            <FormLabel fontSize={'25px'}>Category Name</FormLabel>
                            <FormControl isInvalid={formikAddNewCategory.errors.category_name}>
                                <Input
                                    type="text"
                                    name={"category_name"}
                                    value={formikAddNewCategory.values.category_name}
                                    onChange={inputChangeHandler}
                                />
                                <FormErrorMessage>
                                    {formikAddNewCategory.errors.category_name}
                                </FormErrorMessage>
                            </FormControl>

                            <FormLabel mt={"15px"}>Category Image</FormLabel>
                            <FormControl isInvalid={formikAddNewCategory.errors.category_image}>
                                <Input
                                    display="none"
                                    ref={inputFileRef}
                                    name="category_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        formikAddNewCategory.setFieldValue("category_image", event.target.files[0])
                                    }}
                                />
                                <Button
                                    colorScheme={'teal'}
                                    color={'#212121'}
                                    onClick={() => {
                                        inputFileRef.current.click()
                                    }}
                                    width="100%"
                                >
                                    {formikAddNewCategory?.values?.category_image?.name || "Upload Image"}
                                </Button>
                                <FormErrorMessage>
                                    {formikAddNewCategory.errors.category_image}
                                </FormErrorMessage>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button bgColor="white" color={'green'} border={"1px solid green"} mr={3} onClick={onCloseAddNewCategory}>
                                Cancel
                            </Button>
                            <Button colorScheme="green" mr={3} onClick={doubleOnClick} isDisabled={!formikAddNewCategory.values.category_name || !formikAddNewCategory.values.category_image}>
                                Create
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>


            {/* Modal Edit Category */}
            <Modal
                isOpen={openedEdit}
                onClose={() => setOpenedEdit(null)}
                motionPreset="slideInBottom"
                size={"md"}
                closeOnEsc={false}
            >
                <form onSubmit={editFormik.handleSubmit}>
                    <ModalOverlay bg="blackAlpha.400" />
                    <ModalContent>
                        <ModalHeader fontSize={"2xl"} fontWeight="bold">
                            Edit Category
                        </ModalHeader>

                        <ModalBody>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl isInvalid={editFormik.errors.category_name}>
                                <Input
                                    type="text"
                                    name={"category_name"}
                                    value={editFormik.values.category_name}
                                    onChange={editChangeHandler}
                                />
                                <FormErrorMessage>
                                    {editFormik.errors.category_name}
                                </FormErrorMessage>
                            </FormControl>

                            <FormLabel mt={"15px"}>Category Image</FormLabel>
                            <FormControl isInvalid={editFormik.errors.category_image}>
                                <Input
                                    display="none"
                                    ref={inputFileRef}
                                    name="category_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        editFormik.setFieldValue("category_image", event.target.files[0])
                                    }}
                                />
                                <Button
                                    bgColor={'#E2A85A'}
                                    _hover={'none'}
                                    onClick={() => {
                                        inputFileRef.current.click()
                                    }}
                                    width="100%"
                                >
                                    {editFormik?.values?.category_image?.name || "Upload Image"}
                                </Button>
                                <FormErrorMessage>
                                    {editFormik.errors.category_image}
                                </FormErrorMessage>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
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
                            {!openedEdit ? (
                                <Button
                                    bgColor="#F7931E"
                                    color={"white"}
                                    _hover={false}
                                    mr={3}
                                    type="submit"
                                >
                                    Save
                                </Button>
                            ) : (
                                <Button
                                    bgColor="#F7931E"
                                    color={"white"}
                                    _hover={false}
                                    mr={3}
                                    type="submit"
                                    isDisabled={
                                        editFormik.values.category_image !== openedEdit.category_image ||
                                            editFormik.values.category_name !== openedEdit.category_name
                                            ? false : true
                                    }
                                >
                                    Save
                                </Button>
                            )}
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    )
}

export default AdminCategory