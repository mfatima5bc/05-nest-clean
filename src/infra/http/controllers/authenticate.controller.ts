import {
  Post,
  Controller,
  HttpCode,
  Body,
  UsePipes,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public';

const authenticationBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticationBodySchema = z.infer<typeof authenticationBodySchema>;

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticationBodySchema))
  async handle(@Body() body: AuthenticationBodySchema) {
    const { email, password } = authenticationBodySchema.parse(body);
    const result = await this.authenticateStudent.execute({
      email,
      password,
    });

    if (result.isError()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;
    return { accessToken };
  }
}
