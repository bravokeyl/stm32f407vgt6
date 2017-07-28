const fs = require('fs');
const path = require('path');
const readline = require('readline');

const output = fs.createWriteStream("s.csv");

const filename = '../lib/stm32f407vgt6.csv';
const arr = {
  L: [],
  D: [],
  R: [],
  U: [],
};
const rl = readline.createInterface({
  input: fs.createReadStream(filename),
});

const pinLength = 200;
const pinSpace = 100;
const gutter = 400;

const leftSidePins = 25;
const bottomSidePins = 25;
const rightSidePins = 25;
const topSidePins = 25;

const posx = 0;
const posy = 0;
// S startx starty endx endy unit convert thickness cc
// S 0 0 3200 3200 0 1 0 f
// const rect = 0;
let posdx = posx+gutter-pinSpace;
let posdy = posy-pinLength;
let poslx = posx-pinLength;
let posly = posy+leftSidePins*pinSpace+gutter;
let posrx = posx+bottomSidePins*pinSpace+2*gutter+pinSpace;
let posry = gutter-pinSpace;
let posux = posx+topSidePins*pinSpace+gutter;
let posuy = posy+topSidePins*pinSpace+2*gutter+pinSpace;

//X name number posx posy length orientation Snum Snom unit convert Etype[shape]
const drawPin = ( name, no, posx, posy, len, orien, size, unit, convert, type ) => {
  let out = "X "+name+" "+no+" "+posx+" "+posy+" "+len+" "+orien+" "+size+" "+size+" "+unit+" "+convert+" "+type;
  output.write(out);
  output.write("\r\n");
}

rl.on('line',function(data){
  let d = data.split(',');
  let name = d[1];
  let number = d[0];
  let orientation = d[2];

  if(orientation == "L") {
    arr["L"].push(d[0]);
    orientation = "R";
    posly -= pinSpace;
    drawPin( name, number, poslx, posly, pinLength, orientation, 50, 1, 1, "I" );
    return;
  }
  if(orientation == "R") {
    arr["R"].push(d[0]);
    orientation = "L";
    posry += pinSpace;
    drawPin( name, number, posrx, posry, pinLength, orientation, 50, 1, 1, "I" );
    return;
  }
  if(orientation == "U") {
    arr["U"].push(d[0]);
    orientation = "D";
    posux -= pinSpace;
    drawPin( name, number, posux, posuy, pinLength, orientation, 50, 1, 1, "I" );
    return;
  }
  if(orientation == "D") {
    arr["D"].push(d[0]);
    orientation = "U";
    posdx += pinSpace;
    // posdy =
    drawPin( name, number, posdx, posdy, pinLength, orientation, 50, 1, 1, "I" );
    return;
  }

})
rl.on('close',function(data){
  console.log("Ended");
  // console.log(arr);
})
