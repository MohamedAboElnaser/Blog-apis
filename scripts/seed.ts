import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DatabaseSeeder } from '../src/database/seeders/database.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(DatabaseSeeder);

  try {
    const args = process.argv.slice(2);
    const isForce = args.includes('--force');

    if (isForce) {
      await seeder.forceSeed();
    } else {
      await seeder.seed();
    }

    console.log('🎉 Seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error);
  process.exit(1);
});
