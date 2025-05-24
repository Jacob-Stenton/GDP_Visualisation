#include <NewPing.h>

#define trigPin 5
#define echoPin 6
#define LEDPIN 13

#define maxDistance 400

#define DELIMITER ","

NewPing sonar(trigPin, echoPin, maxDistance);

int counter = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  delay(700);
  pinMode(LEDPIN, OUTPUT);
}

void loop() {

  Serial.print(sonar.ping_cm());
  Serial.print(DELIMITER);
  delay(500);


  // Print new line at after all values output
  if (counter == 19) {
    Serial.println();
    Serial.println("stop");
    counter = 0;
  } else {
    counter++;
    delay(500);
  }
}
