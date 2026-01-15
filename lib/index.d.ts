export type Player = {
  id: number
  name: string
  collection: string
  team: string
  country: string
  role: string
  aim: number
  hs: number
  movement: number
  aggression: number
  acs: number
  gamesense: number
  ovr: number
  price: number
}
export declare const getPlayers: () => Player[]
export declare const getPlayer: (id: string | number) => Player | undefined
export declare const calcPlayerPrice: (player: Player, devalue?: boolean) => number
export declare const calcPlayerOvr: (player: Player) => number
