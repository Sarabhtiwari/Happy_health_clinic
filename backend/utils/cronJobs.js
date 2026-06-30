const cron = require('node-cron');
const Appointment = require('../models/appointment.model');
const DailySchedule = require('../models/dailySchedule.model');

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    
    // ============================================================================
    // ARCHITECTURE NOTE (v2.0): 
    // Online Khalti payments are currently bypassed in favor of "Pay at Clinic".
    // Therefore, PENDING appointments are valid and should NOT be expired.
    // This cleanup job is temporarily disabled to prevent deleting valid bookings.
    // ============================================================================
    
    console.log("Cron Job Skipped: Payment session cleanup disabled for 'Pay at Clinic' mode.");

    /* --- OLD KHALTI CLEANUP LOGIC ---
    
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
    
    ----------------------------------- */
});