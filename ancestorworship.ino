const int ledPins[] = {44, 3, 5, 6, 9, 10, 11}; // LEDs from closest to farthest
const int numLeds = sizeof(ledPins) / sizeof(ledPins[0]); // Number of LEDs

// Define the ultrasonic sensor pins
const int trigPin = 2;  // Pin used to trigger the distance measurement
const int echoPin = 4;  // Pin used to receive the echo signal

unsigned long previousMillis = 0; // Stores last time the ultrasonic was triggered
const long interval = 10;         // Interval at which to trigger the ultrasonic sensor (milliseconds)
int lastLedIndex = -1;            // Stores the last LED index that was lit

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  // Initialize all LED pins as outputs
  for (int i = 0; i < numLeds; i++) {
    pinMode(ledPins[i], OUTPUT);
    analogWrite(ledPins[i], 0); // Initialize all LEDs to off using PWM
  }
}

void loop() {
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    int distance = measureDistance();
    controlLEDs(distance);
  }
}

int measureDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2; // Convert time to distance
  Serial.print("Distance: ");
  Serial.println(distance);
  return distance;
}

void controlLEDs(int distance) {
  // Calculate the new LED index based on the distance
  int newLedIndex;
  if (distance < 2) {
    newLedIndex = 0; // Closest LED
  } else if (distance > 12) {
    newLedIndex = numLeds - 1; // Furthest LED
  } else {
    newLedIndex = (distance - 2) * (numLeds - 1) / 10;
  }

  // Only update if there is a change in the LED to light up
  if (newLedIndex != lastLedIndex) {
    if (lastLedIndex != -1) {
      analogWrite(ledPins[lastLedIndex], 0); // Turn off the last LED using PWM
    }
    analogWrite(ledPins[newLedIndex], 255); // Light up the new LED at full brightness using PWM
    lastLedIndex = newLedIndex;
  }
}
