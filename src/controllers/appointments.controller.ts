import { Request, Response } from "express";

import { Appointments } from "../util/mongoose";
import { queryDB } from "../helpers/queryDB";

export const createAppointment = async (req: Request, res: Response) => {
  console.log("create appointment controller");

  const data = {
    patientId: "pat1",
    doctorId: "doc20",
    status: "booked",
    date: new Date(),
    day: "sunday",
    time: "12.30",
    comments: "",
    commMode: "phone",
  };
  let Appointment = new Appointments(data);
  let newAppointment = await queryDB(Appointment.save(), `Save Appointment`);
  newAppointment = JSON.parse(JSON.stringify(newAppointment));
  return res.json(newAppointment);
};

export const cancelAppointment = async (req: Request, res: Response) => {
  const appointmentId = req.body?.appointmentId;
  const reason = req.body?.reason;
  console.log("cancel appointment controller", appointmentId, reason);
  if (!appointmentId || appointmentId.length === 0) {
    return res.json({
      status: 400,
      message: `Cancel appointment failed. Appointment Id is missing`,
      data: null,
    });
  } else if (!reason || reason.length === 0) {
    return res.json({
      status: 400,
      message: `Cancel appointment failed. Reason is missing`,
      data: null,
    });
  } else {
    let appointment = await queryDB(Appointments.findById(appointmentId), `Get appointments by Id ${appointmentId}`);
    appointment = JSON.parse(JSON.stringify(appointment));
    // console.log("appointment", appointment);
    if (appointment && appointment.status === "booked") {
      const commonData = { status: "free", date: null, day: "", time: "", comments: reason };
      let updatedApptResponse = await queryDB(Appointments.findByIdAndUpdate(appointmentId, commonData), `Update appointment for ${appointmentId}`);
      if (updatedApptResponse) {
        return res.json({
          status: "Success",
          message: `Appointment Cancelled for id ${appointmentId}`,
          data: appointmentId,
        });
      } else {
        return res.json({
          status: 400,
          message: `Cancel appointment failed. Appointment doesn't exist / not in booked status`,
          data: null,
        });
      }
    } else {
      return res.json({
        status: 400,
        message: `Cancel appointment failed. Appointment doesn't exist / not in booked status`,
        data: null,
      });
    }
  }
};

export const rescheduleAppointment = async (req: Request, res: Response) => {
  const appointmentId = req.body?.appointmentId;
  const newDate = req.body?.newDate;
  const newDay = req.body?.newDay;
  const newTime = req.body?.newTime;
  const commMode = req.body?.commMode;

  let flag = true;
  if (!appointmentId || appointmentId.length === 0) flag = false;
  if (newDate.length === 0 || newDay.length === 0 || newTime.length === 0 || commMode.length === 0) flag = false;
  if (!flag) {
    return res.json({
      status: 400,
      message: `Re-scheduling appointment failed. Invalid data passed`,
      data: {
        appointmentId,
        newDate,
        newDay,
        newTime,
        commMode,
      },
    });
  }

  try {
    const commonData = { status: "booked", date: newDate, day: newDay, time: newTime, commMode };
    await queryDB(Appointments.findByIdAndUpdate(appointmentId, commonData), `Rescheduling appointment for ${appointmentId}`);
    const newAppointment = await queryDB(Appointments.findById(appointmentId), `Find appointment by id ${appointmentId}`);

    return res.json({
      status: "Success",
      message: `Appointment Re-scheduled to ${newDate}`,
      data: newAppointment,
    });
  } catch (error) {
    return res.json({
      status: 400,
      message: `Re-scheduling appointment failed for the appointment id ${appointmentId}`,
      data: error,
    });
  }
};
