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

/**
 * Returns a new warehouse with the item set at the given position
 * 
 * @remark This is **not efficient**, but it is a pure function and uses the `map` method as requested by Flo
 */
function setWarehouseItem(warehouse: Warehouse, position: WarehousePosition, item: WarehouseItem): Warehouse {
  return warehouse.map((row, rowIndex) => {
    return row.map((col, colIndex) => {
      if (rowIndex === position[0] && colIndex === position[1]) {
        return item
      }
      return col
    })
  })
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

function removeBoxes(currentWarehouse: Warehouse): number {
  // this is why using `.reduce` is considered an anti pattern by some developers...
  const { updatedWarehouse, boxesRemoved } = currentWarehouse.reduce(
    (acc, row, rowIndex) => {
      const rowResult = row.reduce(
        (rowAcc, _, colIndex) => {
          const position: WarehousePosition = [rowIndex, colIndex]
          if (getWarehouseItem(rowAcc.warehouse, position) === WarehouseItem.Box &&
            countBoxNeighbors(rowAcc.warehouse, position) < 4) {
            return {
              warehouse: setWarehouseItem(rowAcc.warehouse, position, WarehouseItem.Empty),
              count: rowAcc.count + 1,
            }
          }
          return rowAcc
        },
        { warehouse: acc.updatedWarehouse, count: 0 }
      )
      return {
        updatedWarehouse: rowResult.warehouse,
        boxesRemoved: acc.boxesRemoved + rowResult.count,
      }
    },
    { updatedWarehouse: currentWarehouse, boxesRemoved: 0 }
  )

  return boxesRemoved > 0 ? boxesRemoved + removeBoxes(updatedWarehouse) : 0
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
  return removeBoxes(parseWarehouse(rawInput))
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
