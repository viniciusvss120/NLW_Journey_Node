import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import nodemailer from 'nodemailer'
import z from "zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs";
import { ClientError } from "../errors/client-error";



export async function CreateLink(app: FastifyInstance) {
  // Usando o withTypeProvider<ZodTypeProvider> podemos validar os dados que vão entrar nessa rota
  app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/links',{ 
    schema: {
      params: z.object({
       tripId: z.string().uuid()
      }),
      body: z.object({
        title: z.string().min(4),
        url: z.string().url()
      })
    }
  },
  async (request) => {
    const { tripId } = request.params
    const { title, url } = request.body
    const trip = await prisma.trip.findUnique({
     where: { id: tripId}
    })

    if (!trip) {
      throw new ClientError('Trip not found')
    }

    

    const link = await prisma.link.create({
      data: {
        title,
        url,
        trip_id: tripId
      }
    })
    return {
      linkId: link.id
    }
  })
}