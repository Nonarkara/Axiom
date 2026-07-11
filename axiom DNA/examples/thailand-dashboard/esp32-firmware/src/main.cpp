/**
 * Axiom Framework - ESP32 Environmental Sensor Firmware
 * 
 * Supports:
 *   - PMS5003 (Plantower) PM2.5/PM10 sensor via UART
 *   - DHT22 temperature/humidity sensor
 *   - WiFi connectivity with auto-reconnect
 *   - MQTT telemetry publishing to ThingsBoard
 *   - Deep sleep for battery conservation
 *   - Watchdog timer for reliability
 * 
 * Build with PlatformIO:
 *   pio run --target upload
 */

#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <driver/rtc_io.h>

// Project configuration
#include "config.h"

// Hardware-specific libraries (install via PlatformIO Library Manager)
// lib_deps = 
//   knolleary/PubSubClient@^2.8
//   bblanchon/ArduinoJson@^6.21
//   adafruit/DHT sensor library@^1.4
//   adafruit/Adafruit Unified Sensor@^1.1

#include <DHT.h>
#include <HardwareSerial.h>

// PMS5003 data structure
struct PMSData {
    uint16_t pm10_standard;
    uint16_t pm25_standard;
    uint16_t pm100_standard;
    uint16_t pm10_env;
    uint16_t pm25_env;
    uint16_t pm100_env;
    uint16_t particles_03um;
    uint16_t particles_05um;
    uint16_t particles_10um;
    uint16_t particles_25um;
    uint16_t particles_50um;
    uint16_t particles_100um;
    uint16_t unused;
    uint16_t checksum;
};

// Global objects
WiFiClient wifiClient;
PubSubClient mqtt(wifiClient);
HardwareSerial pmsSerial(2);  // UART2
DHT dht(DHT_PIN, DHT_TYPE);

// RTC memory (persists across deep sleep)
RTC_DATA_ATTR int bootCount = 0;
RTC_DATA_ATTR int consecutiveFailures = 0;

void logMessage(const char* level, const char* message) {
    if (DEBUG_SERIAL) {
        Serial.printf("[%s] %s: %s\n", 
            level, 
            String(millis()).c_str(), 
            message);
    }
}

void blinkLED(int times, int duration_ms) {
    if (LED_PIN < 0) return;
    for (int i = 0; i < times; i++) {
        digitalWrite(LED_PIN, HIGH);
        delay(duration_ms);
        digitalWrite(LED_PIN, LOW);
        if (i < times - 1) delay(duration_ms);
    }
}

bool connectWiFi() {
    logMessage("INFO", "Connecting to WiFi...");
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    
    int retries = 0;
    while (WiFi.status() != WL_CONNECTED && retries < MAX_CONNECT_RETRIES) {
        delay(CONNECT_RETRY_DELAY_MS);
        retries++;
        if (DEBUG_SERIAL) Serial.print(".");
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        logMessage("INFO", ("WiFi connected, IP: " + WiFi.localIP().toString()).c_str());
        return true;
    }
    
    logMessage("ERROR", "WiFi connection failed");
    return false;
}

bool connectMQTT() {
    mqtt.setServer(MQTT_SERVER, MQTT_PORT);
    
    String clientId = String("axiom_") + String(DEVICE_ID);
    
    int retries = 0;
    while (!mqtt.connected() && retries < MAX_CONNECT_RETRIES) {
        if (mqtt.connect(clientId.c_str(), DEVICE_ACCESS_TOKEN, NULL)) {
            logMessage("INFO", "MQTT connected");
            return true;
        }
        delay(CONNECT_RETRY_DELAY_MS);
        retries++;
    }
    
    logMessage("ERROR", ("MQTT connection failed, rc=" + String(mqtt.state())).c_str());
    return false;
}

bool readPMS5003(PMSData& data) {
    const uint8_t HEADER_1 = 0x42;
    const uint8_t HEADER_2 = 0x4D;
    
    // Wait for data with timeout
    unsigned long start = millis();
    while (pmsSerial.available() < 32) {
        if (millis() - start > 5000) {
            logMessage("ERROR", "PMS5003 timeout waiting for data");
            return false;
        }
        delay(10);
    }
    
    // Find header
    while (pmsSerial.available() >= 2) {
        if (pmsSerial.read() == HEADER_1 && pmsSerial.peek() == HEADER_2) {
            pmsSerial.read();  // consume header_2
            break;
        }
        if (millis() - start > 1000) {
            logMessage("ERROR", "PMS5003 header not found");
            return false;
        }
    }
    
    // Read frame length
    uint8_t frameLenHigh = pmsSerial.read();
    uint8_t frameLenLow = pmsSerial.read();
    uint16_t frameLength = (frameLenHigh << 8) | frameLenLow;
    
    if (frameLength != 28) {
        logMessage("WARN", ("PMS5003 unexpected frame length: " + String(frameLength)).c_str());
        return false;
    }
    
    // Read data bytes
    uint8_t buffer[30];
    size_t read = pmsSerial.readBytes(buffer, 26);
    if (read != 26) {
        logMessage("ERROR", ("PMS5003 short read: " + String(read) + " bytes").c_str());
        return false;
    }
    
    // Calculate checksum
    uint16_t checksum = ((uint16_t)buffer[24] << 8) | buffer[25];
    uint16_t calculated = HEADER_1 + HEADER_2 + frameLenHigh + frameLenLow;
    for (int i = 0; i < 24; i++) {
        calculated += buffer[i];
    }
    
    if (checksum != calculated) {
        logMessage("WARN", ("PMS5003 checksum mismatch: " + String(checksum) + " vs " + String(calculated)).c_str());
        return false;
    }
    
    // Parse data
    data.pm10_standard  = ((uint16_t)buffer[0]  << 8) | buffer[1];
    data.pm25_standard  = ((uint16_t)buffer[2]  << 8) | buffer[3];
    data.pm100_standard = ((uint16_t)buffer[4]  << 8) | buffer[5];
    data.pm10_env       = ((uint16_t)buffer[6]  << 8) | buffer[7];
    data.pm25_env       = ((uint16_t)buffer[8]  << 8) | buffer[9];
    data.pm100_env      = ((uint16_t)buffer[10] << 8) | buffer[11];
    data.particles_03um = ((uint16_t)buffer[12] << 8) | buffer[13];
    data.particles_05um = ((uint16_t)buffer[14] << 8) | buffer[15];
    data.particles_10um = ((uint16_t)buffer[16] << 8) | buffer[17];
    data.particles_25um = ((uint16_t)buffer[18] << 8) | buffer[19];
    data.particles_50um = ((uint16_t)buffer[20] << 8) | buffer[21];
    data.particles_100um = ((uint16_t)buffer[22] << 8) | buffer[23];
    
    return true;
}

void publishTelemetry(float pm25, float pm10, float temperature, float humidity) {
    StaticJsonDocument<512> doc;
    
    doc["device_id"] = DEVICE_ID;
    doc["municipality_id"] = MUNICIPALITY_ID;
    doc["lat"] = LATITUDE;
    doc["lon"] = LONGITUDE;
    doc["pm25"] = round(pm25 * 100) / 100.0;
    doc["pm10"] = round(pm10 * 100) / 100.0;
    doc["temperature"] = round(temperature * 100) / 100.0;
    doc["humidity"] = round(humidity * 100) / 100.0;
    doc["boot_count"] = bootCount;
    doc["rssi"] = WiFi.RSSI();
    
    char payload[512];
    size_t len = serializeJson(doc, payload);
    
    if (mqtt.publish(MQTT_TELEMETRY_TOPIC, payload, len)) {
        logMessage("INFO", ("Published: " + String(payload)).c_str());
        blinkLED(2, 100);
    } else {
        logMessage("ERROR", "MQTT publish failed");
        consecutiveFailures++;
    }
}

void enterDeepSleep() {
    logMessage("INFO", ("Entering deep sleep for " + String(SLEEP_DURATION_SECONDS) + "s").c_str());
    
    mqtt.disconnect();
    WiFi.disconnect(true);
    WiFi.mode(WIFI_OFF);
    
    esp_sleep_enable_timer_wakeup(SLEEP_DURATION_SECONDS * 1000000ULL);
    esp_deep_sleep_start();
}

void setup() {
    if (DEBUG_SERIAL) {
        Serial.begin(115200);
        delay(1000);
    }
    
    bootCount++;
    logMessage("INFO", ("Boot count: " + String(bootCount)).c_str());
    
    // Initialize LED
    if (LED_PIN >= 0) {
        pinMode(LED_PIN, OUTPUT);
        digitalWrite(LED_PIN, LOW);
    }
    
    // Initialize hardware
    pmsSerial.begin(PMS_BAUD, SERIAL_8N1, PMS_RX_PIN, PMS_TX_PIN);
    dht.begin();
    
    // If too many consecutive failures, stay awake for debugging
    if (consecutiveFailures >= 10) {
        logMessage("ERROR", "Too many failures, entering extended sleep (1 hour)");
        consecutiveFailures = 0;
        esp_sleep_enable_timer_wakeup(3600ULL * 1000000ULL);
        esp_deep_sleep_start();
    }
    
    // Connect to network
    if (!connectWiFi()) {
        consecutiveFailures++;
        enterDeepSleep();
        return;  // Never reached
    }
    
    if (!connectMQTT()) {
        consecutiveFailures++;
        enterDeepSleep();
        return;
    }
    
    // Take multiple samples and average
    float pm25_sum = 0, pm10_sum = 0;
    int valid_pm_samples = 0;
    
    for (int i = 0; i < SAMPLE_COUNT; i++) {
        PMSData pmsData;
        if (readPMS5003(pmsData)) {
            pm25_sum += pmsData.pm25_env;
            pm10_sum += pmsData.pm10_env;
            valid_pm_samples++;
        }
        delay(2000);  // PMS5003 updates every 2.3s
    }
    
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    
    // Check for NaN readings
    if (isnan(temperature)) temperature = -999;
    if (isnan(humidity)) humidity = -999;
    
    // Calculate averages
    float pm25_avg = valid_pm_samples > 0 ? pm25_sum / valid_pm_samples : -999;
    float pm10_avg = valid_pm_samples > 0 ? pm10_sum / valid_pm_samples : -999;
    
    logMessage("INFO", ("PM2.5: " + String(pm25_avg) + ", Temp: " + String(temperature) + "C, Hum: " + String(humidity) + "%").c_str());
    
    // Publish
    publishTelemetry(pm25_avg, pm10_avg, temperature, humidity);
    
    // Success - reset failure counter
    consecutiveFailures = 0;
    
    // Sleep
    enterDeepSleep();
}

void loop() {
    // Never reached due to deep sleep, but required by Arduino framework
}
