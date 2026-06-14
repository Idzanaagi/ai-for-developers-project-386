import "@typespec/http";
import "@typespec/rest";
import "./models.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;

@tag("Public: Event Types")
interface PublicEventTypes {
  /** Landing page — list all available event types */
  @route("/")
  @get
  listPublicEventTypes(): EventType[];

  /** Booking page — shows calendar for a specific event type */
  @route("/book/{eventTypeId}")
  @get
  bookingPage(
    @path eventTypeId: string,
  ): void | NotFoundResponse;
}

@tag("Public: Slots")
interface PublicSlots {
  /** Get available slots for a specific event type on a specific date */
  @route("/api/slots")
  @get
  getSlots(
    @query eventTypeId: string,
    @query date: string,
  ): SlotsResponse | NotFoundResponse | ValidationErrorResponse;
}

@tag("Public: Bookings")
interface PublicBookings {
  /** Create a new booking */
  @route("/bookings")
  @post
  createBooking(
    @body body: BookingCreate,
  ): CreatedResponse<Booking> | ConflictResponse | ValidationErrorResponse;

  /** Booking confirmation page */
  @route("/bookings/{id}")
  @get
  bookingConfirmation(
    @path id: string,
  ): Booking | NotFoundResponse;
}
