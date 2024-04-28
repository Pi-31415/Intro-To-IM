/* Week 11.2 bidi serial example
 * Originally by Aaron Sherwood
 * Modified by Mangtronix
 *
 * Add this library to Sketch files
 *  https://github.com/mangtronix/IntroductionToInteractiveMedia/blob/master/code/p5.web-serial.js files
 *
 * You must include this line in your index.html (in Sketch Files) to load the
 * web-serial library
 *
 *     <script src="p5.web-serial.js"></script>
 *
 * Arduino code:
 * https://github.com/mangtronix/IntroductionToInteractiveMedia/blob/master/code/Week11Serial.ino
 */

let rVal = 0;
let alpha = 255;
let left = 0; // True (1) if mouse is being clicked on left side of screen
let right = 0; // True (1) if mouse is being clicked on right side of screen

function setup() {
  createCanvas(640, 480);
  textSize(18);
}

function draw() {
  // one value from Arduino controls the background's red color
  background(map(rVal, 0, 1023, 0, 255), 255, 255);

  // the other value controls the text's transparency value
  fill(255, 0, 255, map(alpha, 0, 1023, 0, 255));

  if (!serialActive) {
    text("Press Space Bar to select Serial Port", 20, 30);
  } else {
    text("Connected", 20, 30);
    

    // Print the current values
    text('rVal = ' + str(rVal), 20, 50);
    text('alpha = ' + str(alpha), 20, 70);

  }


  // click on one side of the screen, one LED will light up
  // click on the other side, the other LED will light up
  if (mouseIsPressed) {
    if (mouseX <= width / 2) {
      left = 1;
    } else {
      right = 1;
    }
  } else {
    left = right = 0;
  }
}

function keyPressed() {
  if (key == " ") {
    // important to have in order to start the serial connection!!
    setUpSerial();
  }
}

// This function will be called by the web-serial library
// with each new *line* of data. The serial library reads
// the data until the newline and then gives it to us through
// this callback function
function readSerial(data) {
  ////////////////////////////////////
  //READ FROM ARDUINO HERE
  ////////////////////////////////////

  if (data != null) {
    // make sure there is actually a message
    // split the message
    let fromArduino = split(trim(data), ",");
    // if the right length, then proceed
    if (fromArduino.length == 2) {
      // only store values here
      // do everything with those values in the main draw loop
      
      // We take the string we get from Arduino and explicitly
      // convert it to a number by using int()
      // e.g. "103" becomes 103
      rVal = int(fromArduino[0]);
      alpha = int(fromArduino[1]);
    }

    //////////////////////////////////
    //SEND TO ARDUINO HERE (handshake)
    //////////////////////////////////
    let sendToArduino = left + "," + right + "\n";
    writeSerial(sendToArduino);
  }
}

//Arduino Code
/*
// Week 11.2 Example of bidirectional serial communication

// Inputs:
// - A0 - sensor connected as voltage divider (e.g. potentiometer or light sensor)
// - A1 - sensor connected as voltage divider 
//
// Outputs:
// - 2 - LED
// - 5 - LED

int leftLedPin = 2;
int rightLedPin = 5;

void setup() {
  // Start serial communication so we can send data
  // over the USB connection to our p5js sketch
  Serial.begin(9600);

  // We'll use the builtin LED as a status output.
  // We can't use the serial monitor since the serial connection is
  // used to communicate to p5js and only one application on the computer
  // can use a serial port at once.
  pinMode(LED_BUILTIN, OUTPUT);

  // Outputs on these pins
  pinMode(leftLedPin, OUTPUT);
  pinMode(rightLedPin, OUTPUT);

  // Blink them so we can check the wiring
  digitalWrite(leftLedPin, HIGH);
  digitalWrite(rightLedPin, HIGH);
  delay(200);
  digitalWrite(leftLedPin, LOW);
  digitalWrite(rightLedPin, LOW);



  // start the handshake
  while (Serial.available() <= 0) {
    digitalWrite(LED_BUILTIN, HIGH); // on/blink while waiting for serial data
    Serial.println("0,0"); // send a starting message
    delay(300);            // wait 1/3 second
    digitalWrite(LED_BUILTIN, LOW);
    delay(50);
  }
}

void loop() {
  // wait for data from p5 before doing something
  while (Serial.available()) {
    digitalWrite(LED_BUILTIN, HIGH); // led on while receiving data

    int left = Serial.parseInt();
    int right = Serial.parseInt();
    if (Serial.read() == '\n') {
      digitalWrite(leftLedPin, left);
      digitalWrite(rightLedPin, right);
      int sensor = analogRead(A0);
      delay(5);
      int sensor2 = analogRead(A1);
      delay(5);
      Serial.print(sensor);
      Serial.print(',');
      Serial.println(sensor2);
    }
  }
  digitalWrite(LED_BUILTIN, LOW);
}
*/
