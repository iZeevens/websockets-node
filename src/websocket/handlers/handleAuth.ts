import { WebSocket } from 'ws'
import { authData } from '../../types/websocket'
import globalDataBase from '../dataBase'

const auth = (ws: WebSocket, payload: authData, id: number) => {
  const { name, password } = payload

  const userIndex = globalDataBase.users.findIndex((user) => user.name === name)

  if (userIndex !== -1) {
    return ws.send(
      JSON.stringify({
        name,
        index: userIndex,
        error: true,
        errorText: 'User already exist',
      })
    )
  }

  globalDataBase.users.push({
    name,
    password,
    index: globalDataBase.users.length,
  })

  return ws.send(
    JSON.stringify({
      type: 'reg',
      data: JSON.stringify({
        name,
        index: globalDataBase.users.length - 1,
        error: false,
        errorText: '',
      }),
      id,
    })
  )
}

export default auth
