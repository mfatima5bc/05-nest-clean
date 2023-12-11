import { AppModule } from '@/infra/app.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/make-student';
import { DatabaseModule } from '@/infra/database/database.module';
import { AnswerFactory } from 'test/factories/make-answer';
import { QuestionFactory } from 'test/factories/make-question';

describe('Choose question best answer (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let answerFactory: AnswerFactory;
  let questionFactory: QuestionFactory;
  let jwt: JwtService;

  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    questionFactory = moduleRef.get(QuestionFactory);

    await app.init();
  });

  test('[PATCH] /answers/:answerId/choose-as-best', async () => {
    const user = await studentFactory.makePrismaStudent();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    });
    const answerId = answer.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/answers/${answerId}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const questionOnDataBase = await prisma.question.findUnique({
      where: {
        id: question.id.toString(),
      },
    });

    expect(questionOnDataBase?.bestAnswerId).toEqual(answerId);
  });
});
