import { ethereum, Transaction, BigNumber } from '@liquality/types'
import { padHexStart } from '@liquality/crypto'

import eip55 from 'eip55'

import { version } from '../package.json'

const GWEI = 1e9

/**
 * Converts a hex string to the ethereum format
 * @param {*} hash
 */
function ensure0x (hash: string) {
  return hash.startsWith('0x') ? hash : `0x${hash}`
}

/**
 * Converts an ethereum hex string to the standard format
 * @param {*} hash
 */
function remove0x (hash: ethereum.Hex) {
  return hash.replace(/^0x/, '')
}

/**
 * Converts an ethereum hex string to number
 * @param hex 
 */
function hexToNumber (hex: ethereum.Hex) : number {
  return parseInt(remove0x(hex), 16)
}

function numberToHex (number: BigNumber | number) : string {
  return ensure0x(new BigNumber(number).toString(16))
}

function checksumEncode (hash: string) {
  return eip55.encode(ensure0x(hash))
}

function ensureBlockFormat (block?: number) {
  if (block === undefined) {
    return 'latest'
  } else {
    return ensure0x(padHexStart(block.toString(16)))
  }
}

function normalizeTransactionObject <TxType extends ethereum.PartialTransaction = ethereum.Transaction> (tx: TxType, currentHeight?: number) : Transaction<TxType> {
  if (!(typeof tx === 'object' && tx !== null)) {
    throw new Error(`Invalid transaction object: "${tx}"`)
  }

  const normalizedTx : Transaction<TxType> = {
    hash: remove0x(tx.hash),
    value: hexToNumber(tx.value),
    _raw: tx
  }

  if (tx.blockNumber) {
    normalizedTx.blockNumber = hexToNumber(tx.blockNumber)
    normalizedTx.blockHash = remove0x(tx.blockHash)
    if (currentHeight) {
      normalizedTx.confirmations = currentHeight - normalizedTx.blockNumber + 1
    }
  }

  if (tx.gas && tx.gasPrice) {
    const gas = new BigNumber(tx.gas)
    const gasPrice = new BigNumber(tx.gasPrice)

    normalizedTx.fee = gas.times(gasPrice).toNumber()
    normalizedTx.feePrice = gasPrice.div(GWEI).toNumber()
  }

  return normalizedTx
}

function buildTransaction (txOptions: ethereum.UnsignedTransaction) : ethereum.TransactionRequest {
  const tx : ethereum.TransactionRequest = {
    from: ensure0x(txOptions.from),
    value: txOptions.value ? numberToHex(txOptions.value) : '0x0'
  }

  if (txOptions.gasPrice) tx.gasPrice = ensure0x(txOptions.gasPrice.times(GWEI).dp(0, BigNumber.ROUND_CEIL).toString(16))
  if (txOptions.to) tx.to = ensure0x(txOptions.to)
  if (txOptions.data) tx.data = ensure0x(txOptions.data)
  if (txOptions.nonce !== null && txOptions.nonce !== undefined) tx.nonce = ensure0x(txOptions.nonce.toString(16))

  return tx
}

export {
  ensure0x,
  remove0x,
  hexToNumber,
  numberToHex,
  checksumEncode,
  normalizeTransactionObject,
  ensureBlockFormat,
  buildTransaction,
  version
}
