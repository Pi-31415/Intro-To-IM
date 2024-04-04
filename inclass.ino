// 2. Alternate with Analog Sensor

// Define LED and potentiometer pin numbers
const int yellowLED = 3;
const int redLED = 5;
const int potPin = A0;

void setup() {
  // Initialize the LED pins as outputs
  pinMode(yellowLED, OUTPUT);
  pinMode(redLED, OUTPUT);

  // Initialize the potentiometer pin as an input
  pinMode(potPin, INPUT);
}

void loop() {
  // Read the value of the potentiometer (0 to 1023)
  int potValue = analogRead(potPin);

  // Map the potentiometer value to a delay range (e.g., 100 to 2000 milliseconds)
  int delayTime = map(potValue, 0, 1023, 100, 2000);

  // Turn the yellow LED on and the red LED off
  digitalWrite(yellowLED, HIGH);
  digitalWrite(redLED, LOW);
  delay(delayTime); // Wait for a duration based on the potentiometer value

  // Turn the yellow LED off and the red LED on
  digitalWrite(yellowLED, LOW);
  digitalWrite(redLED, HIGH);
  delay(delayTime); // Wait for the same duration
}

// -------------------------------------------------------------------
