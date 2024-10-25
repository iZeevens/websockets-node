import { WebSocket } from 'ws'
import { IauthData } from '../../types/websocket'
import { globalDataBase } from '../dataBase'

const handleAuth = (ws: WebSocket, payload: IauthData, id: number) => {
  const { name, password } = payload

  const userExist = globalDataBase.users.has(name)

  if (userExist && globalDataBase.users.get(name)?.password === password) {
    const existingUser = globalDataBase.users.get(name)

    if (existingUser?.password === password) {
      return ws.send(
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
    } else {
      return ws.send(
        JSON.stringify({
          name,
          index: existingUser?.index,
          error: true,
          errorText: 'Password isn`t correct',
        })
      )
    }
  }

  const newIndex = globalDataBase.users.size
  globalDataBase.users.set(name, { name, password, index: newIndex })

  return ws.send(
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
}

export default handleAuth
