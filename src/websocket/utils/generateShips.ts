import { ShipData } from '../../types/dataBase'

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * 9),
    y: Math.floor(Math.random() * 9),
  }
}

function getRandomDirection() {
  return Math.random() < 0.5
}

function getShipCoordinates(ship: ShipData) {
  const coordinates = []
  for (let i = 0; i < ship.length; i++) {
    const x = ship.direction ? ship.position.x + i : ship.position.x
    const y = ship.direction ? ship.position.y : ship.position.y + i
    coordinates.push({ x, y })
  }
  return coordinates
}

function getSurroundingCoordinates(shipCoords: { x: number; y: number }[]) {
  const surrounding = new Set<string>()
  for (const { x, y } of shipCoords) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const newX = x + dx
        const newY = y + dy
        if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10) {
          surrounding.add(`${newX},${newY}`)
        }
      }
    }
  }
  return surrounding
}

function isColliding(
  newShip: ShipData,
  occupiedPositions: Set<string>
): boolean {
  const newShipCoords = getShipCoordinates(newShip)
  const surroundingCoords = getSurroundingCoordinates(newShipCoords)

  for (const coord of surroundingCoords) {
    if (occupiedPositions.has(coord)) {
      return true
    }
  }
  return false
}

function generateShips() {
  const shipTypes = [
    { type: 'huge', length: 4, count: 1 },
    { type: 'large', length: 3, count: 2 },
    { type: 'medium', length: 2, count: 3 },
    { type: 'small', length: 1, count: 4 },
  ]

  const ships: ShipData[] = []
  const occupiedPositions = new Set<string>()

  shipTypes.forEach(({ type, length, count }) => {
    for (let i = 0; i < count; i++) {
      let newShip
      let isValidPosition = false

      do {
        newShip = {
          position: getRandomPosition(),
          direction: getRandomDirection(),
          type,
          length,
          health: length,
        }
        isValidPosition = !isColliding(newShip, occupiedPositions)
      } while (!isValidPosition)

      for (const { x, y } of getShipCoordinates(newShip)) {
        occupiedPositions.add(`${x},${y}`)
      }

      ships.push(newShip)
    }
  })

  return ships
}

export default generateShips
