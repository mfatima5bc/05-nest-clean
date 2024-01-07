import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { makeQuestion } from 'test/factories/make-question';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository';
import { makeStudent } from 'test/factories/make-student';
import { makeAttachment } from 'test/factories/make-attachment';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository);
  });

  it('Should be able to get a question by slug', async () => {
    const student = makeStudent({ name: 'John Doe' });

    await inMemoryStudentsRepository.create(student);

    const newQuestion = makeQuestion({
      authorId: student.id,
      slug: Slug.create('example-question'),
    });

    await inMemoryQuestionRepository.create(newQuestion);

    const attachment = makeAttachment({
      title: 'Some attachment',
    });

    inMemoryAttachmentsRepository.items.push(attachment);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    );

    const result = await sut.execute({
      slug: 'example-question',
    });

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: attachment.title,
          }),
        ],
      }),
    });
  });
});
