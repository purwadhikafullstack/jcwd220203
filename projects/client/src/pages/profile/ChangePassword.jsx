import { Box, Button, Text, HStack } from "@chakra-ui/react"
import { useEffect } from "react"
import { useState } from "react"
import { BiUser } from "react-icons/bi"
import { axiosInstance } from "../../api"
import { Link } from "react-router-dom"
import Password from "../../components/profile/Password"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { fillDataProfile } from "../../redux/features/profileSlice"
import { login } from "../../redux/features/authSlice"

const ChangePassword = () => {
    const [userProfile, setUserProfile] = useState([])
    const authSelector = useSelector((state) => state.auth)
    const profileSelector = useSelector((state) => state.profile)
    const dispatch = useDispatch()

    const fetchUserDataById = async () => {
        try {
            const response = await axiosInstance.get("/profile/3")

            setUserProfile([response.data.data])
            // dispatch(fillDataProfile([response.data.data]))
            // console.log(response)
        } catch (err) {
            console.log(err)
        }
    }

    const renderPassword = () => {
        return userProfile.map((val) => {
            return (
                <Password
                    key={val.id.toString()}
                    password={val.password}
                    profile_picture={val.profile_picture}
                />
            )
        })
    }

    useEffect(() => {
        fetchUserDataById()
    }, [])
    return (
        <Box mt="55px" fontSize={"16px"} color="rgba(0,0,0,.54)">
            <Box w="1208px" marginX={"auto"}>
                <Box display={"flex"} mt="80px" mb="16px">
                    <Box mr="8px" my={"auto"}>
                        <BiUser fontSize={"20px"} />
                    </Box>
                    <Text fontSize={"16px"} fontWeight="bold" my={"auto"}>
                        {authSelector.username}
                    </Text>
                </Box>

                <Box border={"1px solid #dfe1e3"} borderRadius="10px">
                    <HStack>
                        <Box display={"flex"} height="53px" fontWeight={"bold"}>
                            <Link to="/profile">
                                <Box
                                    p="16px 24px"
                                    _hover={{ color: "#0095DA" }}
                                >
                                    <Text>Personal Info</Text>
                                </Box>
                            </Link>
                        </Box>

                        <Box display={"flex"} height="53px" fontWeight={"bold"}>
                            <Button
                                p="16px 24px"
                                color="#0095DA"
                                borderBottom={"2px solid #0095DA"}
                                borderRadius="1px"
                                variant="link"
                            >
                                <Text>Change Password</Text>
                            </Button>
                        </Box>
                    </HStack>
                    {renderPassword()}
                </Box>
            </Box>
        </Box>
    )
}

export default ChangePassword
