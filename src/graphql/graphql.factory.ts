import { ApiModule } from '@/api/api.module';
import { GlobalConfig } from '@/config/global-config.type';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';

function useGraphqlFactory(
  configService: ConfigService<GlobalConfig>,
): ApolloDriverConfig {
  const env = configService.get('app.nodeEnv', { infer: true });
  return {
    playground: env === 'development' || env === 'local',
    autoSchemaFile: path.join(
      __dirname,
      '../../src/generated/schema.generated.gql',
    ),
    formatError: (...params: Parameters<ApolloDriverConfig['formatError']>) => {
      const [err] = params;
      if (
        configService.getOrThrow('app.nodeEnv', { infer: true }) !==
        'development'
      ) {
        if ('stacktrace' in err.extensions) {
          err.extensions.stacktrace = null;
        }
      }
      return err;
    },
    include: [ApiModule],
    context: (req: FastifyRequest, res: FastifyReply) => ({ req, res }),
  };
}

export default useGraphqlFactory;
