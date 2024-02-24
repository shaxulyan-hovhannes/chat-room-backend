import { Module } from "@nestjs/common";

import { MessageService } from "./message.service";

@Module({
  imports: [],
  controllers: [],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
