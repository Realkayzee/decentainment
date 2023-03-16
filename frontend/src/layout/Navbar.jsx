import CustomButton from "@/components/CustomButton";
import {
    Grid,
    GridItem,
    Button,
    Flex,
    Text
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";


export const Navbar = () => {

    const navbar = [
        {
            name: "Home",
            link: "/"
        },
        {
            name: "Create",
            link: "/create"
        },
        {
            name: "OG Spot",
            link: "/ogspot"
        },
        {
            name: "Profile",
            link: "/profile"
        },
    ]


    return (
        <>
            <Grid templateColumns="repeat(7, 1fr)" gap={4}>
                <GridItem colSpan={1}>
                    <Text py={2} fontFamily="monospace" fontWeight="bold" fontSize="18px">
                        Decentenmaint
                    </Text>
                </GridItem>
                <GridItem colSpan={3}/>
                <GridItem colSpan={2}>
                    <Flex minWidth="max-content">
                        {
                            navbar.map((item, index) => (
                                <Link href={item.link} key={index}>
                                    <Button
                                    variant="unstyled"
                                    fontWeight={500}
                                    px={2}
                                    fontFamily="san-serif"
                                    fontSize="lg"
                                    outlineOffset="0px"
                                    outline="0px"
                                    border="1px solid transparent"
                                    _hover={{
                                        "border" : "1px solid #A084DC",
                                        "borderRadius": "10px",
                                    }}
                                    >
                                        {item.name}
                                    </Button>
                                </Link>
                            ))
                        }
                    </Flex>
                </GridItem>
                <GridItem colSpan={1}>
                    <CustomButton />
                </GridItem>
            </Grid>
        </>
    )
}