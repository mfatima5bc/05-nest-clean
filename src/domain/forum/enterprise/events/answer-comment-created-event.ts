import { DomainEvent } from '@/core/events/domain-event';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerComment } from '../entities/answer-comment';

export class AnswerCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public answerComment: AnswerComment;
  public answerId: UniqueEntityID;

  constructor(answerComment: AnswerComment, answerId: UniqueEntityID) {
    this.answerComment = answerComment;
    this.ocurredAt = new Date();
    this.answerId = answerId;
  }

  getAggregateId(): UniqueEntityID {
    return this.answerComment.id;
  }
}
