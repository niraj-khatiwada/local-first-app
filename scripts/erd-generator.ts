import 'dotenv/config';
import { TypeormMarkdownGenerator } from 'typeorm-markdown-generator';
import DataSource from '../src/database/data-source';

const generateErd = async () => {
  try {
    const typeormMarkdown = new TypeormMarkdownGenerator(DataSource, {
      entityPath: 'src/**/*.entity.ts',
      title: 'Postgres ERD',
      outFilePath: '.tmp/erd.md',
      indexTable: true,
    });
    await typeormMarkdown.build();
    // eslint-disable-next-line no-console
    console.log('\n\x1b[34mDatabase ERD generated successfully.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('\n\x1b[31mError generating ERD:', error);
  }
};

generateErd();
