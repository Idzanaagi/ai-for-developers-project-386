import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { resetStore, addBooking } from './helpers.js';

beforeEach(() => {
  resetStore();
});

describe('GET /admin', () => {
  it('shows "Нет предстоящих броней" when no bookings', async () => {
    const res = await request(app).get('/admin');

    expect(res.status, 'админка должна отдавать 200').toBe(200);
    expect(res.text, 'должно быть сообщение об отсутствии броней').toContain('Нет предстоящих броней');
  });

  it('lists all upcoming bookings in a table', async () => {
    addBooking({ guestName: 'Alice' });
    addBooking({ id: 'test-id-2', guestName: 'Bob' });

    const res = await request(app).get('/admin');

    expect(res.status, 'админка должна отдавать 200').toBe(200);
    expect(res.text, 'должно отображаться имя Alice').toContain('Alice');
    expect(res.text, 'должно отображаться имя Bob').toContain('Bob');
    expect(res.text, 'не должно быть сообщения об отсутствии броней').not.toContain('Нет предстоящих броней');
  });

  it('excludes past bookings from the list', async () => {
    const past = new Date();
    past.setFullYear(past.getFullYear() - 1);
    addBooking({
      id: 'past-booking',
      guestName: 'PastUser',
      startTime: past,
      endTime: new Date(past.getTime() + 30 * 60000),
    });

    const res = await request(app).get('/admin');

    expect(res.status, 'админка должна отдавать 200').toBe(200);
    expect(res.text, 'прошедшая бронь не должна отображаться').not.toContain('PastUser');
  });

  it('sorts bookings by startTime ascending', async () => {
    addBooking({
      id: 'booking-2',
      guestName: 'Second',
      startTime: new Date('2026-08-01T10:00:00.000Z'),
      endTime: new Date('2026-08-01T10:30:00.000Z'),
    });
    addBooking({
      id: 'booking-1',
      guestName: 'First',
      startTime: new Date('2026-07-01T09:00:00.000Z'),
      endTime: new Date('2026-07-01T09:30:00.000Z'),
    });

    const res = await request(app).get('/admin');

    const firstIndex = res.text.indexOf('First');
    const secondIndex = res.text.indexOf('Second');
    expect(firstIndex, 'First должен присутствовать на странице').toBeGreaterThan(0);
    expect(secondIndex, 'Second должен быть после First').toBeGreaterThan(firstIndex);
  });
});
