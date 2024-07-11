import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { ClientError } from "../errors/client-error";



export async function CreateActivity(app: FastifyInstance) {
  // Usando o withTypeProvider<ZodTypeProvider> podemos validar os dados que vão entrar nessa rota
  app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/activities',{ 
    schema: {
      params: z.object({
       tripId: z.string().uuid()
      }),
      body: z.object({
        title: z.string().min(4),
        accour_at: z.coerce.date()
      })
    }
  },
  async (request) => {
    const { tripId } = request.params
    const { title, accour_at } = request.body
    const trip = await prisma.trip.findUnique({
     where: { id: tripId}
    })

    if (!trip) {
      throw new ClientError('Trip not found')
    }

    if(dayjs(accour_at).isBefore(trip.starts_at)) {
      throw new ClientError('Invalid activity date')
    }

    if(dayjs(accour_at).isAfter(trip.ends_at)){
      throw new ClientError('Invalid activity date')
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        accour_at,
        trip_id: tripId
      }
    })
    return {
      activityId: activity.id
    }
  })
}