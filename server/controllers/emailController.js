const transporter = require('../config/emailConfig');

// ============================================
// CONTACT FORM - YOUR EXISTING CODE (UNCHANGED)
// ============================================
exports.sendContactEmail = async (req, res) => {
  console.log('\n📨 Incoming Contact Request:', req.body);

  try {
    const {
      name,
      firstName,
      lastName,
      email,
      phone,
      contact,
      subject,
      message
    } = req.body;

    // The site has two contact forms with different field names
    // (full Contact page sends name/phone, the Careers page section
    // sends firstName+lastName/contact) — normalize both here.
    const fullName = name || [firstName, lastName].filter(Boolean).join(' ');
    const phoneNumber = phone || contact;

    // ✅ validation
    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, Email and Message are required"
      });
    }

    // ✅ EMAIL TO YOU
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: subject ? `New Contact from ${fullName}: ${subject}` : `New Contact from ${fullName}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phoneNumber || 'N/A'}</p>
        ${subject ? `<p><b>Subject:</b> ${subject}</p>` : ''}
        <p><b>Message:</b></p>
        <p>${message}</p>
      `
    });

    // ✅ CONFIRMATION TO USER
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "We received your message",
      html: `
        <h3>Hi ${fullName},</h3>
        <p>Thanks for contacting us. We'll reply within 24 hours.</p>
      `
    });

    console.log('✅ Emails sent successfully');

    res.json({
      success: true,
      message: "Message sent successfully!"
    });

  } catch (err) {
    console.error('❌ Email Error:', err);
    res.status(500).json({
      success: false,
      error: "Failed to send email"
    });
  }
};

// ============================================
// JOB APPLICATION - NEW CODE (ADDED)
// ============================================
exports.sendJobApplication = async (req, res) => {
  console.log('\n📨 Incoming Job Application:', req.body);

  try {
    const { 
      fullName, 
      email, 
      phone, 
      role, 
      coverLetter, 
      experience, 
      portfolio, 
      linkedin, 
      expectedSalary, 
      noticePeriod 
    } = req.body;
    
    const resume = req.file;

    // Validation
    if (!fullName || !email || !phone || !role || !coverLetter) {
      return res.status(400).json({
        success: false,
        error: "Name, Email, Phone, Role and Cover Letter are required"
      });
    }

    // ============================================
    // 1. EMAIL TO COMPANY (with all details + attachment)
    // ============================================
    const companyMailOptions = {
      from: `"Career Application" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `📌 New Job Application: ${role} - ${fullName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>New Job Application</title>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h2 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            .info-block { margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px; }
            .info-item { margin: 10px 0; }
            .label { font-weight: bold; color: #0f172a; width: 140px; display: inline-block; }
            .value { color: #475569; }
            hr { border: none; border-top: 1px solid #e2e8f0; margin: 15px 0; }
            .footer { margin-top: 20px; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>📋 New Job Application Received</h2>
            
            <div class="info-block">
              <h3>👤 Applicant Information</h3>
              <div class="info-item"><span class="label">Full Name:</span> <span class="value">${fullName}</span></div>
              <div class="info-item"><span class="label">Email:</span> <span class="value">${email}</span></div>
              <div class="info-item"><span class="label">Phone:</span> <span class="value">${phone}</span></div>
              <div class="info-item"><span class="label">Position:</span> <span class="value">${role}</span></div>
              <div class="info-item"><span class="label">Experience:</span> <span class="value">${experience || 'Not specified'}</span></div>
              <div class="info-item"><span class="label">Expected Salary:</span> <span class="value">${expectedSalary || 'Not specified'}</span></div>
              <div class="info-item"><span class="label">Notice Period:</span> <span class="value">${noticePeriod || 'Not specified'}</span></div>
              ${portfolio ? `<div class="info-item"><span class="label">Portfolio:</span> <span class="value"><a href="${portfolio}" target="_blank">${portfolio}</a></span></div>` : ''}
              ${linkedin ? `<div class="info-item"><span class="label">LinkedIn:</span> <span class="value"><a href="${linkedin}" target="_blank">${linkedin}</a></span></div>` : ''}
            </div>
            
            <div class="info-block">
              <h3>📝 Cover Letter</h3>
              <p style="white-space: pre-wrap;">${coverLetter}</p>
            </div>
            
            <div class="info-block">
              <h3>📎 Attachments</h3>
              <p>Resume/CV is attached to this email: <strong>${resume ? resume.originalname : 'No file attached'}</strong></p>
            </div>
            
            <hr />
            <div class="footer">
              <p>This application was submitted from the Careers page.</p>
              <p>© ${new Date().getFullYear()} All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: resume ? [{
        filename: resume.originalname,
        content: resume.buffer,
        contentType: resume.mimetype
      }] : []
    };

    await transporter.sendMail(companyMailOptions);
    console.log('✅ Email sent to company');

    // ============================================
    // 2. CONFIRMATION EMAIL TO APPLICANT
    // ============================================
    const applicantMailOptions = {
      from: `"Careers Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Application Received: ${role}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Application Confirmation</title>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 20px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; }
            h2 { color: #2563eb; margin-top: 0; }
            .footer { margin-top: 20px; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Application Received</h1>
            </div>
            <div class="content">
              <h2>Dear ${fullName},</h2>
              <p>Thank you for applying for the <strong>${role}</strong> position.</p>
              <p>We have successfully received your application. Our HR team will review your profile and get back to you within <strong>5-7 business days</strong>.</p>
              
              <div style="background: #e2e8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>📋 Application Summary:</strong></p>
                <p style="margin: 5px 0; font-size: 14px;">Position: ${role}</p>
                <p style="margin: 5px 0; font-size: 14px;">Experience: ${experience || 'Not specified'}</p>
                <p style="margin: 5px 0; font-size: 14px;">Application Date: ${new Date().toLocaleDateString()}</p>
              </div>
              
              <p>If you have any questions, feel free to reach out to us.</p>
              <p>We wish you the best of luck!</p>
              <p>Best regards,<br><strong>The Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(applicantMailOptions);
    console.log('✅ Confirmation email sent to applicant');

    res.json({
      success: true,
      message: "Application submitted successfully!"
    });

  } catch (err) {
    console.error('❌ Email Error:', err);
    res.status(500).json({
      success: false,
      error: "Failed to submit application. Please try again."
    });
  }
};