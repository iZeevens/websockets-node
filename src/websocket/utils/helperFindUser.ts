import { globalDataBase } from '../dataBase'

function findUser(name: string) {
  for (const [, data] of globalDataBase.users) {
    if (name === data.name) {
      return data
    }
  }

  return false
}

export default findUser
