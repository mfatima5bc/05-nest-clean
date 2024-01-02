import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    );
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment(
        {
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        },
        new UniqueEntityID('1'),
      ),
    );

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment(
        {
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        },
        new UniqueEntityID('2'),
      ),
    );

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment(
        {
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        },
        new UniqueEntityID('3'),
      ),
    );

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: new UniqueEntityID('2'),
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: new UniqueEntityID('3'),
        }),
      ]),
    );
  });

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
