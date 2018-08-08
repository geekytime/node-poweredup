const PoweredUP = require("..");
const poweredUP = new PoweredUP.PoweredUP();

const trains = [
    {
        name: "Maersk Intermodal",
        color: PoweredUP.Consts.Colors.LIGHT_BLUE,
        hubs: [
            {
                name: "NK_Maersk",
                ports: ["A"]
            }
        ]
    },
    {
        name: "Horizon Express",
        color: PoweredUP.Consts.Colors.ORANGE,
        hubs: [
            {
                name: "NK_Horizon_1",
                ports: ["A"],
                lights: ["B"]
            },
            {
                name: "NK_Horizon_2",
                ports: ["A"],
                reverse: ["A"]
            }
        ]
    },
    {
        name: "Emerald Night",
        color: PoweredUP.Consts.Colors.GREEN,
        hubs: [
            {
                name: "NK_Emerald",
                ports: ["A"],
                lights: ["B"]
            }
        ]
    },
    {
        name: "Metroliner",
        color: PoweredUP.Consts.Colors.WHITE,
        hubs: [
            {
                name: "NK_Metroliner",
                ports: ["A"],
                lights: ["B"]
            }
        ]
    }
];


poweredUP.on("discover", async (hub) => {

    if (hub instanceof PoweredUP.PUPRemote) {
        await hub.connect();
        hub._currentTrain = 0;
        hub.on("button", (button, state) => {

            if (button === "GREEN") {
                if (state === PoweredUP.Consts.ButtonStates.PRESSED) {
                    hub._currentTrain++;
                    if (hub._currentTrain >= trains.length) {
                        hub._currentTrain = 0;
                    }
                    hub.setLEDColor(trains[hub._currentTrain].color);
                    console.log(`Switched active train on remote ${hub.name} to ${trains[hub._currentTrain].name}`);
                }
                break;
            } else if (button === "LEFT" || button === "RIGHT") {
                trains[hub._currentTrain]._speed = trains[hub._currentTrain]._speed || 0;
                if (state === PoweredUP.Consts.ButtonStates.UP) {
                    trains[hub._currentTrain]._speed += 10;
                    if (trains[hub._currentTrain]._speed > 100) {
                        trains[hub._currentTrain]._speed = 100;
                    }
                } else if (state === PoweredUP.Consts.ButtonStates.DOWN) {
                    trains[hub._currentTrain]._speed -= 10;
                    if (trains[hub._currentTrain]._speed < 0) {
                        trains[hub._currentTrain]._speed = 0;
                    }
                } else if (state === PoweredUP.Consts.ButtonStates.STOP) {
                    trains[hub._currentTrain]._speed = 0;
                }
                for (let trainHub in trains[hub._currentTrain].hubs) {
                    if (trainHub._hub) {
                        for (let port in trainHub.ports) {
                            trainHub.reverse = trainHub.reverse || [];
                            trainHub._hub.setMotorSpeed(port, trainHub.reverse.indexOf(port) >= 0 ? -trains[hub._currentTrain].speed : trains[hub._currentTrain].speed);
                        }
                    }
                }
                console.log(`Set ${trains[hub._currentTrain].name} speed to ${trains[hub._currentTrain]._speed}`);
            }

        });
        hub.setLEDColor(trains[hub._currentTrain].color);
        console.log(`Connected to Powered UP remote (${hub.name})`);
        return;
    }

    for (let train in trains) {
        for (let trainHub in train.hubs) {
            if (hub.name === trainHub.name) {
                await hub.connect();
                trainHub._hub = hub;
                hub.setLEDColor(train.color);
                console.log(`Connected to ${train.name} (${hub.name})`);
                hub.on("disconnect", () => {
                    console.log(`Disconnected from ${train.name} (${hub.name})`);
                    delete trainHub._hub;
                })
            }
        }
    }

});


poweredUP.scan(); // Start scanning for trains
console.log("Looking for trains...");