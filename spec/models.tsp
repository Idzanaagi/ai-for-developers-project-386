import "@typespec/http";
import "@typespec/rest";

using TypeSpec.Http;
using TypeSpec.Rest;

enum BookingStatus {
  pending,
  confirmed,
  cancelled,
}

model Owner {
  id: string;
  name: string;
  email: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model EventType {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  durationMinutes: int32;
  deletedAt?: utcDateTime;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model EventTypeCreate {
  title: string;
  description?: string;
  durationMinutes: int32;
}

model EventTypeUpdate {
  title?: string;
  description?: string;
  durationMinutes?: int32;
}

model Booking {
  id: string;
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  startTime: utcDateTime;
  endTime: utcDateTime;
  status: BookingStatus;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model BookingCreate {
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  startTime: utcDateTime;
}

model Slot {
  startTime: utcDateTime;
  endTime: utcDateTime;
  available: boolean;
}

model SlotsResponse {
  date: utcDateTime;
  eventTypeId: string;
  durationMinutes: int32;
  slots: Slot[];
}

model ErrorResponse {
  error: string;
  message: string;
  details?: string;
}

model CreatedResponse<T> {
  @statusCode statusCode: 201;
  @body body: T;
}

model DeletedResponse {
  @statusCode statusCode: 204;
}

model ConflictResponse {
  @statusCode statusCode: 409;
  @body body: ErrorResponse;
}

model NotFoundResponse {
  @statusCode statusCode: 404;
  @body body: ErrorResponse;
}

model ValidationErrorResponse {
  @statusCode statusCode: 422;
  @body body: ErrorResponse;
}
