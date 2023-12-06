import { AppModule } from '@/infra/app.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /questions/:slug', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'Johndoe@email.com',
        password: await hash('123456', 8),
      },
    });
    const accessToken = jwt.sign({ sub: user.id });

    await prisma.question.create({
      data: {
        title: 'New question 01',
        slug: 'question-01',
        content: 'Question for test',
        authorId: user.id,
      },
    });
    const response = await request(app.getHttpServer())
      .get('/questions/question-01')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      question: expect.objectContaining({ title: 'New question 01' }),
    });
  });
});
