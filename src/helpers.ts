/* eslint-disable prefer-const */
import {
  log,
  BigInt,
  BigDecimal,
  Address,
  ethereum,
} from "@graphprotocol/graph-ts";
import { ContractStat, Transaction } from "../generated/schema";
import { ADDRESS_ZERO, CONTRACT_ADDRESS, ONE_BI, ZERO_BI } from "./constants";

export function loadTransaction(event: ethereum.Event): Transaction {
  let transaction = Transaction.load(event.transaction.hash.toHexString());
  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHexString());
  }
  transaction.blockNumber = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.gasLimit = event.transaction.gasLimit;
  transaction.gasPrice = event.transaction.gasPrice;
  transaction.from = event.transaction.from;
  transaction.to = event.transaction.to;
  transaction.save();
  return transaction as Transaction;
}

export function handlePoolCreated(): void {
  // load factory
  let stat = ContractStat.load(CONTRACT_ADDRESS);
  if (stat === null) {
    stat = new ContractStat(CONTRACT_ADDRESS);
    stat.poolCnt = ZERO_BI;
    stat.txCnt = ZERO_BI;
    stat.modifyPositionCnt = ZERO_BI;
    stat.swapCnt = ZERO_BI;
    stat.totalLiquidity = ZERO_BI;
    stat.owner = ADDRESS_ZERO;
  }

  stat.poolCnt = stat.poolCnt.plus(ONE_BI);
  stat.save();
}

export function loadContractStat(): ContractStat {
  let stat = ContractStat.load(CONTRACT_ADDRESS);
  if (stat === null) {
    throw "contract is not deployed"
  }
  return stat
}