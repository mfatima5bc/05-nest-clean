import { ResponseType, error, success } from '@/core/response-type';
import { Question } from '../../enterprise/entities/question';
import { QuestionRepository } from '../repositories/questions-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = ResponseType<
  ResourceNotFoundError,
  {
    question: Question;
  }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionRepository.findBySlug(slug);

    if (!question) {
      return error(new ResourceNotFoundError());
    }

    return success({
      question,
    });
  }
}
