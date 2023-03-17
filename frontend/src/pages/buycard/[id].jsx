import { HexToDecimal } from "@/components/Helpers";
import { cUSDSetup, decentainmentSetup, decentainmentCA } from "@/components/constants";
import {
    Box,
    Card,
    Image,
    Text,
    Flex,
    Button,
    Spinner,
    useToast
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useContractRead, useContractWrite, useWaitForTransaction, useAccount } from "wagmi";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import CustomButton from "@/components/CustomButton";

const BuyCard = () => {
    const toast = useToast()
    const { address } = useAccount()
    const { query } = useRouter()
    const route = useRouter()
    const pageId = Number(query.id)

    const [ogcard, setOgcard] = useState();

    const { data:ogread } = useContractRead({
        ...decentainmentSetup,
        functionName: "getAllOG"
    })


    const {data:tokenData, isLoading:tokenLoading, write:tokenWrite } = useContractWrite({
        mode: "recklesslyUnprepared",
        ...cUSDSetup,
        functionName: "approve",
        args: [
          decentainmentCA,
          ethers.utils.parseEther(ogcard? String(ogcard.listedAmount) : "0")
        ]
      })
  
      const { isLoading:tokenWaitLoading } = useWaitForTransaction({
        hash: tokenData?.hash,
        onSuccess(){
          buyCardWrite()
          toast({
            title: 'Token Approved',
            description: "You've successfully approved token",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right"
          })
        },
        onError(){
          toast({
            title: "Error",
            description: "Error encountered",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right"
          })
        }
      })
  
      const { data:buyCardData, isLoading:buyCardLoading, write:buyCardWrite } = useContractWrite({
        mode: "recklesslyUnprepared",
        ...decentainmentSetup,
        functionName: "joinOG",
        args: [
          (pageId+1)
        ]
      })

      const { isLoading:buyCardWaitLoading } = useWaitForTransaction({
        hash: buyCardData?.hash,
        onSuccess(){
            toast({
                title: 'Succesful',
                description: "Purchase of fan card is succesful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
            route.push("/ogspot")
        },
        onError(){
            toast({
                title: "Error",
                description: "Error encountered",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
        }
      })
  
  
      const { data:tokenRead } = useContractRead({
        ...cUSDSetup,
        functionName: "allowance",
        args: [
          address,
          decentainmentCA
        ]
      })
  
      function tokenAuthorization() {
        let amountInput = ethers.utils.parseEther(ogcard? String(ogcard.listedAmount) : "0")
        if(HexToDecimal(tokenRead?._hex) >= HexToDecimal(amountInput?._hex)){
            buyCardWrite()
        }
        else{
            tokenWrite()
        }
      }

      function handleSubmit(e){
        e.preventDefault()
        tokenAuthorization()
      }

    useEffect(() => {
        if(ogread){
          ogread.map((item, index) => {
            if(index == pageId){
                fetchIPFSJson(item)
            }
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
              supplyLeft: (HexToDecimal(element[4]?._hex) - HexToDecimal(element[3]?._hex)),
              totalSupply: HexToDecimal(element[4]?._hex)
            }
            setOgcard(objects)
            
          }
        
      
          function makeURL(ipfs){
            return ipfs.replace(/^ipfs:\/\//, "https://dweb.link/ipfs/");
          }
    }, [ogread]);


    return (
        <Box p={"12em 22%"}>
            <Card bgColor={"purple.200"} boxShadow={"md"} p="1em 10px">
                <Flex gap={4} justifyContent={"space-evenly"}>
                    <Image src={ogcard?.imageUrl} alt={ogcard?.name} h="13em" borderRadius={"8px"} />
                    <Box>
                        <Text>
                        <b>Name:</b> {ogcard?.name}
                        </Text>
                        <Text>
                        <b>Slogan:</b> <i>{ogcard?.slogan}</i>
                        </Text>
                        <Text>
                        <b>Listed Amount:</b> {ogcard?.listedAmount} cUSD
                        </Text>
                        <Text>
                        <b>Current Count:</b> {ogcard?.currentSupply}
                        </Text>
                        <Text>
                        <b>Card Left:</b> {ogcard?.supplyLeft}
                        </Text>
                        <Text>
                        <b>Total Supply:</b> {ogcard?.totalSupply}
                        </Text>

                        <Box mt={"1.5em"}>
                            {
                                address ?
                                <Button
                                variant={"solid"}
                                colorScheme="purple"
                                w={"100%"}
                                disabled={tokenLoading || tokenWaitLoading || buyCardWaitLoading || buyCardLoading}
                                onClick={handleSubmit}
                                >
                                {
                                    (tokenLoading || tokenWaitLoading || buyCardWaitLoading || buyCardLoading)?
                                    <>
                                    Loading <Spinner ml={"4"} />
                                    </>:
                                    "Buy fan card"
                                }
                                </Button>:
                                <CustomButton />
                            }
                        </Box>
                    </Box>
                </Flex>
            </Card>
        </Box>
    );
}

export default BuyCard;