import * as socketIo from 'socket.io';

import { RedisClient } from "redis";
import { verify } from "jsonwebtoken";
import { Server } from 'http';

import { SocketEvent, VerifyTokenStatus, Platform } from '../common/constants';
import { verifyTokenSignature } from "../utils/jsonwebtoken";
import { IDecodedToken } from "../common/interfaces/auth";
import config from "../common/config";

class SocketServer {

    private _io: SocketIO.Server;
    private _redis: RedisClient;

    constructor(server: Server, redis: RedisClient) {
        this._io = socketIo(server);
        this._redis = redis;
        this.listen();
    }

    private listen(): void {
        this._io
            .origins("*:*")
            .use((socket: any, next) => {
                // token format verification
                const socketAccessToken: string = socket.handshake.query.token;
                const { status, decodedToken } = verifyTokenSignature(socketAccessToken);

                switch (status) {
                    case VerifyTokenStatus.SUCCESS:
                        if (decodedToken) {
                            const { sub: tokenSubscriber } = decodedToken;
                            socket.subscriber = tokenSubscriber;
                            next();
                        }
                        break;
                    case VerifyTokenStatus.TOKEN_EXPIRED:
                        console.log('Token expired');
                        socket.disconnect();
                        break;
                    case VerifyTokenStatus.ACCESS_TOKEN_NOTFOUND:
                        console.log('Access token not found');
                        socket.disconnect();
                        break;
                    case VerifyTokenStatus.SIGNATURE_VERIFICATION_FAILURE:
                        console.log('Signature verification failed');
                        socket.disconnect();
                        break;
                    default:
                        console.log('Unknown error');
                        socket.disconnect();
                        break;
                }
            })
            .on(SocketEvent.CONNECT, (socket: any) => {
                // Get socket id and sub from client, then store to redis
                const socketId: string = socket.id;
                const sub: string = socket.subscriber;
                this._redis.set(sub, socketId);

                // remove sub from redis once disconnect
                socket.on(SocketEvent.DISCONNECT, () => {
                    this._redis.del(sub);
                });
            });

        if (this._io) {
            console.log('Running Socket Server is listening.');
        }
    }

    public close(): void {
        this._io.on('end', (socket: any) => {
            socket.disconnect(0);
            console.info(new Date(), "[SocketServer]: Disconnect");
        })
    }

    get instance(): SocketIO.Server {
        return this._io;
    }
}

export default SocketServer;