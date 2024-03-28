const int buttonPin = 3; // the number of the pushbutton pin
const int ledPin =  13;  // the number of the LED pin

// Variables will change:
int lastButtonState = LOW;   // the previous state of the button
int currentButtonState;      // the current state of the button
bool ledState = false;       // state of the LED, initially off

void setup() {
  pinMode(ledPin, OUTPUT);      // initialize the LED pin as an output
  pinMode(buttonPin, INPUT);    // initialize the pushbutton pin as an input
}

void loop() {
  currentButtonState = digitalRead(buttonPin);

  // compare the button's current state to its previous state
  if (currentButtonState != lastButtonState) {
    // if the state has changed, and the current state is HIGH (button pressed)
    if (currentButtonState == HIGH) {
      ledState = !ledState; // toggle the state of the LED
      digitalWrite(ledPin, ledState ? HIGH : LOW); // set the LED according to the toggled state
    }
    // Delay a little bit to avoid bouncing
    delay(50);
  }
  
  // save the current state as the last state, 
  // for the next time through the loop
  lastButtonState = currentButtonState;
}
