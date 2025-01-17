import { Scanner } from '../dist/node/index-node.js'

const run = async () => {
  const scanner = await Scanner.create()

  const hub = await scanner.connectToHub()
  console.log(`Connected to ${hub.name}!`)
  const motorA = await hub.waitForDeviceByPortName('A') // Make sure a motor is plugged into port A
  const motorB = await hub.waitForDeviceByPortName('B') // Make sure a motor is plugged into port B
  console.log('Connected')

  // Repeat indefinitely
  console.log('Running motor B at speed 50')
  motorB.setPower(50) // Start a motor attached to port B to run a 3/4 speed (75) indefinitely
  console.log('Running motor A at speed 100 for 2 seconds')
  motorA.setPower(100) // Run a motor attached to port A for 2 seconds at maximum speed (100) then stop
  await hub.sleep(2000)
  motorA.brake()
  await hub.sleep(1000) // Do nothing for 1 second
  console.log('Running motor A at speed -30 for 1 second')
  motorA.setPower(-30) // Run a motor attached to port A for 2 seconds at 1/2 speed in reverse (-50) then stop
  await hub.sleep(2000)
  motorA.brake()
  await hub.sleep(1000) // Do nothing for 1 second
}

run().then(
  () => {
    console.log('Scanning for Hubs...')
  },
  (error) => {
    console.error(error)
  }
)
