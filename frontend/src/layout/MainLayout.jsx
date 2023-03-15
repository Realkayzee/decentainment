import Head from "next/head";
import { Navbar } from "./Navbar";
import {
    Box,
    Container
} from "@chakra-ui/react";
import Footer from "./Footer";



export const MainLayout = ({children}) => {
    return (
        <>
        <Head>
            <title>Decentainment</title>
            <meta name="description" content="Get closer to your artist with decentainment" />
        </Head>
        <Box
        w={"100%"}
        minH={"100vh"}
        bgColor={"#FEF0FF"}
        color={"#220f2e"}
        >
            <Container maxW={"container.lg"} pt={"2"}>
                <Navbar />
                <Box minH={"90vh"}>
                    {children}
                </Box>
                <Footer />
            </Container>
        </Box>
        </>
    )
}
