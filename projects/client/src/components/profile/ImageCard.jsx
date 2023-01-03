import { Avatar, Box, Button, Input, Text } from "@chakra-ui/react"

import { useRef, useState } from "react"
import { useSelector } from "react-redux"

const ImageCard = ({ userData, btnSubmit }) => {
    const [selectImage, setSelectImage] = useState(null)
    const inputFileRef = useRef()
    const authSelector = useSelector((state) => state.auth)
    const apiImg = process.env.REACT_APP_IMAGE_URL

    return (
        <Box p="16px 0" display={"flex"}>
            <Box p="16px" width={"290px"}>
                <Box
                    p="16px"
                    mb="24px"
                    boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                    borderRadius="8px"
                >
                    <Avatar
                        src={
                            selectImage
                                ? selectImage
                                : `${apiImg}/${authSelector.profile_picture}`
                        }
                        name={userData.username}
                        w={"225px"}
                        h="225px"
                        mb="16px"
                        borderRadius={"3px"}
                    />
                    <Button
                        w="100%"
                        _hover={false}
                        fontWeight="bold"
                        bgColor={"white"}
                        border="1px solid #dfe1e3"
                        borderRadius={"5px"}
                        onClick={() => inputFileRef.current.click()}
                    >
                        Select Photo
                    </Button>
                    <Input
                        w="100%"
                        _hover={false}
                        fontWeight="bold"
                        bgColor={"white"}
                        border="1px solid #dfe1e3"
                        borderRadius={"5px"}
                        onChange={(e) => {
                            setSelectImage(
                                URL.createObjectURL(e.target.files[0])
                            )
                            btnSubmit(e.target.files[0])
                        }}
                        accept="image/*"
                        name="profile_picture"
                        type="file"
                        color="transparent"
                        ref={inputFileRef}
                        display="none"
                    />

                    <Text m="12px 0" fontSize={"12px"}>
                        File size: maximum 2,000,000 bytes (2 Megabytes).
                        Allowed file extensions: .JPG .JPEG .PNG
                    </Text>
                </Box>
            </Box>
        </Box>
    )
}

export default ImageCard
