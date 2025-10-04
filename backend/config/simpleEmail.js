import * as brevo from '@getbrevo/brevo';

// Configure Brevo API
let apiInstance = new brevo.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

export const sendApprovalEmail = async (recipientEmail, recipientName, password) => {
    console.log('Sending approval email to:', recipientEmail);
    
    let sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = "Welcome to MML - Your Account Has Been Approved";
    sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to MML, ${recipientName}!</h2>
            <p style="font-size: 16px; color: #555;">
                Your lawyer application has been approved. You can now sign in to your account using the credentials below.
            </p>
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong>Email:</strong> ${recipientEmail}</p>
                <p style="margin: 10px 0;"><strong>Password:</strong> ${password}</p>
            </div>
            <p style="color: #d9534f; font-size: 14px;">
                <strong>Important:</strong> Please change your password after your first login for security purposes.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:5174/lawyer-login" 
                   style="background-color: #007bff; color: white; padding: 12px 30px; 
                          text-decoration: none; border-radius: 5px; display: inline-block;">
                    Sign In to Your Account
                </a>
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="font-size: 14px; color: #888;">
                Best regards,<br>
                MML Team
            </p>
        </div>
    `;
    sendSmtpEmail.sender = { 
        name: "MML Team", 
        email: process.env.EMAIL_USER || "noreply@mml.com" 
    };
    sendSmtpEmail.to = [
        { email: recipientEmail, name: recipientName }
    ];
    
    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Approval email sent successfully to:', recipientEmail);
        return true;
    } catch (error) {
        console.error('❌ Error sending approval email:', error.response?.body || error.message);
        // Still log to console as backup
        console.log('=================================');
        console.log('APPLICATION APPROVED - EMAIL DETAILS (FALLBACK)');
        console.log('To:', recipientEmail);
        console.log('Name:', recipientName);
        console.log('Password:', password);
        console.log('Login URL: http://localhost:5174/lawyer-login');
        console.log('=================================');
        return false;
    }
};

export const sendRejectionEmail = async (recipientEmail, recipientName) => {
    console.log('Sending rejection email to:', recipientEmail);
    
    let sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = "MML Application Status";
    sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Application Status Update</h2>
            <p style="font-size: 16px; color: #555;">
                Dear ${recipientName},
            </p>
            <p style="font-size: 16px; color: #555;">
                Thank you for your interest in joining MML. After careful review of your application, 
                we regret to inform you that we are unable to approve your application at this time.
            </p>
            <p style="font-size: 16px; color: #555;">
                We appreciate the time you took to apply and encourage you to reapply in the future 
                if your circumstances change.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="font-size: 14px; color: #888;">
                Best regards,<br>
                MML Team
            </p>
        </div>
    `;
    sendSmtpEmail.sender = { 
        name: "MML Team", 
        email: process.env.EMAIL_USER || "noreply@mml.com" 
    };
    sendSmtpEmail.to = [
        { email: recipientEmail, name: recipientName }
    ];
    
    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Rejection email sent successfully to:', recipientEmail);
        return true;
    } catch (error) {
        console.error('❌ Error sending rejection email:', error.response?.body || error.message);
        // Still log to console as backup
        console.log('=================================');
        console.log('APPLICATION REJECTED - EMAIL DETAILS (FALLBACK)');
        console.log('To:', recipientEmail);
        console.log('Name:', recipientName);
        console.log('=================================');
        return false;
    }
};