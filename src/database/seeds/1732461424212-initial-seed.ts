import { UserEntity } from '@/api/user/entities/user.entity';
import { Role } from '@/api/user/user.enum';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class InitialSeed1732461424212 implements Seeder {
  track = true;

  public async run(
    dataSource: DataSource,
    _: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(UserEntity);
    await userRepository.save(
      userRepository.create({
        username: 'admin',
        email: 'admin@admin.com',
        password: 'AKIAQ74UGXHKJBMMKPUT',
        role: Role.Admin,
      }),
    );
  }
}
