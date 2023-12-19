import { ResponseType, error, success } from '@/core/response-type';
import { Injectable } from '@nestjs/common';
import { InvalidAttachmentType } from './errors/invalid-attachment-type-error';
import { Attachment } from '../../enterprise/entities/attachment';
import { AttachmentsRepository } from '../repositories/attachment-repository';
import { Uploader } from '../storage/uploader';

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAndCreateAttachmentUseCaseResponse = ResponseType<
  InvalidAttachmentType,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return error(new InvalidAttachmentType(fileType));
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    return success({
      attachment,
    });
  }
}
