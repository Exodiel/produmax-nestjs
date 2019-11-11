import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(5000)
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect  {
  handleDisconnect(client: Socket) {
    client.emit('disconnection', 'Conexión perdida');
  }
  handleConnection(client: Socket, ...args: any[]) {
    client.emit('connection', 'Conexión satisfactoria con el servidor');
  }

  @WebSocketServer()
  wss: Server;
}
