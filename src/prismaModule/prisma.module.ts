import { Module, Global } from '@nestjs/common';
import { PrismaService } from 'src/prismaModule/prisma.service';

@Global() // Make this module global
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export PrismaService so it can be injected elsewhere
})
export class PrismaModule {}
