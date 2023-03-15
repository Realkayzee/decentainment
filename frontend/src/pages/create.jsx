import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Input,
    InputGroup,
    Text,
    Flex,
    Button,
    useToast
} from "@chakra-ui/react";

import { useState } from "react";

const Create = () => {
    const toast = useToast()
    const [fileUpload, setFileUpload] = useState(null);
    const [uri, setUri] = useState("");
    const [listedAmount, setListedAmount] = useState("");
    const [maxSupply, setMaxSupply] = useState("");
    const [name, setName] = useState("");
    const [slogan, setSlogan] = useState("");


    const onImageUploadChange = (e) => {
        const fileInput = e.target;

        if(!fileInput.files){
            toast({
                title:'Error',
                description: "No file was chosen",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return;
        }

        if(!fileInput.files || fileInput.files.length === 0){
            toast({
                title:'Error',
                description: "File list is empty",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return;
        }

        const file = fileInput.files[0];

        if(!file.type.startsWith("image")){
            toast({
                title:'Error',
                description: "Please select a valid image",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })

            return;
        }

        setFileUpload(file);

        e.currentTarget.type = "file";
    }



    return (
        <Box p="12em 25%">
            <Card align={"center"} bgColor={"purple.100"} boxShadow={"lg"}>
                <CardHeader>
                    <Text textAlign={"center"} fontWeight={600}>Ensure you fill the form with the required data</Text>
                </CardHeader>
                <CardBody>
                    <InputGroup border="1px solid purple" borderRadius="6px" w="45%" mx="27.5%">
                        <Input
                         type='file'
                         accept='image/'
                         w={"100%"}
                         h={"100%"}
                         p={0}
                         border={0}
                         color="#220f2e"
                         onChange={onImageUploadChange}
                        />
                    </InputGroup>
                    <Flex gap={2} mt="1em">
                        <InputGroup >
                            <Input
                            type='text'
                            placeholder='Stage Name'
                            border="1px solid purple"
                            _hover={{"border": "1px solid #9776b3"}}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Input 
                             type='text'
                             placeholder='Slogan'
                             border="1px solid purple"
                             _hover={{"border": "1px solid #9776b3"}}
                            />
                        </InputGroup>
                    </Flex>
                    <Flex gap={2} mt="1em">
                        <InputGroup >
                            <Input
                            type='number'
                            placeholder='Listed Amount'
                            border="1px solid purple"
                            _hover={{"border": "1px solid #9776b3"}}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Input 
                             type='number'
                             placeholder='Max. Supply'
                             border="1px solid purple"
                             _hover={{"border": "1px solid #9776b3"}}
                            />
                        </InputGroup>
                    </Flex>
                    <Button w="100%" colorScheme="purple" mt={"5"}>
                        Create
                    </Button>
                </CardBody>
            </Card>
        </Box>
    );
}

export default Create;