import mongoose from "mongoose";

const AppointmentsSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  doctorId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
    required: false,
  },
  commMode: {
    type: String,
    required: true,
  },
});

export default AppointmentsSchema;

// id; auto-generated
// patient_id;
// doctor_Id;
// status [booked/cancelled];
// day;
// date;
// time;
// comments;
// comm_mode;
// created;
// updated;
