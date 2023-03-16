import {
    Box,
    Grid,
    Card,
    Image,
    Text,
    Button
} from "@chakra-ui/react";
import { OGCard } from "./ogspot";
import { useContractRead, useAccount, useContractWrite } from "wagmi";
import { decentainmentSetup } from "@/components/constants";

const Profile = () => {
    const { address } = useAccount()

    const { data:getId } = useContractRead({
        ...decentainmentSetup,
        functionName: "getTokensURI",
    })

    function submit(e){
        e.preventDefault();
        write()
    }

    console.log(getId, "my token uri")

    return (
        <Box w="90%" mx={"5%"} pb="2em">
            <Box mt="5em"  borderRadius="10px 10px 0 0" bgColor="purple.100" boxShadow="xs" p="5px">
                <Text textAlign={"center"} fontWeight={"bold"} fontSize={"18px"} letterSpacing={"1px"}>
                Artists Card Owned
                </Text>
            </Box>
            <Box
            mt="1em"
            borderRadius={"0 0 10px 10px"}
            bgColor={"purple.100"}
            boxShadow={"lg"}
            p="25px 15px"
            mb="4em"
            >
            <Grid templateColumns="repeat(3, 1fr)" gap={5}>
                {
                OGCard.map((item, index) => (
                    <Card bgColor={"purple.200"} h="20em" boxShadow="md" p="10px" key={index}>
                    <Image src={item.image} alt={item.slogan} h="12em" borderRadius={"8px"}/>
                    <Box mt="10px">
                        <Text>
                        <b>Name:</b> {item.name}
                        </Text>
                        <Text>
                        <b>Slogan:</b> <i>{item.slogan}</i>
                        </Text>
                        <Text>
                        <b>Current Supply:</b> {item.currentSupply}
                        </Text>
                        <Text>
                        <b>Supply Left:</b> {item.supplyLeft}
                        </Text>
                    </Box>
                    </Card>
                ))
                }
                <Button onClick={submit}>
                    click
                </Button>
            </Grid>
            </Box>
        </Box>
    );
}

export default Profile;