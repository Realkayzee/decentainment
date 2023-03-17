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
import { useEffect, useState } from "react";

const Profile = () => {
    const { address } = useAccount()

    const [ogcard, setOgcard] = useState([]);

    const { data:getUriOwn } = useContractRead({
        ...decentainmentSetup,
        functionName: "getTokensURI",
        args: [
            address
        ]
    })

    useEffect(() => {
        if(getUriOwn){
            setOgcard([])
            getUriOwn.map((item) => {
                fetchIPFSJson(item)
            })
        }

        async function fetchIPFSJson(element){
            const uri = makeURL(element)
            const respond = await fetch(uri)
            const metadata = await respond.json()
            const imageUrl = makeURL(metadata.image)
            const name = metadata.name
            const slogan = metadata.description

            const objects = {
                name: name,
                imageUrl: imageUrl,
                slogan: slogan
            }
            setOgcard(prev => [...prev, objects])
        }


        function makeURL(ipfs){
            return ipfs.replace(/^ipfs:\/\//, "https://dweb.link/ipfs/");
          }
    }, []);

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
                    ogcard.map((item, index) => (
                        <Card bgColor={"purple.200"} h="15em" boxShadow="md" p="10px" key={index}>
                            <Image src={item.imageUrl} alt={item.slogan} h="10em" borderRadius={"8px"}/>
                            <Box mt={"10px"}>
                                <Text>
                                    <b>Name:</b> {item.name}
                                </Text>
                                <Text>
                                    <b>Slogan:</b> {item.slogan}
                                </Text>
                            </Box>
                        </Card>
                    ))
                }
            </Grid>
            </Box>
        </Box>
    );
}

export default Profile;