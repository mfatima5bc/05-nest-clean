import { ResponseType, success } from '@/core/response-type';
import { Question } from '../../enterprise/entities/question';
import { QuestionRepository } from '../repositories/questions-repository';
import { Injectable } from '@nestjs/common';

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

type FetchRecentQuestionsUseCaseResponse = ResponseType<
  null,
  {
    questions: Question[];
  }
>;

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private quesitonsRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.quesitonsRepository.findManyRecent({ page });

    return success({
      questions,
    });
  }
}
