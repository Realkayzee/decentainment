import { ethers } from "hardhat";

async function main() {
    const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"

    const Decentainment = await ethers.getContractFactory("Decentainment")
    const decentainment = await Decentainment.deploy(cUSDContractAddress)

    await decentainment.deployed()

    console.log(`Contract is deployed to ${decentainment.address}`)
    
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1;
});


// 0x183AABa41069fd03517dc10AE092C6fAd504614f