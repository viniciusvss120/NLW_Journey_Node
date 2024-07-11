import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs";
import { ClientError } from "../errors/client-error";



export async function GetLinks(app: FastifyInstance) {
  // Usando o withTypeProvider<ZodTypeProvider> podemos validar os dados que vão entrar nessa rota
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/links',{ 
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
      links: true
      },
    })

    if (!trip) {
      throw new ClientError('Trip not found')
    }

    

    return {links: trip.links}
    
  })
}