import { ResponseType, error, success } from '@/core/response-type';
import { Question } from '../../enterprise/entities/question';
import { AnswerRepository } from '../repositories/answers-repository';
import { QuestionRepository } from '../repositories/questions-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = ResponseType<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

@Injectable()
export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private answerRepository: AnswerRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return error(new ResourceNotFoundError());
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toValue(),
    );

    if (!question) {
      return error(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return error(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;

    await this.questionRepository.save(question);

    return success({
      question,
    });
  }
}
