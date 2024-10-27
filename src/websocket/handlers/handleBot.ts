import { WebSocket } from 'ws'
import { globalDataBase } from '../dataBase'
import { idGame } from './handleRoom'

const botRoom = (ws: WebSocket) => {
  const idPlayer = 0

  globalDataBase.game.set(idGame.id, {
    idGame: idGame.id,
    players: [
      { ws, idPlayer, shots: new Set(), score: 0 },
      { ws: null, idPlayer: 0, shots: new Set(), score: 0 },
    ],
  })

  ws.send(
    JSON.stringify({
      type: 'create_game',
      data: JSON.stringify({
        idGame: idGame.id,
        idPlayer,
      }),
      id: Date.now(),
    })
  )

  idGame.id++
}

export { botRoom }
