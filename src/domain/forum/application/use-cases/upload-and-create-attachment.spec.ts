import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository';
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment';
import { FakeUploader } from 'test/storage/fake-uploader';
import { InvalidAttachmentType } from './errors/invalid-attachment-type-error';

let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe('Upload file', () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentRepository,
      fakeUploader,
    );
  });

  it('should be able to upload and create a attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.jpeg',
      fileType: 'image/jpeg',
      body: Buffer.from(''),
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentRepository.items[0],
    });

    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.jpeg',
      }),
    );
  });

  it('should not be able to upload and create a attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'image/mpeg',
      body: Buffer.from(''),
    });

    expect(result.isError()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentType);
  });
});
