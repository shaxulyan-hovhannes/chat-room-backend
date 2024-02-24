import { Injectable } from "@nestjs/common";

import { v4 as uuidv4 } from "uuid";

import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class MessageService {
  async createMessage(createMessageDto: CreateMessageDto) {
    const message = {
      id: uuidv4(),
      timestamp: Date.now(),
      ...createMessageDto,
    };
    return message;
  }
}
