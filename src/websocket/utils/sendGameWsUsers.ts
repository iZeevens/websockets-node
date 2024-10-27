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
    player.ws.send(
      JSON.stringify({
        type,
        data: JSON.stringify(data),
        id: Date.now(),
      })
    )
  })
}

export { sendGameWsUsers, MessageType }
