import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from "ws";
import { AuthService } from '../components/auth/auth.service';
import { Member } from '../libs/dto/member/member';
import * as url from 'url';

interface MessagePayload {
  event: string;
  text: string;
  memberData: Member;
}
interface InfoPayload{
  event: string;
  totalClients: number;
  memberData: Member;
  action:string;
}

@WebSocketGateway({tranports: ['websocket'], secure: false})
export class SocketGateway implements OnGatewayInit{
  private logger: Logger = new Logger("SocketEventsGateway");
  private summaryClient: number = 0;
  private clientsAuthMap = new Map<WebSocket, Member>();
  private messagesList: MessagePayload[] = [];
  
  constructor(private authService: AuthService) {}
   

  @WebSocketServer()
  server: Server;

  public afterInit(server: Server) {
    this.logger.verbose(`WebSocket Server Initialized & total: [${this.summaryClient}]`);
  }

  private async retrieveAuth(req: any): Promise<Member> {
    try {
      // url orqali user token ni yuborish mantiqi
      const parseUrl = url.parse(req.url, true);
      const {token} = parseUrl.query;
      return await this.authService.verifyToken(token as string);
    } catch (err) {
      return null;
    }
  }
  public async handleConnection(client: WebSocket, req: any) {
    const authMember = await this.retrieveAuth(req);
    this.summaryClient++;
    this.clientsAuthMap.set(client, authMember);

    const clientNick:string = authMember?.memberNick ?? 'Guest';
    this.logger.verbose(`Connection [${clientNick}] & total [${this.summaryClient}]`);

    const infoMsg: InfoPayload = {
      event: "info",
      totalClients: this.summaryClient,
      memberData: authMember,
      action: 'joined',
    };
    this.emitMessage(infoMsg); // Websocketdagi hammaga => xabar
    // CLIENT MESSAGES
    client.send(JSON.stringify({event: 'getMessages', list: this.messagesList})); // Ulangan Clientning uziga => xabar
  }

  public handleDisconnect(client: WebSocket) {
    const authMember = this.clientsAuthMap.get(client);
    this.summaryClient--;
    this.clientsAuthMap.delete(client);

    const clientNick:string = authMember?.memberNick ?? 'Guest';    
    this.logger.verbose(`Disconnection [${clientNick}] & total [${this.summaryClient}]`);

    const infoMsg: InfoPayload = {
      event: 'info',
      totalClients: this.summaryClient,
      memberData: authMember,
      action: 'left',
    };
    // client - disconnect
    this.broadcastMessage(client, infoMsg); // Uzilgandan tashqari hammaga => xabar
  }

  @SubscribeMessage('message')
  public async handleMessage(client: any, payload: string): Promise<void> {
    const authMember = this.clientsAuthMap.get(client);
    const newMessage: MessagePayload = {event: "message", text: payload, memberData: authMember};

    const clientNick: string = authMember?.memberNick ?? 'Guest';
    this.logger.verbose(`NEW MESSAGE [${clientNick}] ${payload}`);

    this.messagesList.push(newMessage);
    if(this.messagesList.length > 5) this.messagesList.splice(0, this.messagesList.length - 5);
    this.emitMessage(newMessage);

    // CLIENT MESSAGES
  }

  private broadcastMessage(sender: WebSocket, message: InfoPayload | MessagePayload) {
    this.server.clients.forEach((client) => {
      if(client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message)); // 
      }
    });
  }

  private emitMessage(message: InfoPayload | MessagePayload) {
    this.server.clients.forEach((client) => {
      if(client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}



/*
MESSAGE TARGET:
  1. Client(to only client self)
  2. Broadcast(to except client)
  3. Emit(to all clients)

*/