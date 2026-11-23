import { Module } from '@nestjs/common';
import { PetsModule } from './pets/pets.module.js';

@Module({
  imports: [PetsModule],
})
export class AppModule {}
