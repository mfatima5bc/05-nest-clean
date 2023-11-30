import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ResponseType, error, success } from '@/core/response-type';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { Notification } from '../../enterprise/entities/notification';

interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = ResponseType<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId);

    if (!notification) {
      return error(new ResourceNotFoundError());
    }

    if (recipientId !== notification.recipientId.toString()) {
      return error(new NotAllowedError());
    }

    notification.read();

    await this.notificationsRepository.save(notification);

    return success({ notification });
  }
}
