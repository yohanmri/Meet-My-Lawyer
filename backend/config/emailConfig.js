import nodemailer from 'nodemailer';

export const sendWelcomeEmail = async (recipientEmail, recipientName, password) => {
    try {
        // Create transporter inside the function
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: 'Welcome to MML - Your Account Has Been Approved!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Welcome to MML, ${recipientName}!</h2>
                    <p>Your lawyer application has been approved. You can now sign in to your account.</p>
                    <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Your Login Credentials:</strong></p>
                        <p>Email: ${recipientEmail}</p>
                        <p>Password: ${password}</p>
                    </div>
                    <p style="color: red;"><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
                    <p>Sign in here: <a href="http://localhost:5174/lawyer-login">Lawyer Login</a></p>
                    <br>
                    <p>Best regards,<br>MML Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent successfully to:', recipientEmail);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        console.error('Full error:', error);
        return false;
    }
};