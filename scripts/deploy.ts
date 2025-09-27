import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PixelForge contracts...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy AssetNFT contract
  console.log("Deploying AssetNFT...");
  const AssetNFT = await ethers.getContractFactory("AssetNFT");
  const assetNFT = await AssetNFT.deploy();
  await assetNFT.waitForDeployment();
  const assetNFTAddress = await assetNFT.getAddress();
  console.log("AssetNFT deployed to:", assetNFTAddress);

  // Deploy TemplateNFT contract
  console.log("Deploying TemplateNFT...");
  const TemplateNFT = await ethers.getContractFactory("TemplateNFT");
  const templateNFT = await TemplateNFT.deploy();
  await templateNFT.waitForDeployment();
  const templateNFTAddress = await templateNFT.getAddress();
  console.log("TemplateNFT deployed to:", templateNFTAddress);

  // Deploy Marketplace contract
  console.log("Deploying Marketplace...");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(deployer.address);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace deployed to:", marketplaceAddress);

  // Save deployment addresses
  const deploymentInfo = {
    network: await ethers.provider.getNetwork(),
    deployer: deployer.address,
    contracts: {
      AssetNFT: assetNFTAddress,
      TemplateNFT: templateNFTAddress,
      Marketplace: marketplaceAddress,
    },
    deployedAt: new Date().toISOString(),
  };

  console.log("Deployment completed!");
  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));

  // Verify contracts on Etherscan (if on mainnet)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contracts on Etherscan...");

    try {
      await run("verify:verify", {
        address: assetNFTAddress,
        constructorArguments: [],
      });
      console.log("AssetNFT verified");

      await run("verify:verify", {
        address: templateNFTAddress,
        constructorArguments: [],
      });
      console.log("TemplateNFT verified");

      await run("verify:verify", {
        address: marketplaceAddress,
        constructorArguments: [deployer.address],
      });
      console.log("Marketplace verified");
    } catch (error) {
      console.log("Verification failed:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

