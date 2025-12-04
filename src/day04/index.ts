import run from "aocrunner"

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
    if (rollCount === 4) {
      return false
    }
  }

  // TopRight
  if (isRoll(warehouse, row - 1, col + 1)) {
    rollCount++
    if (rollCount === 4) {
      return false
    }
  }

  // Right
  if (isRoll(warehouse, row, col + 1)) {
    rollCount++
    if (rollCount === 4) {
      return false
    }
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

function countRemovableRolls(warehouse: Warehouse): number {
  const rowLength = warehouse.length
  const colLength = warehouse[0]!.length // Assumes all rows have the same length and the warehouse is not empty

  let removableRolls = 0
  for (let row = 0; row < rowLength; row++) {
    for (let col = 0; col < colLength; col++) {
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

const part2 = (rawInput: string) => {
  return 0
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
