import { Post, Controller, HttpCode, Body, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';

const authenticationBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticationBodySchema = z.infer<typeof authenticationBodySchema>;

@Controller('/sessions')
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
      throw new Error();
    }

    const { accessToken } = result.value;
    return { accessToken };
  }
}
