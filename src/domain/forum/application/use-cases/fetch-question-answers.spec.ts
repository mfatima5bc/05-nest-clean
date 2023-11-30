import { FetchQuestionAnswersAnswersUseCase } from './fetch-question-answers';
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionAnswersRepository: InMemoryAnswerRepository;
let sut: FetchQuestionAnswersAnswersUseCase;

describe('Fetch question answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryQuestionAnswersRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new FetchQuestionAnswersAnswersUseCase(
      inMemoryQuestionAnswersRepository,
    );
  });

  it('should be able to fetch questions answers', async () => {
    await inMemoryQuestionAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    );
    await inMemoryQuestionAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    );
    await inMemoryQuestionAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    );

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  it('should be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('question-1') }),
      );
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    });

    expect(result.value?.answers).toHaveLength(2);
  });
});
