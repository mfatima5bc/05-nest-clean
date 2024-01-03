import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment(
        {
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        },
        new UniqueEntityID('1'),
      ),
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment(
        {
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        },
        new UniqueEntityID('2'),
      ),
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment(
        {
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        },
        new UniqueEntityID('3'),
      ),
    );

    const result = await sut.execute({
      answerId: 'answer-1',
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

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
