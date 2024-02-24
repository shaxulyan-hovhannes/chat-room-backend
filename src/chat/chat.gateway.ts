import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";

import { Socket } from "socket.io";
import { MessageService } from "./../message/message.service";

interface UserDto {
  id: string;
  name: string;
}

interface AddMessageDto {
  sender_id: string;
  receiver_id: string;
  content: string;
}

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    console.log(`Client ${client.id} connected. Auth token:`);
  }

  @SubscribeMessage("join")
  handleJoin(client: Socket, id: string) {
    console.log(`Client ${client.id} joined: ${id}`);
    client.join(id);
    return id;
  }

  @SubscribeMessage("leave")
  handleLeave(client: Socket, id: string) {
    console.log(`Client ${client.id} leaved: ${id}`);
    client.leave(id.toString());
    return id;
  }

  @SubscribeMessage("message")
  async handleMessage(client: Socket, message: AddMessageDto) {
    const newMessage = await this.messageService.createMessage(message);

    client.to(message.receiver_id).emit("message", newMessage);
    client.emit("message", newMessage);
  }

  @SubscribeMessage("user_created")
  async handleUserCreated(client: Socket, user: UserDto) {
    client.to("users").emit("user_created", user);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }
}
