import { WebSocket } from 'ws'
import { globalDataBase } from '../dataBase'
import { idGame } from './handleRoom'
import { randomAttack } from './handleGame'
import { GamePlayer } from '../../types/dataBase'
import generateShips from '../utils/generateShips'

const botAttack = (
  bot: GamePlayer,
  gameId: string | number,
  indexPlayer: string | number
) => {
  if (bot.type === 'bot') {
    const payload = {
      gameId,
      indexPlayer,
    }

    randomAttack(payload)
  }
}

const botRoom = (ws: WebSocket) => {
  const idPlayer = 1

  globalDataBase.game.set(idGame.id, {
    idGame: idGame.id,
    players: [
      { ws, idPlayer, shots: new Set(), score: 0 },
      {
        ws: null,
        type: 'bot',
        idPlayer: 0,
        shots: new Set(),
        score: 0,
        ships: generateShips(),
      },
    ],
  })

  const result = {
    type: 'create_game',
    data: JSON.stringify({
      idGame: idGame.id,
      idPlayer,
    }),
    id: Date.now(),
  }
  ws.send(JSON.stringify(result))
  console.log(result)
  idGame.id++
}

export { botRoom, botAttack }
