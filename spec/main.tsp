import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";
import "./models.tsp";
import "./admin.tsp";
import "./public.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;

@server("http://localhost:3000", "Development server")
@service({
  title: "Calendar Booking API",
  version: "1.0.0",
})
namespace CalendarBooking;
