const cron = require('node-cron');
const Appointment = require('../models/appointment.model');
const DailySchedule = require('../models/dailySchedule.model');

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    // console.log("Running pending appointment cleanup...");
    
    // Find appointments pending for more than 15 minutes
    const expirationTime = new Date(Date.now() - 15 * 60 * 1000);
    
    try {
        const abandonedAppointments = await Appointment.find({
            paymentStatus: 'PENDING',
            createdAt: { $lt: expirationTime }
        });

        for (let appt of abandonedAppointments) {
            // 1. Mark as failed
            appt.paymentStatus = 'FAILED';
            await appt.save();

            // 2. Release the slot
            const normalizedDate = new Date(appt.dateOfAppointment);
            normalizedDate.setHours(0, 0, 0, 0);
            
            await DailySchedule.findOneAndUpdate(
                { doctor: appt.doctor, date: normalizedDate },
                { $inc: { bookedCount: -1 } }
            );
            // console.log(`Released slot for abandoned appointment: ${appt._id}`);
        }
    } catch (err) {
        console.error("Error in cron job:", err);
    }
});