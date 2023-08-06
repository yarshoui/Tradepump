import { WebSocket } from "ws";
import { EventEmitter } from 'events';
import { Kafka, Consumer } from 'kafkajs';
import { getLogger } from 'log4js';
import { wait } from "./common";

const logger = getLogger('KafkaConsumer');
export type ConnecitonState = 'disconnected' | 'connecting' | 'connected';

export interface KafkaConsumerProps {
    brokers: string[];
    clientId?: string;
    producerTimeout?: number;
}

export class KafkaConsumer extends EventEmitter {
    static _instance?: KafkaConsumer;

    _kafka: Kafka;
    _channel?: Consumer;
    _timer?: NodeJS.Timeout;
    _timeout: number;
    _topics: Set<string> = new Set();
    state: ConnecitonState;

    constructor({ brokers, producerTimeout }: KafkaConsumerProps) {
        super();
        this.state = 'disconnected';
        this._timeout = producerTimeout ?? 1000;
        this._kafka = new Kafka({
            clientId: "tradepump-serversocket",
            brokers,
            authenticationTimeout: 1000,
            connectionTimeout: 1000,
            ssl: false,
            // Debug
            //   logLevel: 5,
        });
    }

    async connect(topic: string) {
        if (this._channel) {
            return this._channel;
        }
        if (this.state === 'disconnected') {
            logger.info(`Connecting to kafka server...`);
            this.state = 'connecting';
            try {
                const conn = this._kafka?.consumer({
                    groupId: "tradepump-server",
                });
                if (!conn) {
                    throw new Error(`Could not create a Kafka consumer`);
                }
                await conn.connect();
                await conn.subscribe({ topic });
                await conn.run({
                    eachMessage: async (payload) => {
                        const data = payload.message.value;
                        if (data == null) return;
                        // const mode = data[0];
                        // const buffer = data.slice(1);
                        // // Book - 1, Trade - 2
                        // const decoder = mode === 1 ? decodeBookMessage : decodeTradeMessage;
                        // const msg = decoder(buffer);
                        this.emit("message", data);
                    },
                })
                // TODO: reconnect on consumer crash? maybe kafkajs does it?
                this._channel = conn;
                this.state = 'connected';
                logger.info(`Consumer created`);
                return this._channel;
            } catch (err) {
                const msg = err instanceof Error ? err.message : err;
                logger.error(`Error connecting to broker. ${msg}. Reconnecting...`);
                logger.debug(err);
                delete this._channel;
                await wait(1000);
                this.state = 'disconnected';
                await this.connect(topic);
            }
        }
        // wait while connecting
        logger.info(`Waiting for producer...`);
        const time = Date.now();
        while (!this._channel) await wait(100);
        logger.info(`Producer available in ${Date.now() - time}ms`);

        return this._channel;
    }

    async disconnect() {
        if (this._channel) {
            await this._channel.disconnect();
        }
    }
}


export class ConsumerManager {
    private consumers: Set<WebSocket> = new Set();

    addSocket(socket: WebSocket) {
        this.consumers.add(socket)
    }

    removeConsumer(socket: WebSocket) {
        this.consumers.delete(socket);
    }

    async sendMessage(message: Buffer) {
        for (const socket of this.consumers) {
            socket.send(message);
        }
    }
}
