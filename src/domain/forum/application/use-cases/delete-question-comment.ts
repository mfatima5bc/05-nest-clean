import { ResponseType, error, success } from '@/core/response-type';
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = ResponseType<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) {
      return error(new ResourceNotFoundError());
    }

    if (questionComment.authorId.toString() !== authorId) {
      return error(new NotAllowedError());
    }

    await this.questionCommentsRepository.delete(questionComment);

    return success({});
  }
}
