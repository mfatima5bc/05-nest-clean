import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { PrismaService } from '../prisma.service';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper';

export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await this.prisma.notification.create({
      data,
    });
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    });

    if (!notification) return null;
    return PrismaNotificationMapper.toDomain(notification);
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await this.prisma.notification.update({
      where: {
        id: notification.id.toString(),
      },
      data,
    });
  }
}
