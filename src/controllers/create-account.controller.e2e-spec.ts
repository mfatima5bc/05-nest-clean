import { AppModule } from '@/app.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '@/prisma/prisma.service';

describe('Create account (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'Johndoe@email.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);
    const userOnDataBase = await prisma.user.findUnique({
      where: {
        email: 'Johndoe@email.com',
      },
    });

    expect(userOnDataBase).toBeTruthy();
  });
});
