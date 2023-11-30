import { ResponseType, success } from '@/core/response-type';
import { Answer } from '../../enterprise/entities/answer';
import { AnswerRepository } from '../repositories/answers-repository';

interface FetchQuestionAnswersAnswersUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionAnswersAnswersUseCaseResponse = ResponseType<
  null,
  {
    answers: Answer[];
  }
>;

export class FetchQuestionAnswersAnswersUseCase {
  constructor(private answersRepository: AnswerRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersAnswersUseCaseRequest): Promise<FetchQuestionAnswersAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    );

    return success({
      answers,
    });
  }
}
