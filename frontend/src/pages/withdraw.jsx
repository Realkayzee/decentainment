import { decentainmentSetup } from "@/components/constants";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Text,
    Heading,
    Flex,
    InputGroup,
    Input,
    useToast
} from "@chakra-ui/react";
import { useState } from "react";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useRouter } from "next/router";

const Withdraw = () => {
    const toast = useToast()

    const route = useRouter()

    const [slotNumber, setSlotNumber] = useState("")

    const {data:withdrawData, isLoading:withdrawLoading, write:withdrawWrite } = useContractWrite({
        mode: "recklesslyUnprepared",
        ...decentainmentSetup,
        functionName: "withdrawOGDeposit",
        args:[
            String(slotNumber)
        ]
    })

    const { isLoading:withdrawWaitLoading } = useWaitForTransaction({
        hash: withdrawData?.hash,
        onSuccess(){
            toast({
                title: "Withdrawal Succesful",
                description: "Withdrawal has been successfully completed",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            route.push("/")
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
        }
    })


    function handleSubmit(e){
        e.preventDefault()
        withdrawWrite()
    }



    return (
        <Box p="12em 25%">
            <Card bgColor={"purple.200"} boxShadow={"md"} p="10px">
                <CardHeader>
                    <Heading fontSize={"22px"} textAlign={"center"}>
                        Artist Withdrawal
                    </Heading>
                    <Text fontFamily={"fantasy"} fontStyle={"italic"} textAlign={"center"}>Withdraw profit made from fan card</Text>
                </CardHeader>
                <Divider />
                <CardBody>
                    <InputGroup w="70%" mx="15%">
                        <Input
                        type="number"
                        placeholder="Slot number"
                        border="1px solid purple"
                        _hover={{"border": "1px solid #9776b3"}}
                        value={slotNumber}
                        onChange={e => setSlotNumber(e.target.value)}
                        />
                    </InputGroup>
                    <Flex justifyContent={"center"} mt={"4"}>
                        <Button
                        colorScheme="purple"
                        disabled={withdrawLoading || withdrawWaitLoading }
                        onClick={handleSubmit}
                        >
                            Withdraw Profit
                        </Button>
                    </Flex>
                </CardBody>
            </Card>
        </Box>
    );
}

export default Withdraw;