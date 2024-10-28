import { GamePlayer } from '../../types/dataBase'
import { MessageType } from '../utils/sendGameWsUsers'
import { sendGameWsUsers } from '../utils/sendGameWsUsers'

const scoreMap: { [key: string]: number } = {
  small: 1,
  medium: 2,
  huge: 3,
  large: 4,
}

const winPlayer = (
  typeShip: string,
  currentPlayer: GamePlayer,
  players: GamePlayer[]
) => {
  const score = scoreMap[typeShip]
  if (currentPlayer && score) {
    currentPlayer.score += score

    if (currentPlayer.score >= 21) {
      sendGameWsUsers(players, MessageType.WIN, {
        winPlayer: currentPlayer.idPlayer,
      })
    }
  }
}

export default winPlayer
