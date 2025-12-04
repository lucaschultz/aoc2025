import run from "aocrunner"

type Warehouse = Array<Array<string>>

function parseWarehouse(rawInput: string): Warehouse {
  return rawInput.trim().split("\n").map(line => line.split(""))
}

type WarehousePosition = readonly [row: number, col: number]

const WarehouseItem = {
  Empty: ".",
  Box: "@",
} as const

type WarehouseItem = typeof WarehouseItem[keyof typeof WarehouseItem]

function getWarehouseItem(warehouse: Warehouse, position: WarehousePosition): WarehouseItem {  
  return warehouse[position[0]]?.[position[1]] === WarehouseItem.Box ? WarehouseItem.Box : WarehouseItem.Empty
}

function addPositions(a: WarehousePosition, b: WarehousePosition): WarehousePosition {
  return [a[0] + b[0], a[1] + b[1]]
}

const Side  = {
  Top: [-1, 0],
  TopRight: [-1, +1],
  Right: [0,1],
  BottomRight: [1,1],
  Bottom: [1, 0],
  BottomLeft: [1, -1],
  Left: [0, -1],
  TopLeft: [-1, -1],
} as const

function getNeighbor(warehouse: Array<Array<string>>, position: WarehousePosition, side: keyof typeof Side): WarehouseItem {
  return getWarehouseItem(warehouse, addPositions(position, Side[side]))
}

function countBoxNeighbors(warehouse: Warehouse, position: WarehousePosition): number {
  return Object.keys(Side).reduce((count, side) => {
    return count + (getNeighbor(warehouse, position, side as keyof typeof Side) === WarehouseItem.Box ? 1 : 0)
  }, 0)
}

const part1 = (rawInput: string) => {
  return parseWarehouse(rawInput).reduce((total, row, rowIndex, warehouse) => {
    return total + row.reduce((rowTotal, item, colIndex) => {
      if (item === WarehouseItem.Box) {
        if (countBoxNeighbors(warehouse, [rowIndex, colIndex]) < 4) {
          return rowTotal + 1
        }
      }

      return rowTotal
    }, 0)
  }, 0)
}

const part2 = (rawInput: string) => {
  const input = parseWarehouse(rawInput)

  return
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
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
