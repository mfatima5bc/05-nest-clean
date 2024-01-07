import { ResponseType, error, success } from '@/core/response-type';
import { QuestionRepository } from '../repositories/questions-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details';

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = ResponseType<
  ResourceNotFoundError,
  {
    question: QuestionDetails;
  }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionRepository.findDetailsBySlug(slug);

    if (!question) {
      return error(new ResourceNotFoundError());
    }

    return success({
      question,
    });
  }
}
