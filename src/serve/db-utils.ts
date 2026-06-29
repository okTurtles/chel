import sbp from 'npm:@sbp/sbp'

// Segment length for keyop index. Changing this value will require rebuilding
// this index. The value should be a power of 10 (e.g., 10, 100, 1000, 10000)
export const KEYOP_SEGMENT_LENGTH = 10_000

export const updateSize = async (resourceID: string, sizeKey: string, size: number, skipIfDeleted?: boolean) => {
  if (!Number.isSafeInteger(size)) {
    throw new TypeError(`Invalid given size ${size} for ${resourceID}`)
  }
  // Use a queue to ensure atomic updates
  await sbp('okTurtles.eventQueue/queueEvent', sizeKey, async () => {
    // Size is stored as a decimal value
    const storedSize = await sbp('chelonia.db/get', sizeKey, { bypassCache: true })
    // In some cases, we may want to skip updating the size if the key doesn't
    // exist (for example, if we're updating the size of a child resource and
    // the parent itself has been deleted).
    if (skipIfDeleted && storedSize == null) return
    const existingSize = parseInt(storedSize ?? '0', 10)
    if (!(existingSize >= 0)) {
      throw new TypeError(`Invalid stored size ${existingSize} for ${resourceID}`)
    }
    const updatedSize = existingSize + size
    if (!(updatedSize >= 0)) {
      throw new TypeError(`Invalid stored updated size ${updatedSize} for ${resourceID}`)
    }
    await sbp('chelonia.db/set', sizeKey, updatedSize.toString(10))
  })
}

export function namespaceKey (name: string): string {
  return 'name=' + name
}

// Index management

/**
 * Creates a factory function that appends a value to a string index in a
 * database.
 * The index is identified by the provided key. The value is appended only if it
 * does not already exist in the index.
 *
 * @param key - The key that identifies the index in the database.
 * @returns A function that takes a value to append to the index.
 */
export const appendToIndexFactory = (key: string): (value: string) => Promise<void> => {
  return (value: string) => {
    // We want to ensure that the index is updated atomically (i.e., if there
    // are multiple additions, all of them should be handled), so a queue
    // is needed for the load & store operation.
    return sbp('okTurtles.eventQueue/queueEvent', key, async () => {
      // Retrieve the current index from the database using the provided key
      const currentIndex = await sbp('chelonia.db/get', key, { bypassCache: true })

      // If the current index exists, check if the value is already present
      if (currentIndex) {
        // Check for existing value to avoid duplicates
        if (
          // Check if the value is at the end
          currentIndex.endsWith('\x00' + value) ||
          // Check if the value is at the start
          currentIndex.startsWith(value + '\x00') ||
          // Check if the current index is exactly the value
          currentIndex === value ||
          // Check if the value is in the middle
          currentIndex.includes('\x00' + value + '\x00')
        ) {
          // Exit if the value already exists
          return
        }

        // Append the new value to the current index, separated by NUL
        await sbp('chelonia.db/set', key, `${currentIndex}\x00${value}`)
        return
      }

      // If the current index does not exist, set it to the new value
      await sbp('chelonia.db/set', key, value)
    })
  }
}

export const appendToNamesIndex = appendToIndexFactory('_private_names_index')

/**
 * Creates a factory function that removes a value from a string index in a
 * database.
 * The index is identified by the provided key. The function handles various
 * cases to ensure the value is correctly removed from the index.
 *
 * @param key - The key that identifies the index in the database.
 * @returns A function that takes a value to remove from the index.
 */
export const removeFromIndexFactory = (key: string): (values: string | string[]) => Promise<void> => {
  return (values: string | string[]) => {
    return sbp('okTurtles.eventQueue/queueEvent', key, async () => {
      // Retrieve the existing entries from the database using the provided key
      let existingEntries = await sbp('chelonia.db/get', key, { bypassCache: true })
      // Exit if there are no existing entries
      if (!existingEntries) return

      if (!Array.isArray(values)) {
        values = [values]
      }

      for (const value of values) {
        // Handle the case where the value is at the end of the entries
        if (existingEntries.endsWith('\x00' + value)) {
          existingEntries = existingEntries.slice(0, -value.length - 1)
          continue
        }

        // Handle the case where the value is at the start of the entries
        if (existingEntries.startsWith(value + '\x00')) {
          existingEntries = existingEntries.slice(value.length + 1)
          continue
        }

        // Handle the case where the existing entries are exactly the value
        if (existingEntries === value) {
          // There's nothing left after removing `value` from `existingEntries`
          // when `existingEntries` is equal to `value`, so set
          // `existingEntries` to undefined and end the loop.
          existingEntries = undefined
          break
        }

        // Find the index of the value in the existing entries
        const entryIndex = existingEntries.indexOf('\x00' + value + '\x00')
        if (entryIndex === -1) continue

        // Create an updated index by removing the value
        existingEntries = existingEntries.slice(0, entryIndex) + existingEntries.slice(entryIndex + value.length + 1)
      }
      // Update the index in the database or delete it if empty
      if (existingEntries) {
        await sbp('chelonia.db/set', key, existingEntries)
      } else {
        await sbp('chelonia.db/delete', key)
      }
    })
  }
}

export const lookupUltimateOwner = async (resourceID: string): Promise<string> => {
  let ownerID = resourceID
  for (let depth = 128; depth >= 0; depth--) {
    // Fetch the immediate owner.
    const newOwnerID = await sbp('chelonia.db/get', `_private_owner_${ownerID}`, { bypassCache: true })
    // Found the ultimate owner
    if (!newOwnerID) break
    if (!depth) {
      throw new Error('Exceeded max depth looking up owner for ' + resourceID)
    }
    ownerID = newOwnerID
  }
  return ownerID
}
