import { AppModule } from '@/infra/app.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { StudentFactory } from 'test/factories/make-student';
import { DatabaseModule } from '@/infra/database/database.module';
import { QuestionFactory } from 'test/factories/make-question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { CacheModule } from '@/infra/cache/cache.module';
import { QuestionRepository } from '@/domain/forum/application/repositories/questions-repository';

describe('Prisma question repository (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let cacheRepository: CacheRepository;
  let questionsRepository: QuestionRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    cacheRepository = moduleRef.get(CacheRepository);
    questionsRepository = moduleRef.get(QuestionRepository);

    await app.init();
  });

  it('should cache questions details', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'question 01',
      slug: Slug.create('question-01'),
    });

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'Some attachment',
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    });

    const slug = question.slug.value;

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toEqual(JSON.stringify(questionDetails));
  });

  it('should return cache questions details on subsequent calls', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'question 01',
      slug: Slug.create('question-01'),
    });

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'Some attachment',
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    });

    const slug = question.slug.value;

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    );

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    expect(questionDetails).toEqual({ empty: true });
  });

  it('should reset question details cache when saving the question', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'question 01',
      slug: Slug.create('question-01'),
    });

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'Some attachment',
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    });

    const slug = question.slug.value;

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    );

    await questionsRepository.save(question);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toBeNull();
  });
});
