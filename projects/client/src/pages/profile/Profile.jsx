import { Box, Button, Text, HStack, useToast } from "@chakra-ui/react"
import { useEffect } from "react"
import { useState } from "react"
import { BiUser } from "react-icons/bi"
import { axiosInstance } from "../../api"
import UserInfo from "../../components/profile/UserInfo"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { login } from "../../redux/features/authSlice"
import {
    addToProfile,
    fillDataProfile,
} from "../../redux/features/profileSlice"

const Profile = () => {
    const [userProfile, setUserProfile] = useState([])
    const authSelector = useSelector((state) => state.auth)
    const profileSelector = useSelector((state) => state.profile)
    const dispatch = useDispatch()

    const fetchUserDataById = async () => {
        try {
            const response = await axiosInstance.get(`/profile/3`)

            setUserProfile([response.data.data])
            // dispatch(fillDataProfile([response.data.data]))
            // console.log(profileSelector)
        } catch (err) {
            console.log(err)
        }
    }
    const renderPersonalInfo = () => {
        return userProfile.map((val) => {
            return (
                <UserInfo
                    key={val.id.toString()}
                    username={val.username}
                    email={val.email}
                    phone_number={val.phone_number}
                    profile_picture={val.profile_picture}
                    fetchUserDataById={fetchUserDataById}
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
                            <Button
                                p="16px 24px"
                                color="#0095DA"
                                borderBottom={"2px solid #0095DA"}
                                borderRadius="1px"
                                variant="link"
                            >
                                <Text>Personal Data</Text>
                            </Button>
                        </Box>

                        <Box display={"flex"} height="53px" fontWeight={"bold"}>
                            <Link to="/profile/change-password">
                                <Box
                                    p="16px 24px"
                                    _hover={{ color: "#0095DA" }}
                                >
                                    <Text>Change Password</Text>
                                </Box>
                            </Link>
                        </Box>
                    </HStack>
                    {renderPersonalInfo()}
                </Box>
            </Box>
        </Box>
    )
}

export default Profile
