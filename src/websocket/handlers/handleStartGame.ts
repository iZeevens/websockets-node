import { globalDataBase } from '../dataBase'
import { IshipData } from '../../types/websocket'
import { sendGameWsUsers, MessageType } from '../utils/sendGameWsUsers'

const startGame = (gameId: string) => {
  const currentSession = globalDataBase.game.get(Number(gameId))

  if (!currentSession) return

  currentSession.players.forEach((player) => {
    const ships = player.ships?.map((ship) => (ship.health = ship.length))
    if (!player.ws) return

    const result = {
      type: 'start_game',
      data: JSON.stringify({
        ships,
        currentPlayerIndex: player.idPlayer,
      }),
      id: gameId,
    }

    player.ws.send(JSON.stringify(result))
    console.log(result)
  })

  sendGameWsUsers(currentSession?.players, MessageType.TURN, {
    currentPlayer: currentSession.players[0].idPlayer,
  })
}

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

  console.log(currentSession.players)

  if (currentSession.players[0].ships && currentSession.players[1].ships) {
    startGame(gameId.toString())
  }
}

export { addShips }
