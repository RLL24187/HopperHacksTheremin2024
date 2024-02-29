#include "pico/stdlib.h"
#include "pico/multicore.h"
#include "hardware/irq.h"
#include "hardware/uart.h"
#include <iostream>

#define UART_ID uart1
#define BAUD_RATE 921600
#define DATA_BITS 8 
#define STOP_BITS 1 
#define PARITY UART_PARITY_NONE

#define UART_TX_PIN 4 
#define UART_RX_PIN 5
#define BUFFER_SIZE 900 

char buffer[BUFFER_SIZE];
int bufferIndex = 0;
int parseIndex = 0;
bool wrap = false;

void uartInterrupt(){
    buffer[bufferIndex] = uart_getc(UART_ID);
    if (bufferIndex == BUFFER_SIZE - 1){
        bufferIndex = 0;
        wrap = true;
    } else {bufferIndex += 1;}
}

int main(){
     stdio_init_all();
     uart_init(UART_ID, BAUD_RATE);

     gpio_set_function(UART_TX_PIN, GPIO_FUNC_UART);
     gpio_set_function(UART_RX_PIN, GPIO_FUNC_UART);

     uart_set_hw_flow(UART_ID, false, false);
     uart_set_format(UART_ID, DATA_BITS, STOP_BITS, PARITY);
     uart_set_fifo_enabled(UART_ID, false);

     irq_set_exclusive_handler(21, &uartInterrupt);
     irq_set_enabled(21, true);
     uart_set_irq_enables(UART_ID, true, false);

     sleep_ms(500);
     uint8_t command[9] = {0xA5, 0xA5, 0xA5, 0xA5, 0x00, 0x60, 0x00, 0x00, 0x60};
     uart_write_blocking(UART_ID, command, 9);

     bool check = true;

     while (buffer[8] != 0x61){}

     for (int i = 0; i < 8; i++){
        if (i == 4){
            if (buffer[i] != 0x01){check = false;}
        } else {
            if (buffer[i] != command[i]){check = false;}
        }
     }

     if (check) {
        gpio_init(PICO_DEFAULT_LED_PIN);
        gpio_set_dir(PICO_DEFAULT_LED_PIN, GPIO_OUT);
        gpio_put(PICO_DEFAULT_LED_PIN, 1);
        sleep_ms(1000);
        gpio_put(PICO_DEFAULT_LED_PIN, 0);
     }

     uint8_t intensity = 0;
     uint16_t distance = 0;
     int shortestIndex = 0;
     int shortestDistance = 1000000;

     command[5] = 0x63;
     command[8] = 0x63;
     bufferIndex = 0;
     uart_write_blocking(UART_ID, command, 9);
     
     while (buffer[8] != 0x64){}
     sleep_ms(250);
     bufferIndex = 0;
     gpio_put(PICO_DEFAULT_LED_PIN, 1);

     while (1){
        if (bufferIndex == 331){
            for (int i = 10; i < 330; i += 2){
                distance = (buffer[i] | ((buffer[i + 1] << 8))) & 0x01ff;
                intensity = buffer[i + 1] >> 1;
                int j = (i - 8) / 2;
                if (distance < shortestDistance && distance > 5){
                    shortestDistance = distance;
                    shortestIndex = j;
                }
            }
            if (shortestIndex < 81){
                shortestIndex += 80;
            } else {
                shortestIndex -= 80;
            }
            printf("{\"distance\":%d,\"angle\":%d}", shortestDistance, shortestIndex);
            bufferIndex = 0;
            shortestDistance = 1000000;
            shortestIndex = 0;
        }

    }
}
