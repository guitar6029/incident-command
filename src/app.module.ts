import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IncidentsModule } from './incidents/incidents.module';
import { UsersModule } from './users/users.module';
import { ActionsModule } from './actions/actions.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [IncidentsModule, UsersModule, ActionsModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
