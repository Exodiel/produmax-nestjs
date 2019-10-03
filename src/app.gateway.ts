import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(4001)
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect  {
  handleDisconnect(client: Socket) {
    client.emit('disconnection', 'Conexión perdida');
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  handleConnection(client: Socket, ...args: any[]) {
    client.emit('connection', 'Conexión satisfactoria con el servidor');
    this.logger.log(`Client connected: ${client.id}`);
  }

  @WebSocketServer()
  wss: Server;

  private logger: Logger = new Logger('AppGateway');
}
