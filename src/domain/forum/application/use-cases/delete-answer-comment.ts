import { ResponseType, error, success } from '@/core/response-type';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string;
  answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResponse = ResponseType<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId);

    if (!answerComment) {
      return error(new ResourceNotFoundError());
    }

    if (answerComment.authorId.toString() !== authorId) {
      return error(new NotAllowedError());
    }

    await this.answerCommentsRepository.delete(answerComment);

    return success({});
  }
}
