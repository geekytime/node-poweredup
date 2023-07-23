import { Mario, Scanner } from '../dist/node/index-node.js'

const run = async () => {
  console.log('Looking for Mario...')
  const scanner = await Scanner.create()

  const hub = await scanner.connectToHub()
  console.log(`Connected to ${hub.name}!`)

  if (hub instanceof Mario) {
    const mario = hub

    console.log(`Connected to Mario!`, mario)

    // mario.on('move', (_, data) => {
    //   console.log('move', data)
    // })

    // mario.on('gesture', (_, { gesture }) => {
    //   console.log('Gesture', gesture)
    // })

    mario.on('pants', (_, { pants }) => {
      console.log('Pants detected', pants)
    })

    mario.on('barcode', (_, { barcode, color }) => {
      if (color) {
        console.log('Color detected', color)
      } else if (barcode) {
        console.log('Barcode detected', barcode)
      }
    })

    mario.on('disconnect', () => {
      console.log('Mario disconnected')
    })
  }
}

run().then(
  () => {
    console.log("Let's a go!")
  },
  (error) => {
    console.error(error)
  }
)
