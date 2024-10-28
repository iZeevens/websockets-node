import { GamePlayer } from '../../types/dataBase'

enum MessageType {
  TURN = 'turn',
  ATTACK = 'attack',
  WIN = 'finish',
}

function sendGameWsUsers(
  players: GamePlayer[],
  type: MessageType,
  data: object
) {
  players.forEach((player) => {
    if (!player.ws) return
    const result = {
      type,
      data: JSON.stringify(data),
      id: Date.now(),
    }

    player.ws.send(JSON.stringify(result))

    console.log(result)
  })
}

export { sendGameWsUsers, MessageType }
