import fastify from "fastify";
import { CreateTrip } from "./routes/create-trip";
import cors from '@fastify/cors'
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { ConfirmTrip } from "./routes/confirm-trip";
import { ConfirmParticipant } from "./routes/confirm-participante";
import { CreateActivity } from "./routes/create-activity";
import { GetActivity } from "./routes/get-activity";
import { CreateLink } from "./routes/create-link";
import { GetLinks } from "./routes/get-links";
import { GetParticipants } from "./routes/get-participants";
import { CreateInvite } from "./routes/create-invite";
import { UpdateTrip } from "./routes/update-trip";
import { GetTripDetails } from "./routes/get-trip-details";
import { GetParticipant } from "./routes/get-participant";
import { errorHandler } from "./error-randler";
import { env } from "./env";

const app = fastify()

app.register(cors, {
  origin: '*'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

app.register(CreateTrip)
app.register(ConfirmTrip)
app.register(ConfirmParticipant)
app.register(CreateActivity)
app.register(GetActivity)
app.register(GetLinks)
app.register(CreateLink)
app.register(GetParticipants)
app.register(CreateInvite)
app.register(UpdateTrip)
app.register(GetTripDetails)
app.register(GetParticipant)

app.listen({ port: env.PORT }).then(() => {
  console.log("Server running!!")
})