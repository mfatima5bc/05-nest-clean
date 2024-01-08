import { EventHandler } from '@/core/events/event-handler';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { DomainEvents } from '@/core/events/domain-events';
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created-event';
import { AnswerRepository } from '@/domain/forum/application/repositories/answers-repository';
import { QuestionRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnAnswerCommentEvent implements EventHandler {
  constructor(
    private answerRepository: AnswerRepository,
    private questionRepository: QuestionRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    );
  }

  private async sendNewAnswerCommentNotification({
    answerComment,
    answerId,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answerRepository.findById(answerId.toString());

    if (answerComment && answer) {
      const question = await this.questionRepository.findById(
        answer?.questionId.toString(),
      );
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: 'Alguém interagiu com seu comentário!',
        content: `Alguém reagiu ao seu comentário em "${question?.title
          .substring(0, 20)
          .concat('...')} abra para ver!"`,
      });
    }
  }
}
