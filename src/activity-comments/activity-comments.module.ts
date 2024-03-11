import { Module } from '@nestjs/common';
import { ActivityCommentsController } from './activity-comments.controller';
import { ActivityCommentsService } from './activity-comments.service';

@Module({
  controllers: [ActivityCommentsController],
  providers: [ActivityCommentsService]
})
export class ActivityCommentsModule {}
