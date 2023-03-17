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
    useToast,
    Modal,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Spinner
} from "@chakra-ui/react";
import { useContractWrite, useWaitForTransaction, useAccount } from "wagmi";
import { useState } from "react";
import { decentainmentSetup } from "@/components/constants";
import { NFTStorage } from "nft.storage"
import { ethers } from "ethers";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "next/router";
import { NFT_STORAGE_KEY } from "@/components/constants";


const Create = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { address } = useAccount()

    const storage = new NFTStorage({token: NFT_STORAGE_KEY})

    const toast = useToast()

    const route = useRouter()


    const [fileUpload, setFileUpload] = useState(null);
    const [uri, setUri] = useState("");
    const [listedAmount, setListedAmount] = useState("");
    const [maxSupply, setMaxSupply] = useState("");
    const [name, setName] = useState("");
    const [slogan, setSlogan] = useState("");
    const [text, setText] = useState("Upload Image");


    async function imageUpload(){
        let metadata;
        if(fileUpload){
            metadata = await storage.store({
                name: name,
                description: slogan,
                image: fileUpload
            })

            setUri(metadata.url)
            onOpen()
        }
    }


    const { data:createData, isLoading:createLoading, write:createWrite } = useContractWrite({
        mode: "recklesslyUnprepared",
        ...decentainmentSetup,
        functionName: "createOG",
        args: [
            uri,
            ethers.utils.parseEther(listedAmount ? listedAmount.toString() : "0"),
            maxSupply
        ]
    })

    const { isLoading:createWaitLoading, isSuccess:createWaitSuccess } = useWaitForTransaction({
        hash: createData?.hash,
        onSuccess(){
            toast({
                title: "Fan Card Created",
                description: "Fan card successfully created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            setTimeout(() => {
                onClose()
                route.push("/")
            }, 3000);
        },
        onError(){
            toast({
                title: "Error",
                description: "Error occured",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            onClose()
        }
    })


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

    function handleSubmit(e){
        e.preventDefault();
        createWrite()
        setText("Upload Image")
    }

    function submitIPFS(){
        setUri("");
        setText("Uploading...")
        imageUpload();
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
                            value={name}
                            onChange={e => setName(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Input 
                             type='text'
                             placeholder='Slogan'
                             border="1px solid purple"
                             _hover={{"border": "1px solid #9776b3"}}
                             value={slogan}
                             onChange={e => setSlogan(e.target.value)}
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
                            value={listedAmount}
                            onChange={e => setListedAmount(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Input 
                             type='number'
                             placeholder='Max. Supply'
                             border="1px solid purple"
                             _hover={{"border": "1px solid #9776b3"}}
                             value={maxSupply}
                             onChange={e => setMaxSupply(e.target.value)}
                            />
                        </InputGroup>
                    </Flex>
                    {
                        address ?
                        <Button
                        mt={"1em"}
                        w={"80%"}
                        mx={"10%"}
                        colorScheme="purple"
                        variant={"solid"}
                        onClick={submitIPFS}
                        >
                            { text }
                        </Button>:
                        <Flex mt={"1em"} justifyContent={"center"}>
                            <CustomButton />
                        </Flex>
                    }
                </CardBody>
            </Card>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay
                backdropBlur={"2px"}
                backdropFilter='blur(1px)'
                />
                <ModalContent h={"18em"} bgColor={"purple.100"}>
                    <ModalBody p="2em">
                        <Box>
                            <Text fontSize="2xl" textAlign={"center"} fontWeight={"bold"}>Please do not close this modal</Text>
                            <Flex mt="4" justifyContent={"center"}>
                                {
                                    ( createLoading || createWaitLoading ) ?
                                    <>
                                    <Spinner size={"xl"} mr={"2"}/>
                                    <Text mt={"0.5em"} textAlign={"center"} fontWeight={"bold"} fontSize={"18px"} fontFamily={"fantasy"} fontStyle={"italic"}>Processing...</Text>
                                    </> :
                                    ( createWaitSuccess ) ?
                                    <>
                                    <Text mt={"0.5em"} textAlign={"center"} fontWeight={"bold"} fontSize={"18px"} fontFamily={"fantasy"} fontStyle={"italic"}>Completed</Text>
                                    </> :
                                    <>
                                    <Text mt={"0.5em"} textAlign={"center"} fontWeight={"bold"} fontSize={"18px"} fontFamily={"fantasy"} fontStyle={"italic"}>Kindly proceed by creating fan card 👇🏾</Text>
                                    </>
                                }
                            </Flex>
                        </Box>
                        <Flex justifyContent={"center"}>
                            <Button
                            mt={"3em"}
                            colorScheme='purple'
                            variant="solid"
                            px="2em"
                            onClick={handleSubmit}
                            disabled={ createLoading || createWaitLoading }
                            >
                                {
                                    (createLoading || createWaitLoading ) ?
                                    <>
                                    Loading <Spinner size="md" ml={"2"}/>
                                    </>: 
                                    "Create"
                                }
                            </Button>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Create;