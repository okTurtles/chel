// What the dashboard shows, read from the server's database and from the
// contract info Chelonia keeps in memory. Only names, types, counts and sizes:
// the contracts' data is encrypted, and nothing here tries to read it.
import sbp from 'npm:@sbp/sbp'
import { namespaceKey } from './db-utils.ts'

export type DashboardContract = {
  contractID: string
  type: string | null
  // Its messages plus its key-value data, in bytes
  size: number
  messages: number
  // The username registered to it, for an account's own contract
  name: string | null
  // The account or contract that owns it, if any
  owner: string | null
  ownerName: string | null
}

export type DashboardUser = {
  username: string
  // A deleted account's name stays taken, but there is nothing left to count
  deleted: boolean
  contractID: string | null
  ownedContracts: number | null
  ownedFiles: number | null
  // The account's own contract and everything it owns, in bytes
  size: number | null
  // A BigInt, so it stays a string
  picocredits: string | null
}

export type DashboardOverview = {
  users: number
  deletedUsers: number
  contracts: number
  storage: { total: number, contracts: number, files: number }
  freeAllowance: number
  // Names are indexed in the order they were registered
  newestUsers: { username: string, size: number | null }[]
}

type ContractInfo = { type: string, HEAD: string, height: number }

const readIndex = async (key: string): Promise<string[]> => {
  const value = await sbp('chelonia.db/get', key)
  return value ? (value as string).split('\x00') : []
}

const readNumber = async (key: string): Promise<number> =>
  Number(await sbp('chelonia.db/get', key)) || 0

const contractInfos = (): Record<string, ContractInfo> =>
  sbp('chelonia/rootState').contracts ?? {}

export async function listContracts (): Promise<DashboardContract[]> {
  const infos = contractInfos()
  const names = new Map<string, Promise<string | null>>()
  const nameOf = (contractID: string) => {
    if (!names.has(contractID)) {
      names.set(contractID, sbp('chelonia.db/get', `_private_cid2name_${contractID}`)
        .then((name: string | undefined) => name ?? null))
    }
    return names.get(contractID)!
  }
  const contractIDs = await readIndex('_private_cheloniaState_index')
  return Promise.all(contractIDs.map(async (contractID) => {
    const info = infos[contractID]
    const owner: string | null = await sbp('chelonia.db/get', `_private_owner_${contractID}`) ?? null
    return {
      contractID,
      type: info?.type ?? null,
      size: await readNumber(`_private_size_${contractID}`),
      // Heights start at 0
      messages: info ? info.height + 1 : 0,
      name: await nameOf(contractID),
      owner,
      ownerName: owner ? await nameOf(owner) : null
    }
  }))
}

export async function listUsers (): Promise<DashboardUser[]> {
  const infos = contractInfos()
  const [usernames, orphaned] = await Promise.all([
    readIndex('_private_names_index'),
    readIndex('_private_orphaned_names_index')
  ])
  const deleted = new Set(orphaned)
  return Promise.all(usernames.map(async (username): Promise<DashboardUser> => {
    if (deleted.has(username)) {
      return {
        username,
        deleted: true,
        contractID: null,
        ownedContracts: null,
        ownedFiles: null,
        size: null,
        picocredits: null
      }
    }
    const contractID: string = await sbp('chelonia.db/get', namespaceKey(username))
    const owned = await readIndex(`_private_resources_${contractID}`)
    const ownedContracts = owned.filter((id) => id in infos).length
    return {
      username,
      deleted: false,
      contractID,
      ownedContracts,
      ownedFiles: owned.length - ownedContracts,
      size: await readNumber(`_private_ownerTotalSize_${contractID}`),
      // No balance yet means nothing was charged or credited yet
      picocredits: await sbp('chelonia.db/get', `_private_ownerPicocreditBalance_${contractID}`) ?? '0'
    }
  }))
}

export async function overview (): Promise<DashboardOverview> {
  const [contracts, users, billable] = await Promise.all([
    listContracts(),
    listUsers(),
    readIndex('_private_billable_entities')
  ])
  // Every contract is billed to one of these, so their totals cover everything
  const sizes = await Promise.all(billable.map((id) => readNumber(`_private_ownerTotalSize_${id}`)))
  const total = sizes.reduce((sum, size) => sum + size, 0)
  const contractsSize = contracts.reduce((sum, contract) => sum + contract.size, 0)
  const live = users.filter((user) => !user.deleted)
  return {
    users: live.length,
    deletedUsers: users.length - live.length,
    contracts: contracts.length,
    storage: {
      total,
      contracts: contractsSize,
      // Owner totals can lag a little behind, so never below 0
      files: Math.max(0, total - contractsSize)
    },
    freeAllowance: await readNumber('_private_freeAllowanceBytes'),
    newestUsers: live.slice(-5).reverse().map(({ username, size }) => ({ username, size }))
  }
}

// The manifest the contract's latest message was written with
export async function contractManifest (contractID: string): Promise<{ manifestCID: string, manifest: unknown } | null> {
  const info = contractInfos()[contractID]
  if (!info) return null
  const message = await sbp('chelonia.db/get', info.HEAD)
  if (!message) return null
  const manifestCID = JSON.parse(JSON.parse(message).head).manifest
  const manifest = await sbp('chelonia.db/get', manifestCID)
  return manifest ? { manifestCID, manifest: JSON.parse(manifest) } : null
}
