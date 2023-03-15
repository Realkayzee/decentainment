import {
  Box,
  Button,
  Flex,
  Text
} from "@chakra-ui/react";
import Link from "next/link";


const Home = () => {
  return (
    <Box p="12em 6em">
      <Text fontSize="4xl" textAlign="center" fontFamily="fantasy" fontStyle="italic">
          Show you are a true fan by purchasing fan card of an Artist you support
      </Text>
      <Flex justifyContent={"space-between"} w="35%" m="0.6em 32.5%" px="3em">
        <Link href={"/create"}>
          <Button
            variant={"unstyled"}
            px={2}
            outlineOffset={"0px"}
            outline={"0px"}
            border={"2px solid #A084DC"}
            borderRadius={"lg"}
          >
            Create
          </Button>
        </Link>
        <Link href={"/ogspot"}>
          <Button
           variant={"solid"}
           colorScheme="purple"
           px={4}
          >
            OG Spot
          </Button>
        </Link>
      </Flex>
    </Box>
  );
}

export default Home;