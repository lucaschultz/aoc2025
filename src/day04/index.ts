import run from "aocrunner"
import { get } from "http"

type Warehouse = Array<Array<string>>

function parseWarehouse(rawInput: string): Warehouse {
  return rawInput.split("\n").map((line) => line.split(""))
}

function isRoll(warehouse: Warehouse, row: number, col: number): boolean {
  // In my limited testing this was faster than optional chaining
  return (
    row >= 0 &&
    row < warehouse.length &&
    col >= 0 &&
    col < warehouse[row]!.length &&
    warehouse[row]![col] === "@"
  )
}

function isAccessible(warehouse: Warehouse, row: number, col: number): boolean {
  let rollCount = 0

  // Top
  if (isRoll(warehouse, row - 1, col)) {
    rollCount++
  }

  // TopRight
  if (isRoll(warehouse, row - 1, col + 1)) {
    rollCount++
  }

  // Right
  if (isRoll(warehouse, row, col + 1)) {
    rollCount++
  }

  // BottomRight
  if (isRoll(warehouse, row + 1, col + 1)) {
    rollCount++
    if (rollCount === 4) {
      return false
    }
  }

  // Bottom
  if (isRoll(warehouse, row + 1, col)) {
    rollCount++
    if (rollCount === 4) {
      return false
    }
  }

  // BottomLeft
  if (isRoll(warehouse, row + 1, col - 1)) {
    rollCount++
    if (rollCount === 4) {
      return false
    }
  }

  // Left
  if (isRoll(warehouse, row, col - 1)) {
    rollCount++
    if (rollCount === 4) {
      return false
    }
  }

  // TopLeft
  if (isRoll(warehouse, row - 1, col - 1)) {
    rollCount++
    if (rollCount === 4) {
      return false
    }
  }

  return true
}

type WarehouseSize = {
  rows: number
  cols: number
}

function getWarehouseSize(warehouse: Warehouse): WarehouseSize {
  return {
    rows: warehouse.length,
    cols: warehouse[0]!.length, // Assumes all rows have the same length and the warehouse is not empty
  }
}

function countRemovableRolls(warehouse: Warehouse): number {
  const size = getWarehouseSize(warehouse)

  let removableRolls = 0
  for (let row = 0; row < size.rows; row++) {
    for (let col = 0; col < size.cols; col++) {
      if (isRoll(warehouse, row, col) && isAccessible(warehouse, row, col)) {
        removableRolls++
      }
    }
  }

  return removableRolls
}

const part1 = (rawInput: string) => {
  const warehouse = parseWarehouse(rawInput)
  return countRemovableRolls(warehouse)
}

type WarehouseKey = `${number}:${number}`

function findRemovableRolls(warehouse: Warehouse, size: WarehouseSize, addTo: Set<WarehouseKey>):void {
  const removableRolls = addTo ?? new Set<WarehouseKey>()

  for (let row = 0; row < size.rows; row++) {
    for (let col = 0; col < size.cols; col++) {
      if (isRoll(warehouse, row, col) && isAccessible(warehouse, row, col)) {
        removableRolls.add(`${row}:${col}`)
      }
    }
  }
}

function removeRolls(warehouse: Warehouse, toRemove: Set<WarehouseKey>): number {
  let removed: number = 0
  for (const key of toRemove) {
    const [row, col] = key.split(':').map(Number)

    if (row === undefined || col === undefined){
      throw new Error(`Invalid warehouse key, expected format "row:col" with numeric values (was "${key}")`)
    }

    warehouse[row]![col] = '.'
    removed++
  }

  return removed
}

function findRemovableNeighbors(warehouse: Warehouse, removableRolls: Set<WarehouseKey>, addTo: Set<WarehouseKey>):void {
  for (const key of removableRolls) {
    const [row, col] = key.split(':').map(Number)

    if (row === undefined || col === undefined){
      throw new Error(`Invalid warehouse key, expected format "row:col" with numeric values (was "${key}")`)
    }

    const topNeighborKey: WarehouseKey = `${row - 1}:${col}`
    if (!addTo.has(topNeighborKey) && isRoll(warehouse, row - 1, col) && isAccessible(warehouse, row - 1, col)) {
      addTo.add(topNeighborKey)
    }

    const topRightNeighborKey: WarehouseKey = `${row - 1}:${col + 1}`
    if (!addTo.has(topRightNeighborKey) && isRoll(warehouse, row - 1, col + 1) && isAccessible(warehouse, row - 1, col + 1)) {
      addTo.add(topRightNeighborKey)
    }

    const rightNeighborKey: WarehouseKey = `${row}:${col + 1}`
    if (!addTo.has(rightNeighborKey) && isRoll(warehouse, row, col + 1) && isAccessible(warehouse, row, col + 1)) {
      addTo.add(rightNeighborKey)
    }

    const bottomRightNeighborKey: WarehouseKey = `${row + 1}:${col + 1}`
    if (!addTo.has(bottomRightNeighborKey) && isRoll(warehouse, row + 1, col + 1) && isAccessible(warehouse, row + 1, col + 1)) {
      addTo.add(bottomRightNeighborKey)
    }

    const bottomNeighborKey: WarehouseKey = `${row + 1}:${col}`
    if (!addTo.has(bottomNeighborKey) && isRoll(warehouse, row + 1, col) && isAccessible(warehouse, row + 1, col)) {
      addTo.add(bottomNeighborKey)
    }

    const bottomLeftNeighborKey: WarehouseKey = `${row + 1}:${col - 1}`
    if (!addTo.has(bottomLeftNeighborKey) && isRoll(warehouse, row + 1, col - 1) && isAccessible(warehouse, row + 1, col - 1)) {
      addTo.add(bottomLeftNeighborKey)
    }

    const leftNeighborKey: WarehouseKey = `${row}:${col - 1}`
    if (!addTo.has(leftNeighborKey) && isRoll(warehouse, row, col - 1) && isAccessible(warehouse, row, col - 1)) {
      addTo.add(leftNeighborKey)
    }

    const topLeftNeighborKey: WarehouseKey = `${row - 1}:${col - 1}`
    if (!addTo.has(topLeftNeighborKey) && isRoll(warehouse, row - 1, col - 1) && isAccessible(warehouse, row - 1, col - 1)) {
      addTo.add(topLeftNeighborKey)
    }
  }
}

const part2 = (rawInput: string) => {
  const warehouse = parseWarehouse(rawInput)
  const size = getWarehouseSize(warehouse)

  let totalRemoved = 0

  let toRemove = new Set<WarehouseKey>()

  findRemovableRolls(warehouse, size, toRemove)

  while (toRemove.size > 0) {
    totalRemoved += removeRolls(warehouse, toRemove)

    const nextToRemove = new Set<WarehouseKey>()
    findRemovableNeighbors(warehouse, toRemove, nextToRemove)

    toRemove = nextToRemove
  }

  return totalRemoved
}

run({
  part1: {
    tests: [
      {
        input: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
        expected: 43,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
