import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const getPlayers = () => {
  const lines = fs.readFileSync(path.join(__dirname, 'players.csv')).toString().split('\n')
  const headers = lines.shift().split(',').map(h => h.trim())
  const data = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim()
    if (!line) continue

    const obj = {}
    const values = lines[i].split(',')

    for (let i = 0; i < values.length; i++) {
      let value = values[i]

      if (!Number.isNaN(Number(value))) {
        value = Number(values[i])
      }

      obj[headers[i]] = value
    }

    obj.ovr = calcPlayerOvr(obj)
    obj.price = calcPlayerPrice(obj)

    data.push(obj)
  }

  return data
}

export const getPlayer = id => {
  return getPlayers().find(player => player.id === Number(id))
}

export const calcPlayerPrice = (player, devalue) => {
  const overall = calcPlayerOvr(player)

  let price = Math.pow(1.06, overall) * 10000

  if (devalue) price *= 0.1

  return Math.floor(price)
}

export const calcPlayerOvr = player => {
  const weights = {
    duelist: {
      aim: 0.25,
      hs: 0.2,
      movement: 0.2,
      aggression: 0.2,
      acs: 0.1,
      gamesense: 0.05
    },
    controller: {
      aim: 0.1,
      hs: 0.1,
      movement: 0.15,
      aggression: 0.1,
      acs: 0.25,
      gamesense: 0.3
    },
    sentinel: {
      aim: 0.15,
      hs: 0.25,
      movement: 0.2,
      aggression: 0.1,
      acs: 0.15,
      gamesense: 0.15
    },
    initiator: {
      aim: 0.2,
      hs: 0.15,
      movement: 0.2,
      aggression: 0.15,
      acs: 0.2,
      gamesense: 0.1
    },
    flex: {
      aim: 0.17,
      hs: 0.17,
      movement: 0.19,
      aggression: 0.14,
      acs: 0.17,
      gamesense: 0.16
    }
  }

  const roleWeights = weights[player.role] ?? {
    aim: 1 / 6,
    HS: 1 / 6,
    movement: 1 / 6,
    aggression: 1 / 6,
    ACS: 1 / 6,
    gamesense: 1 / 6
  }

  const stats = {
    aim: player.aim || 0,
    hs: player.hs || 0,
    movement: player.movement || 0,
    aggression: player.aggression || 0,
    acs: player.acs || 0,
    gamesense: player.gamesense || 0
  }

  let overall = 0
  
  for (const statName in stats) {
    overall += stats[statName] * roleWeights[statName]
  }

  return overall
}
