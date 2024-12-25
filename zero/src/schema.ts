// TODO: In future, share the same schema.ts file for both server(zero/src/schema.ts) and client(client/src/db/schema/index.ts)
import {
  ANYONE_CAN,
  createSchema,
  createTableSchema,
  definePermissions,
  ExpressionBuilder,
} from '@rocicorp/zero';

type AuthPayload = {
  sub: string | null;
};

const todoSchema = createTableSchema({
  tableName: 'todo',
  columns: {
    id: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string', optional: true },
    isCompleted: { type: 'boolean' },
    completedAt: { type: 'number', optional: true },
    createdAt: { type: 'number' },
    createdByUserId: { type: 'string' },
    updatedAt: { type: 'number' },
    updatedByUserId: { type: 'string' },
  },
  primaryKey: ['id'],
});

export const schema = createSchema({
  version: 1,
  tables: {
    todo: todoSchema,
  },
});

export type Schema = typeof schema;

export const permissions = definePermissions<AuthPayload, Schema>(
  schema,
  () => {
    const allowForCreator = (
      authPayload: AuthPayload,
      { cmp, cmpLit }: ExpressionBuilder<typeof todoSchema>,
    ) =>
      cmpLit(authPayload?.sub, 'IS NOT', null) &&
      cmp('createdByUserId', '=', authPayload?.sub as string);

    return {
      todo: {
        row: {
          select: [allowForCreator],
          insert: ANYONE_CAN,
          update: {
            preMutation: [allowForCreator],
          },
          delete: [allowForCreator],
        },
      },
    };
  },
);
