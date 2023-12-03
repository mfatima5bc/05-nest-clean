import { ResponseType, error, success } from '@/core/response-type';
import { Injectable } from '@nestjs/common';
import { Student } from '../../enterprise/entities/student';
import { StudentRepository } from '../repositories/students-repository';
import { StudentAlreadyExistsError } from './errors/student-already-exists-error';
import { HashGenerator } from '../cryptography/hasher-generator';

interface CreateStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type CreateStudentUseCaseResponse = ResponseType<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class CreateStudentUseCase {
  constructor(
    private studentRepository: StudentRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateStudentUseCaseRequest): Promise<CreateStudentUseCaseResponse> {
    const userWithSameEmail = await this.studentRepository.findByEmail(email);

    if (userWithSameEmail) {
      return error(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.studentRepository.create(student);

    return success({
      student,
    });
  }
}
