import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { axiosInstance } from "../../api"
import ChangeAddress from "../../components/order/ChangeAddress"
import CheckoutCartItems from "../../components/order/CheckoutCartItems"
import Alert from "../../components/profile/Alert"
import { getTotalPrice, getTotalQuantity } from "../../redux/features/cartSlice"
import close from "../../assets/close.png"
import BCA from "../../assets/BankLogo/BCA.png"
import BNI from "../../assets/BankLogo/BNI.png"
import mandiri from "../../assets/BankLogo/mandiri.png"
import { AiOutlineSafety } from "react-icons/ai"
import ShippingComponent from "../../components/order/ShippingComponent"

const Checkout = () => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [BCAChecked, setBCAChecked] = useState(true)
  const [BNIChecked, setBNIChecked] = useState(false)
  const [MandiriChecked, setMandiriChecked] = useState(false)
  const [productWeight, setProductWeight] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("BCA")
  const [shippingFee, setShippingFee] = useState(0)
  const [shippingError, setShippingError] = useState(false)
  const [defaultAddressId, setDefaultAddressId] = useState(0)
  const [courirDuration, setCourirDuration] = useState("");

  const BCARadio = () => {
    setBCAChecked(true)
    setBNIChecked(false)
    setMandiriChecked(false)

    setPaymentMethod("BCA")
  }

  const BNIRadio = () => {
    setBCAChecked(false)
    setBNIChecked(true)
    setMandiriChecked(false)

    setPaymentMethod("BNI")
  }

  const MandiriRadio = () => {
    setBCAChecked(false)
    setBNIChecked(false)
    setMandiriChecked(true)

    setPaymentMethod("Mandiri")
  }

  const {
    isOpen: paymentIsOpen,
    onOpen: paymentOnOpen,
    onClose: paymentOnclose
  } = useDisclosure()

  const cartSelector = useSelector((state) => state.cart)

  const fetchTotalPrice = async () => {
    try {
      const response = await axiosInstance.get("/carts/price/total")

      dispatch(getTotalPrice(response.data.data.totalPrice))

      dispatch(getTotalQuantity(response.data.data.totalQuantity))

    } catch (err) {
      console.log(err)
    }
  }

  const fetchCheckoutCartItems = async () => {
    try {
      const response = await axiosInstance.get("/transactions/checkoutCartItems")

      const productWeight = response.data.data.map((val) => val.Product.product_weight)
      let total = 0

      for (let i = 0; i < productWeight.length; i++) {
        total += Number(productWeight[i])
      }

      setProductWeight(total)
    } catch (err) {
      console.log(err)
    }
  }

  const toast = useToast()

  const openPayment = () => {
    if (!shippingFee) {
      toast({
        title: "there is some incompletion please fix it first",
        status: "error",
      })
      setShippingError(true)
    } else {
      paymentOnOpen()
      setShippingError(false)
    }
  }

  const createNewTransaction = async () => {
    try {

      const response = await axiosInstance.post("/transactions/payItems", {
        shipping_fee: shippingFee,
        payment_method: paymentMethod,
        total_price: totalPrice,
        AddressId: defaultAddressId,
        courir_duration: courirDuration
      })

      navigate(`/payment/thank-you/shopedia/${response.data.data.transaction_name}`)

      toast({
        title: "Payment Success",
        description: response.data.message,
        status: "success",
      })

    } catch (err) {
      console.log(err)
      toast({
        title: "payment failed",
        status: "error",
      })
    }
  }

  const totalBill = Number(shippingFee) + Number(cartSelector.totalPrice)
  const transactionFee = 1000
  const totalPrice = Number(totalBill) + transactionFee

  useEffect(() => {
    fetchTotalPrice()
    fetchCheckoutCartItems()
  }, [])



  return (
    <Box>
      <Box h="52px" borderBottom="1px solid #e4e6e9">
        <Box m={'0px'} mt={'8px'} w={"1080px"} mx="auto" h="60px">
          <Link onClick={onOpen}>
            <Text
              fontSize={"30px"}
              fontWeight="bold"
              color={"#0095DA"}
              display="inline"
              my="auto"
              fontFamily={'Open Sauce One, sans-serif'}
            >
              Shop
            </Text>
            <Text
              pl={"0"}
              fontSize={"30px"}
              fontWeight="bold"
              color={"#F7931E"}
              display="inline"
              my="auto"
              fontFamily={'Open Sauce One, sans-serif'}
            >
              edia
            </Text>
          </Link>
        </Box>
      </Box>
      <Box w={"1120px"} p="0 20px" mx="auto">
        <Flex>
          <Box w="685px" mr="45px">
            <Box mt="30px">
              <Text
                fontWeight={700}
                fontSize="24px"
                color={'#31353B'}
                fontFamily={'Open Sauce One, sans-serif'}
                margin={'0px 0px 20px'}
              >
                Checkout
              </Text>
              <Box w={'710px'} border={'1px solid #99d5f0'} boxShadow={"0 0 10px 0 rgb(0 0 0 / 10%)"} borderRadius={"15px"} mb={'50px'} p={'20px'}>
                <Box borderBottom="6px solid #F7931E">
                  <ChangeAddress defaultAddressUser={setDefaultAddressId} />
                </Box>
                <Box pt={'19px'} minH={'232px'}>
                  <Grid templateColumns='.55fr .45fr' gap={1}>
                    <CheckoutCartItems />
                    <ShippingComponent selectedCourir={setCourirDuration} shippingFeePay={setShippingFee} productWeight={productWeight} shippingError={shippingError} setShippingError={setShippingError} />
                  </Grid>
                </Box >
                <Box h={'1px'} bgColor={'#fcd4a5'} w={'100%'}></Box>
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  p={'10px 0px'}
                  fontWeight={700}
                  fontSize={'14px'}
                  fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                  lineHeight={'20px'}
                  letterSpacing={'0px'}
                  margin={'0px'}
                  color={'#31353BF5'}
                  borderBottom="6px solid #F7931E"
                  mb={'10px'}
                >
                  <Text>
                    Subtotal
                  </Text>
                  <Text
                  >
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(cartSelector.totalPrice).split(",")[0]}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Shopping Summary */}
          <Box w="350px" mt="85px">
            <Box>
              <Box
                inset="92px auto auto 0px"
                zIndex={"1"}
                boxShadow={"0 0 10px 0 rgb(0 0 0 / 10%)"}
                borderRadius={"15px"}
                border={"1px solid #99d5f0"}
              >
                <Box p="16px" pb={'25px'}>
                  <Text
                    fontWeight={700}
                    lineHeight={1.6}
                    fontSize={'14px'}
                    fontFamily={'Open Sauce One, sans-serif'}
                    color={'#31353B'}
                  >
                    Shopping summary
                  </Text>
                  <Box
                    lineHeight={1.5}
                    fontSize={'14px'}
                    fontFamily={'Open Sauce One, sans-serif'}
                    color={'#31353B'}
                    textTransform={'capitalize'}
                    m="16px 0"
                  >
                    <Box display={"flex"} justifyContent="space-between">
                      <Box
                        p={'0px 14px 0px 0px'}
                      >
                        Total price ({cartSelector.totalQuantity} {cartSelector.totalQuantity < 2 ? "product" : "products"})
                      </Box>
                      <Box>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(cartSelector.totalPrice).split(",")[0]}
                      </Box>
                    </Box>
                    <Box
                      display={"flex"}
                      justifyContent="space-between"
                    >
                      <Box p={'0px 14px 0px 0px'}>
                        Total Shipping Cost
                      </Box>
                      <Box>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(shippingFee).split(",")[0]}
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent="space-between"
                    pt="16px"
                    mb="22px"
                    borderTop="1px solid #fcd4a5"
                    fontWeight={700}
                    fontSize={'16px'}
                    fontFamily={'Open Sauce One, sans-serif'}
                    color={'#31353B'}
                  >
                    <Box pr={'14px'}>
                      Grand Total
                    </Box>
                    <Box
                      fontSize={'17px'}
                    >
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(totalBill).split(",")[0]}
                    </Box>
                  </Box>
                  <Button
                    w="100%"
                    onClick={openPayment}
                    h={'48px'}
                    bgColor={"#0095DA"}
                    _hover={{
                      bgColor: "#0370A2",
                    }}
                    _active={
                      "none"
                    }
                  >
                    <Text
                      lineHeight={'22px'}
                      color="#fff"
                      fontFamily={'Open Sauce One, sans-serif'}
                      fontWeight={700}
                    >
                      Choose Payment
                    </Text>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Box>

      <Alert
        body={"Changes you make to this page will not be saved"}
        cancelRef={cancelRef}
        color="#0095DA"
        isOpen={isOpen}
        header="Back To Cart?"
        leftButton={"Stay On This Page"}
        rightButton={"Go Back & Delete Changes"}
        onClose={onClose}
        onSubmit={() => navigate("/cart")}
      />

      <Modal isOpen={paymentIsOpen} onClose={paymentOnclose} closeOnOverlayClick={false}>
        <ModalOverlay bg='blackAlpha.900' />
        <ModalContent width={'434.55px'} borderRadius={'10px'}>
          <ModalHeader width={'434.55px'} height={'51.99px'}>
            <Box display={'flex'} flexDir={'row'} justifyContent={'flex-start'} alignItems={'center'}>
              <Image
                src={close}
                width={'18px'}
                h={'18px'}
                onClick={() => paymentOnclose()}
              />
              <Text
                fontSize={'17px'}
                pl={'15px'}
                fontFamily={"Open Sauce One, -apple-system,  BlinkMacSystemFont, sans-serif"}
                fontWeight={600}
                color={'#000000B3'}
              >
                Payment
              </Text>
            </Box>
          </ModalHeader>
          <ModalBody w={'434.55px'}>
            <Box display={'flex'} h={'210.92px'} pt={'8px 0px'} flexDir={'column'}>
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                pb={'8px'}
                pt={'16px'}
                h={'45.98px'}
              >
                <Text
                  fontSize={'16px'}
                  fontWeight={800}
                  lineHeight={'22px'}
                  fontFamily={"Open Sauce One, -apple-system,  BlinkMacSystemFont, sans-serif"}
                  color={'#31353BF5'}
                >
                  Payment Methods
                </Text>
              </Box>
              <RadioGroup>
                <Box
                  display={'flex'}
                  pt={'12px'}
                  h={'51.99px'}
                  alignItems={'center'}
                  borderBottom={'1px solid rgb(229, 231, 233)'}
                  onClick={BCARadio}
                  cursor={'pointer'}
                >
                  <Image
                    p={'0px 12px 14px 0px'}
                    w={'45px'}
                    h={'26px'}
                    src={BCA}
                  />
                  <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    flex={'1 1 0%'}
                    minH={'52px'}
                    pr={'16px'}
                    pb={'12px'}
                    flexDir={'row'}
                  >
                    <Text
                      fontSize={'14px'}
                      fontWeight={700}
                      lineHeight={'20px'}
                      color={'#31353BF5'}
                      fontFamily={"Open Sauce One, -apple-system,  BlinkMacSystemFont, sans-serif"}
                    >
                      BCA Virtual Account
                    </Text>
                    <Radio
                      whiteSpace={'nowrap'}
                      paddingLeftp={'8px'}
                      position={'relative'}
                      isChecked={BCAChecked}
                    />
                  </Box>
                </Box>

                <Box
                  display={'flex'}
                  pt={'12px'}
                  h={'51.99px'}
                  alignItems={'center'}
                  borderBottom={'1px solid rgb(229, 231, 233)'}
                  onClick={BNIRadio}
                  cursor={"pointer"}
                >
                  <Image
                    p={'0px 12px 14px 0px'}
                    w={'45px'}
                    h={'27px'}
                    src={BNI}
                  />
                  <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    flex={'1 1 0%'}
                    minH={'52px'}
                    pr={'16px'}
                    pb={'12px'}
                    flexDir={'row'}
                  >
                    <Text
                      fontSize={'14px'}
                      fontWeight={700}
                      lineHeight={'20px'}
                      color={'#31353BF5'}
                      fontFamily={"Open Sauce One, -apple-system,  BlinkMacSystemFont, sans-serif"}
                    >
                      BNI Virtual Account
                    </Text>
                    <Radio
                      whiteSpace={'nowrap'}
                      paddingLeftp={'8px'}
                      position={'relative'}
                      isChecked={BNIChecked}
                    />
                  </Box>
                </Box>
                <Box
                  display={'flex'}
                  pt={'12px'}
                  h={'51.99px'}
                  alignItems={'center'}
                  onClick={MandiriRadio}
                  cursor={"pointer"}
                >
                  <Image
                    p={'0px 12px 16px 0px'}
                    w={'46px'}
                    h={'29px'}
                    src={mandiri}
                  />
                  <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    flex={'1 1 0%'}
                    minH={'52px'}
                    pr={'16px'}
                    pb={'12px'}
                    flexDir={'row'}
                  >
                    <Text
                      fontSize={'14px'}
                      fontWeight={700}
                      lineHeight={'20px'}
                      color={'#31353BF5'}
                      fontFamily={"Open Sauce One, -apple-system,  BlinkMacSystemFont, sans-serif"}
                    >
                      Mandiri Virtual Account
                    </Text>
                    <Radio
                      whiteSpace={'nowrap'}
                      paddingLeftp={'8px'}
                      position={'relative'}
                      isChecked={MandiriChecked}
                    />
                  </Box>
                </Box>
              </RadioGroup>
            </Box>
            <Box ml={'-24px'} w={'434.55px'} h={'7px'} bgColor={"rgb(243, 244, 245)"} />
            <Box
              h={'129.96px'}
              p={'8px 0px'}
            >
              <Text
                pt={'16px'}
                pb={'16px'}
                fontWeight={800}
                fontSize={'16px'}
                lineHeight={'22px'}
                m={'0px'}
                color={'#31353BF5'}
                fontFamily={"Open Sauce One, -apple-system,  BlinkMacSystemFont, sans-serif"}
              >
                Payment Summary
              </Text>
              <Box
                display={'flex'}
                flexDir={'row'}
                justifyContent={'space-between'}
                mb={'8px'}
                fontSize={'14px'}
                lineHeight={'18px'}
                fontFamily={"Open Sauce One, -apple-system,  BlinkMacSystemFont, sans-serif"}
                whiteSpace={'nowrap'}
                overflow={'hidden'}
                textOverflow={'ellipsis'}
                color={'#31353BAD'}
              >
                <Text>
                  Total Cost
                </Text>
                <Text >
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(totalBill).split(",")[0]}
                </Text>
              </Box>
              <Box
                display={'flex'}
                flexDir={'row'}
                justifyContent={'space-between'}
                fontSize={'14px'}
                lineHeight={'18px'}
                fontFamily={"Open Sauce One, -apple-system,  BlinkMacSystemFont, sans-serif"}
                color={'#31353BAD'}
              >
                <Text>
                  Transaction fees
                </Text>
                <Text>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(1000).split(",")[0]}
                </Text>
              </Box>
            </Box>
            <Box ml={'-24px'} w={'434.55px'} h={'7px'} bgColor={"rgb(243, 244, 245)"} />
            <Box
              h={'125.97px'}
              pt={'24px'}
              pb={'24px'}
              display={'flex'}
              justifyContent={'flex-start'}
            >
              <AiOutlineSafety style={{ height: "23.99px", minWidth: "23.99px", color: "#0095DA" }} />
              <Box pl={'12px'}>
                <Text
                  fontSize={'13px'}
                  mb={'4px'}
                  lineHeight={'18px'}
                  fontWeight={800}
                  fontFamily={"Open Sauce One, -apple-system,  BlinkMacSystemFont, sans-serif"}
                  color={'#31353BF5'}
                >
                  Guaranteed Payment
                </Text>
                <Text
                  fontFamily={"Open Sauce One, -apple-system,  BlinkMacSystemFont, sans-serif"}
                  color={'#31353BAD'}
                  fontSize={'11px'}
                  lineHeight={'18px'}
                >
                  Shopedia guarantees the security of the funds you pay in every transaction.
                </Text>
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter
            display={"flex"}
            justifyContent={'space-between'}
            flexDir={'row'}
            p={'12px 16px'}
          >
            <Box>
              <Text
                fontFamily={"Open Sauce One, -apple-system,  BlinkMacSystemFont, sans-serif"}
                color={'#31353BF5'}
                fontSize={'12px'}
                fontWeight={700}
                lineHeight={'20px'}
                whiteSpace={'nowrap'}
                textOverflow={'ellipsis'}
                overflow={'hidden'}
              >
                Total Bill
              </Text>
              <Text
                fontFamily={"Open Sauce One, -apple-system,  BlinkMacSystemFont, sans-serif"}
                color={'#31353BF5'}
                fontSize={'16px'}
                fontWeight={800}
                m={'0px'}
                lineHeight={'20px'}
              >
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(totalPrice).split(",")[0]}
              </Text>
            </Box>
            <Button
              variant='ghost'
              h={'40px'}
              w={'201.28px'}
              p={'0px 16px'}
              lineHeight={'18px'}
              borderRadius={'8px'}
              fontWeight={800}
              bgColor={'#0095DA'}
              color={'#fff'}
              onClick={createNewTransaction}
              _hover={'none'}
              _active={{
                bgColor: '#0370A2'
              }}
            >
              <Box >
                <AiOutlineSafety style={{ height: "23.99px", width: "23.99px" }} />
              </Box>
              <Text pl={'2px'}>
                Pay
              </Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box >

  )
}

export default Checkout
