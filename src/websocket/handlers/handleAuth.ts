import { WebSocket } from 'ws'
import findUser from '../utils/helperFindUser'
import { IauthData } from '../../types/websocket'
import { updateRoom } from './handleRoom'
import { globalDataBase } from '../dataBase'

const handleAuth = (ws: WebSocket, payload: IauthData, id: number) => {
  const { name, password } = payload
  const userExist = findUser(name)

  if (userExist) {
    if (userExist.password === password) {
      ws.send(
        JSON.stringify({
          type: 'reg',
          data: JSON.stringify({
            name,
            index: globalDataBase.users.size - 1,
            error: false,
            errorText: '',
          }),
          id,
        })
      )
      updateRoom(ws)
      return
    } else {
      return ws.send(
        JSON.stringify({
          name,
          index: userExist.index,
          error: true,
          errorText: 'Password isn`t correct',
        })
      )
    }
  }

  const newIndex = globalDataBase.users.size
  globalDataBase.users.set(ws, { name, password, index: newIndex })

  ws.send(
    JSON.stringify({
      type: 'reg',
      data: JSON.stringify({
        name,
        index: newIndex,
        error: false,
        errorText: '',
      }),
      id,
    })
  )
  updateRoom(ws)
  return
}

export default handleAuth