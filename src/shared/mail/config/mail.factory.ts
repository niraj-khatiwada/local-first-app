import { GlobalConfig } from '@/config/global-config.type';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import path from 'path';

async function useMailFactory(
  config: ConfigService<GlobalConfig>,
): Promise<MailerOptions> {
  return {
    transport: {
      host: config.get('mail.host', { infer: true }),
      port: config.get('mail.port', { infer: true }),
      ignoreTLS: config.get('mail.ignoreTLS', { infer: true }),
      requireTLS: config.get('mail.requireTLS', { infer: true }),
      secure: config.get('mail.secure', { infer: true }),
      logger: false, // This will be logged via app logger instead.
      auth: {
        user: config.get('mail.user', { infer: true }),
        pass: config.get('mail.password', { infer: true }),
      },
    },
    defaults: {
      from: `"${config.get('mail.defaultName', { infer: true })}" <${config.get('mail.defaultEmail', { infer: true })}>`,
    },
    template: {
      dir: path.join(__dirname, '..', 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
}

export default useMailFactory;
