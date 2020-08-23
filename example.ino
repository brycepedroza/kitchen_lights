#include <ESP8266WebServer.h>
#include <FastLED.h>


//------------------------------------------------
// Constants
//------------------------------------------------
const char* ssid = "";
const char* password = "";

IPAddress ip(192,168,0,90);
IPAddress gateway(192,168,0,1);
IPAddress subnet(255,255,255,0);
IPAddress dns(8, 8, 8, 8);  //DNS


#define LED_COUNT 215
#define LED_DT 2

uint8_t bright = 25;
uint8_t ledMode = 0;

uint8_t flag = 1;

CRGBArray<LED_COUNT> leds;

uint8_t delayValue = 20;
uint8_t stepValue = 10;
uint8_t hueValue = 0;

ESP8266WebServer server(80);


//------------------------------------------------
//API Calls
//------------------------------------------------
void lightsOn() {
  // default colors
  uint8_t r = 255;
  uint8_t g = 255;
  uint8_t b = 255;

  // arg colors
  if (server.arg("r")!= ""){     //Parameter not found
    r = atoi(server.arg("r").c_str());
  }
  if (server.arg("g")!= ""){     //Parameter not found
    g = atoi(server.arg("g").c_str());
  }
  if (server.arg("b")!= ""){     //Parameter not found
    b = atoi(server.arg("b").c_str());
  }

  String message = "Lights on: r: " + server.arg("r") + " g: " + server.arg("g") + " b: " + server.arg("b");

  for(int x = 0; x < LED_COUNT; x++){
    leds[x].setRGB(r,g,b);
  }
  LEDS.show();
  server.send(200, "text/html", message); //Send ADC value only to client ajax request
}

void lightsOff() {
  uint8_t r = 0;
  uint8_t g = 0;
  uint8_t b = 0;
  for(int x = 0; x < LED_COUNT; x++){
    leds[x].setRGB(b,r,g);
  }
  LEDS.show();
  server.send(200, "text/html", "lights off"); //Send ADC value only to client ajax request
}


//------------------------------------------------
//Setup
//------------------------------------------------
void setup(){
  Serial.begin(115200);
  LEDS.setBrightness(bright);

  LEDS.addLeds<WS2811, LED_DT, GRB>(leds, LED_COUNT);

  LEDS.show();

  WiFi.config(ip, gateway, subnet, dns);
  WiFi.begin(ssid, password);
  Serial.println("");

  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/lightsOn", lightsOn);
  server.on("/lightsOff", lightsOff);

  server.begin();
}

//------------------------------------------------
//Loop
//------------------------------------------------
void loop(void){
  server.handleClient();          //Handle client requests
}
