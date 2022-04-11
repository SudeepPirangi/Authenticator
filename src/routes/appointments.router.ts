import express from "express";

import { createAppointment, cancelAppointment, rescheduleAppointment } from "../controllers/appointments.controller";

const appointmentsRouter = express.Router();

appointmentsRouter.get("/create-appointment", createAppointment);
appointmentsRouter.put("/cancel-appointment", cancelAppointment);
appointmentsRouter.put("/reschedule-appointment", rescheduleAppointment);

export default appointmentsRouter;
