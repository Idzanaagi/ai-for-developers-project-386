import "@typespec/http";
import "./models.tsp";

using TypeSpec.Http;

@tag("Admin: Event Types")
interface AdminEventTypes {
  /** List all event types (excluding soft-deleted) */
  @route("/admin/event-types")
  @get
  listEventTypes(): EventType[];

  /** Show form to create a new event type */
  @route("/admin/event-types/new")
  @get
  newEventTypeForm(): void;

  /** Create a new event type */
  @route("/admin/event-types")
  @post
  createEventType(
    @body body: EventTypeCreate,
  ): CreatedResponse<EventType> | ValidationErrorResponse;

  /** Show form to edit an event type */
  @route("/admin/event-types/{id}/edit")
  @get
  editEventTypeForm(
    @path id: string,
  ): EventType | NotFoundResponse;

  /** Update an event type */
  @route("/admin/event-types/{id}")
  @post
  updateEventType(
    @path id: string,
    @body body: EventTypeUpdate,
  ): EventType | NotFoundResponse | ValidationErrorResponse;

  /** Soft-delete an event type */
  @route("/admin/event-types/{id}/delete")
  @post
  deleteEventType(
    @path id: string,
  ): DeletedResponse | NotFoundResponse;
}

@tag("Admin: Bookings")
interface AdminBookings {
  /** List all upcoming bookings across all event types */
  @route("/admin/bookings")
  @get
  listBookings(): Booking[];

  /** Confirm a pending booking */
  @route("/admin/bookings/{id}/confirm")
  @post
  confirmBooking(
    @path id: string,
  ): Booking | NotFoundResponse | ConflictResponse;

  /** Cancel a booking */
  @route("/admin/bookings/{id}/cancel")
  @post
  cancelBooking(
    @path id: string,
  ): Booking | NotFoundResponse | ConflictResponse;
}
