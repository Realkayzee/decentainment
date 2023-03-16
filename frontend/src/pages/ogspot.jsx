import {
    Box,
    Text,
    Grid,
    Image,
    Card,
    useToast
} from "@chakra-ui/react";

import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { ethers } from "ethers";
import { decentainmentSetup, decentainmentCA, cUSDSetup } from "@/components/constants";
import { HexToDecimal } from "@/components/Helpers";
import { useState, useEffect } from "react";
import Link from "next/link";


export const OGCard = [
    {
        name: "Wizkid",
        listedAmount: "2 cUSD",
        slogan: "Jah Bless",
        totalSupply: "50,000",
        currentSupply: "10,000",
        supplyLeft: "40,000",
        image: "data:image/jpeg;base64,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"
      },
      {
        name: "Olamide",
        listedAmount: "2 cUSD",
        slogan: "YBNL",
        totalSupply: "50,000",
        currentSupply: "10,000",
        supplyLeft: "40,000",
        image: "data:image/jpeg;base64,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",
      },
      {
        name: "Lil-Kesh",
        listedAmount: "2 cUSD",
        slogan: "YAGI",
        totalSupply: "50,000",
        currentSupply: "10,000",
        supplyLeft: "40,000",
        image: "https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg"
      },
      {
        name: "Asake",
        listedAmount: "2 cUSD",
        slogan: "Ololade mi Asake",
        totalSupply: "50,000",
        currentSupply: "10,000",
        supplyLeft: "40,000",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpOCIPOxKGbMo_LhjiZ3kQquwhDkjuNWNPUg&usqp=CAU"
      },
      {
        name: "Tems",
        listedAmount: "2 cUSD",
        slogan: "Tems",
        totalSupply: "50,000",
        currentSupply: "10,000",
        supplyLeft: "40,000",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTbJ6q6nCvC-F8ctwjE8F_gh176HK1p-EcKg&usqp=CAU"
      },
      {
        name: "Rihana",
        listedAmount: "2 cUSD",
        slogan: "Rihana",
        totalSupply: "50,000",
        currentSupply: "10,000",
        supplyLeft: "40,000",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOPfFsOephrZJPvwVPKqB3SPk_vJlBg5oreQ&usqp=CAU"
      }
] 


const Ogspot = () => {
    const toast = useToast()
    
    const { address } = useAccount()

    const [ogcard, setOgcard] = useState([]);
    const [ognumber, setOgnumber] = useState();


    const { data:ogread } = useContractRead({
        ...decentainmentSetup,
        functionName: "getAllOG"
    })
    

    useEffect(() => {
        if(ogread){
          setOgcard([])
          ogread.map((item) => {
            fetchIPFSJson(item)
          })
        }


        async function fetchIPFSJson(element){
            const uri = makeURL(element[0])
            const respond = await fetch(uri)
            const metadata = await respond.json()
            const imageUrl = makeURL(metadata.image)
            const name = metadata.name
            const slogan = metadata.description
      
            const objects = {
              name: name,
              listedAmount: (HexToDecimal(element[1]?._hex)/1e18),
              imageUrl: imageUrl,
              slogan: slogan,
              currentSupply: HexToDecimal(element[3]?._hex),
              supplyLeft: (HexToDecimal(element[4]?._hex) - HexToDecimal(element[3]?._hex))
            }
            setOgcard(prev => [...prev, objects])
            
          }
        
      
          function makeURL(ipfs){
            return ipfs.replace(/^ipfs:\/\//, "https://dweb.link/ipfs/");
          }
    }, [ogread]);


    return (
        <Box w="90%" mx={"5%"} pb="2em">
            <Box mt={"5em"} borderRadius={"10px 10px 0 0"} bgColor={"purple.100"} boxShadow={"xs"} p="5px">
                <Text textAlign={"center"} fontWeight={"bold"} fontSize={"18px"} letterSpacing={"1px"}>
                    Artists Card
                </Text>
                <Text textAlign={"center"} fontFamily={"fantasy"} fontStyle={"italic"}>Purchase fan base card to prove your loyalty</Text>
            </Box>
            <Box
            mt="1em"
            borderRadius={"0 0 10px 10px"}
            bgColor={"purple.100"}
            boxShadow={"lg"}
            p="25px 15px"
            mb="4em"
            >
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                    {
                        ogcard?.map((item, index) => (
                          <Link href={`/buycard/${index}`} key={index}>
                            <Card bgColor={"purple.200"} h="21em" boxShadow="md" p="10px" cursor={"pointer"}>
                            <Image src={item.imageUrl} alt={item.name} h="12em" borderRadius={"8px"} />
                            <Box mt="10px">
                                <Text>
                                <b>Name:</b> {item.name}
                                </Text>
                                <Text>
                                <b>Slogan:</b> <i>{item.slogan}</i>
                                </Text>
                                <Text>
                                <b>Listed Amount:</b> {item.listedAmount} cUSD
                                </Text>
                                <Text>
                                <b>Current Count:</b> {item.currentSupply}
                                </Text>
                                <Text>
                                <b>Supply Left:</b> {item.supplyLeft}
                                </Text>
                            </Box>
                            </Card>
                          </Link>
                        ))
                    }
                </Grid>
            </Box>
        </Box>
    )
}

export default Ogspot;