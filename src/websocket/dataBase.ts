let currentUser: string

const globalDataBase = {
  users: new Map<string, { name: string; password: string; index: number }>(),
  room: new Map<
    string,
    {
      roomId: number | string
      roomUsers: [{ name: string; index: number | string }]
    }
  >(),
}

export { globalDataBase, currentUser }
