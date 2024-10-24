interface IglobalDataBase {
  users: { name: string; password: string; index: number }[]
}

const globalDataBase: IglobalDataBase = {
  users: [],
}

export default globalDataBase
