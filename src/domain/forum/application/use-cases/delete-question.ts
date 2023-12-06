import { ResponseType, error, success } from '@/core/response-type';
import { QuestionRepository } from '../repositories/questions-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface DeleteQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
}

type DeleteQuestionUseCaseResponse = ResponseType<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

@Injectable()
export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return error(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== authorId) {
      return error(new NotAllowedError());
    }

    await this.questionsRepository.delete(question);

    return success({});
  }
}
