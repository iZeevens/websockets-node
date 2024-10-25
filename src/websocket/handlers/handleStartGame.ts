import { globalDataBase } from '../dataBase'
import { IshipData } from '../../types/websocket'

// const startGame = () => {

// }

const addShips = (payload: IshipData) => {
  const { gameId, indexPlayer, ships } = payload

  const currentSession = globalDataBase.game.get(Number(gameId))
  if (!currentSession) return

  const playerIndex = currentSession.players.findIndex(
    (player) => player.idPlayer === indexPlayer
  )

  if (playerIndex !== -1) {
    currentSession.players[playerIndex].ships = [
      ...(currentSession.players[playerIndex].ships || []),
      ...ships,
    ]
  }
}

export { addShips }
