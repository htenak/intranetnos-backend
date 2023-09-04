import { Provider } from '@nestjs/common';
import { ScheduleService } from '../schedule.service';

/**
 * Provider que se inserta en 'providers'
 * en schedule.module para arrancar creando
 * los días en la base de datos
 */

export const DayInitializerProvider: Provider = {
  provide: 'DAY_INITIALIZER',
  useFactory: async (scheduleService: ScheduleService) => {
    await scheduleService.createDaysIfNotExist();
  },
  inject: [ScheduleService],
};
