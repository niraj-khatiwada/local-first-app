import { IVerifyEmailJob } from '@/common/interfaces/job.interface';
import { MailService } from '@/shared/mail/mail.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailQueueService {
  constructor(private readonly mailService: MailService) {}

  async sendEmailVerification(data: IVerifyEmailJob): Promise<void> {
    await this.mailService.sendEmailVerification(data.email, data.token);
  }
}
