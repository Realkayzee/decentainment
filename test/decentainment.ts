import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai"


describe("decentainment", function() {

    async function deployLoadFixture() {
        const nftURI = "https://gateway.pinata.cloud/ipfs/QmX3XYV3t5xUmZULCdwcnuBzVz5DcdHFwBDeZghUz9JpG6"
        const listedAmount = ethers.utils.parseEther("20")

        const mUSDC = await ethers.getContractFactory("MyToken");
        const musdc = await mUSDC.deploy()

        const [owner, otherAccount] = await ethers.getSigners();

        const Decentainment = await ethers.getContractFactory("Decentainment")
        const decentainment = await Decentainment.deploy(musdc.address)

        return { nftURI, listedAmount, owner, otherAccount, decentainment, musdc };
    }

    describe("Interaction", function() {
        it("Should createOG for fans and joinOG", async function() {
            const {nftURI, listedAmount, decentainment, musdc, owner } = await loadFixture(deployLoadFixture)

            await decentainment.createOG(nftURI, listedAmount, 10);
            const getOGCount = await decentainment.OGCount(1);

            console.log(getOGCount[0], "OGCount");
            expect(getOGCount[0]).to.be.equal(nftURI);
            const getListedAmount = getOGCount[1]._hex;
            expect(getListedAmount).to.be.equal(listedAmount._hex);

            // Join OG

            await musdc.approve(decentainment.address, listedAmount);
            await decentainment.joinOG(1)

            const getBalance = await decentainment.balanceOf(owner.address);
            expect(Number(getBalance)).to.be.equal(1);
        })
    })
})