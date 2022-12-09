npx hardhat run scripts/0_deploy_Mock_USDT.js --network $1
npx hardhat run scripts/0_deploy_Mock_WETH.js --network $1
npx hardhat run scripts/1_deploy_Task.js --network $1
npx hardhat run scripts/1_deploy_TaskMetadata.js --network $1
npx hardhat run scripts/2_deploy_Order.js --network $1
npx hardhat run scripts/3_deploy_Stage.js --network $1
