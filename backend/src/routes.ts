import { FastifyInstance } from "fastify";
import { prisma } from "./lib/prisma";
import { z } from "zod";
import dayjs from "dayjs";

export async function appRoutes(app: FastifyInstance) {
  app.post("/habits", async (request, response) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6)),
    });

    try {
      const { title, weekDays } = createHabitBody.parse(request.body);

      const today = dayjs().startOf("day").toDate();

      await prisma.habit.create({
        data: {
          title,
          created_at: today,
          weekDays: {
            create: weekDays.map((weekDay) => ({
              week_day: weekDay,
            })),
          },
        },
      });

      return response.status(201).send({ message: "Success" });
    } catch (error) {
      console.log(error);
    }
  });

  app.get("/day", async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    });

    try {
      const { date } = getDayParams.parse(request.query);
      const parsedDate = dayjs(date).startOf("day");
      const weekDay = dayjs(parsedDate).get("day");

      const possibleHabits = await prisma.habit.findMany({
        where: {
          created_at: {
            lte: date,
          },
          weekDays: {
            some: {
              week_day: weekDay,
            },
          },
        },
      });

      const day = await prisma.day.findUnique({
        where: {
          date: parsedDate.toDate(),
        },
        include: {
          dayHabits: true,
        },
      });

      const completedHabits = day?.dayHabits.map((dayHabit) => {
        return dayHabit.habit_id;
      });

      return {
        possibleHabits,
        completedHabits,
      };
    } catch (error) {
      console.log(error);
    }
  });
}
