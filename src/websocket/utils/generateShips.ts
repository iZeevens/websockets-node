import { ShipData } from '../../types/dataBase'

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * 10),
    y: Math.floor(Math.random() * 10),
  }
}

function getRandomDirection() {
  return Math.random() < 0.5
}

function generateShips() {
  const shipTypes = [
    { type: 'huge', length: 4, count: 1 },
    { type: 'large', length: 3, count: 2 },
    { type: 'medium', length: 2, count: 3 },
    { type: 'small', length: 1, count: 4 },
  ]

  const ships: ShipData[] = []

  shipTypes.forEach(({ type, length, count }) => {
    for (let i = 0; i < count; i++) {
      ships.push({
        position: getRandomPosition(),
        direction: getRandomDirection(),
        type,
        length,
        health: length,
      })
    }
  })

  return ships
}

export default generateShips
