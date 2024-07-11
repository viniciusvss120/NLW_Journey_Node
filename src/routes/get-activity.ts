import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs";
import { ClientError } from "../errors/client-error";



export async function GetActivity(app: FastifyInstance) {
  // Usando o withTypeProvider<ZodTypeProvider> podemos validar os dados que vão entrar nessa rota
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/activities',{ 
    schema: {
      params: z.object({
       tripId: z.string().uuid()
      })
    }
  },
  async (request) => {
    const { tripId } = request.params
    const trip = await prisma.trip.findUnique({
     where: { id: tripId},
     include: {
      activities: {
        orderBy: {
          accour_at: 'asc'
        }
      },

    }
    })

    if (!trip) {
      throw new ClientError('Trip not found')
    }

    // Aqui o dayjs vai dizer a diferença de dias entre a data final da trip e a inicial
    const differenceInDayBetweenTripStartAndEnd = dayjs(trip.ends_at).diff(trip.starts_at, 'day')

    // Aqui vamos criar um array onde retornaremos as datas com as atividade correspondentes e de forma agrupada
    const activities = Array.from({ length: differenceInDayBetweenTripStartAndEnd + 1 }).map((_, index) => {
      // aqui o dayjs somou o indice desse array com o primeiro dia, assim incrementando os outros dias
      const date = dayjs(trip.starts_at).add(index, 'days')

      return {
        date: date.toDate(),
        activities: trip.activities.filter(activity => {
          return dayjs(activity.accour_at).isSame(date, 'day')
        })
      }
    })

    return {activities}
    
  })
}