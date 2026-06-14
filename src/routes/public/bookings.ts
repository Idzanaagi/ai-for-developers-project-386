import { Router } from 'express';
import { randomUUID } from 'crypto';
import { bookings } from '../../data/store.js';
import { getAvailableSlots } from '../../services/slotService.js';

const router = Router();

router.get('/api/slots', (req, res) => {
  const date = req.query.date as string | undefined;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(422).json({ error: 'ValidationError', message: 'Неверный или отсутствующий параметр date' });
  }

  try {
    const slots = getAvailableSlots(date);
    res.json({ date, slots });
  } catch {
    res.status(500).json({ error: 'InternalError', message: 'Ошибка при загрузке слотов' });
  }
});

router.post('/bookings', (req, res) => {
  const { guestName, guestEmail, startTime } = req.body;

  if (!guestName || !guestEmail || !startTime) {
    return res.status(422).json({ error: 'ValidationError', message: 'Имя, email и время начала обязательны' });
  }

  const start = new Date(startTime);
  if (isNaN(start.getTime())) {
    return res.status(422).json({ error: 'ValidationError', message: 'Некорректный формат времени' });
  }

  const end = new Date(start);
  end.setUTCMinutes(end.getUTCMinutes() + 30);

  const conflict = Array.from(bookings.values()).some(
    b => b.startTime < end && b.endTime > start
  );

  if (conflict) {
    return res.status(409).json({ error: 'Conflict', message: 'Этот слот уже занят, выберите другой' });
  }

  const id = randomUUID();
  const booking = {
    id,
    guestName,
    guestEmail,
    startTime: start,
    endTime: end,
    createdAt: new Date(),
  };

  bookings.set(id, booking);

  const redirectUrl = `/bookings/${id}`;
  if (req.is('json')) {
    res.json({ redirect: redirectUrl });
  } else {
    res.redirect(redirectUrl);
  }
});

router.get('/bookings/:id', (req, res) => {
  try {
    const booking = bookings.get(req.params.id);

    if (!booking) {
      return res.status(404).render('public/error', { message: 'Бронь не найдена' });
    }

    res.render('public/bookings/success', { booking });
  } catch {
    res.status(500).render('public/error', { message: 'Ошибка при загрузке брони' });
  }
});

export default router;
