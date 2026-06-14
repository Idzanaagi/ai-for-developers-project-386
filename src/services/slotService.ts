import { bookings } from '../data/store.js';
import { Slot } from '../types';

const UTC_OFFSET = 3 * 3600000;

export function getAvailableSlots(date: string): Slot[] {
  const slots: Slot[] = [];
  const nowMs = Date.now();
  const nowUTC3 = new Date(nowMs + UTC_OFFSET);
  const todayUTC3 = nowUTC3.toISOString().slice(0, 10);
  const isToday = date === todayUTC3;

  const startOfDay = new Date(date + 'T00:00:00.000Z');
  const allBookings = Array.from(bookings.values());

  for (let h = 6; h < 14; h++) {
    for (let m = 0; m < 60; m += 30) {
      const start = new Date(startOfDay);
      start.setUTCHours(h, m, 0, 0);
      const end = new Date(start);
      end.setUTCMinutes(end.getUTCMinutes() + 30);

      if (isToday && start.getTime() <= nowMs) continue;

      const available = !allBookings.some(
        b => b.startTime < end && b.endTime > start
      );

      slots.push({
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        available,
      });
    }
  }

  return slots;
}
