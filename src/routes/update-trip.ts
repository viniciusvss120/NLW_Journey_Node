import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import nodemailer from 'nodemailer'
import z from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { ClientError } from "../errors/client-error";



export async function UpdateTrip(app: FastifyInstance) {
  // Usando o withTypeProvider<ZodTypeProvider> podemos validar os dados que vão entrar nessa rota
  app.withTypeProvider<ZodTypeProvider>().put('/trips/:tripId',{ 
    schema: {
      params: z.object({
        tripId: z.string().uuid()
      }),
      body: z.object({
        destination: z.string().min(4),
        starts_at: z.coerce.date(),
        ends_at: z.coerce.date()
      })
    }
  }, async (request) => {
    const {tripId} = request.params
    const {destination, starts_at, ends_at} = request.body

    const trips = await prisma.trip.findUnique({
      where: { id: tripId}
     })
     
     if(!trips) {
      throw new ClientError('Trip not found')
     }

    if( dayjs(starts_at).isBefore(new Date())){
      throw new ClientError('Invalid trip start date.')
    }
    if( dayjs(ends_at).isBefore(starts_at)){
      throw new ClientError('Invalid trip end date.')
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: {
        destination,
        starts_at,
        ends_at
      }
    })

    return {
      tripId: trips.id
    }
  })
}