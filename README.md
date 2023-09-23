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
