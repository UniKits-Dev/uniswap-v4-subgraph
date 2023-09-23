# Example Subgraph

An example to help you get started with The Graph. For more information see the docs on https://thegraph.com/docs/.

## Running on Ubuntu

1. setup the local anvil chain

```bash
anvil --host 0.0.0.0 --code-size-limit 300000
```

2. start graph node (remove previous data if there is any)

```bash
docker compose up
```

3. create and deploy graph instance

```bash
npm run create-local
npm run deploy-local
```

Then should be able to see data at [http://localhost:8000/subgraphs/name/uniswap-v4](http://localhost:8000/subgraphs/name/uniswap-v4)

4. deploy a uniswap-v4 contract

```bash
cd ../v4-core-helper
bash scriptDeploy.sh # and copy the contract address
```

5. run uniswap-v4 operations

```bash
# copy the contract address to Swap.s.sol
cd ../v4-core-helper
bash scriptSwap.sh
```

6. verify effects in DB

First get the docker address:

```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' uniswap-v4-subgraph-postgres-1
```

Connect to DB using the address and see the effects.

Or query GraphiQL using the UI:

```
query {
    pools {
      id
      poolKey
      currency0
      currency1
    }
}
```

### Working with Arbitrum

Because the public Arbitrum net has a maximum code size of 24KB, we use a local Arbitrum network for demonstration.

1. set up the local arbitrum network

```bash
git clone -b eth-global --recurse-submodules https://github.com/OffchainLabs/nitro-testnode.git && cd nitro-testnode
# IMPORTANT
# change all appearance of 127.0.0.1 to 0.0.0.0 in nitro-testnode/docker-compose.yaml
# if you want to access the local arbitrum node in a docker container

# first time run
./test-node.bash --init
# using previous blocks
# ./test-node.bash
```

2. transfer ETH to test account

```bash
./test-node.bash script send-l2 --to address_0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --ethamount 5
```

3. deploy uniswap-v4 and do operations

```bash
ARBITRUM_RPC_URL=http://localhost:8547
ARBITRUM_PRIVATE_KEY=0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659
# to deploy
forge script script/Deploy-Pool-Manager.s.sol --broadcast --fork-url $ARBITRUM_RPC_URL --private-key $ARBITRUM_PRIVATE_KEY --code-size-limit 300000
# to provide liquidity and swap
# copy and fill the contract address into Swap.s.sol
forge script script/Swap.s.sol  --broadcast --fork-url $ARBITRUM_RPC_URL --private-key $ARBITRUM_PRIVATE_KEY --code-size-limit 300000
```

4. connect subgraph to arbitrum

```bash
# change the address in subgraph.yaml to the deployed contract
# then start graph node
docker compose up
npm run codegen
npm run create-local
npm run deploy-local
```

5. query on the frontend. Go to the link and start querying!
