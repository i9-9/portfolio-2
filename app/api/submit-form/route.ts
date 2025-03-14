import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Readable } from 'stream';

// Define the attachment type
interface Attachment {
  filename: string;
  content: Buffer;
}

export async function POST(req: NextRequest) {
  try {
    // Get form data from the request
    const formData = await req.formData();
    
    // Extract text fields
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const businessName = formData.get('businessName') as string;
    const socialMedia = formData.get('socialMedia') as string;
    const location = formData.get('location') as string;
    const industry = formData.get('industry') as string;
    const purpose = formData.get('purpose') as string;
    const audience = formData.get('audience') as string;
    const values = formData.get('values') as string;
    const motivation = formData.get('motivation') as string;
    const revenue = formData.get('revenue') as string;
    const budget = formData.get('budget') as string;
    const additional = formData.get('additional') as string;
    
    // Extract file fields
    const visualReferencesFile = formData.get('visualReferences') as File | null;
    const currentLogoFile = formData.get('currentLogo') as File | null;
    
    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // Prepare email attachments
    const attachments: Attachment[] = [];
    
    if (visualReferencesFile && visualReferencesFile.size > 0) {
      const buffer = Buffer.from(await visualReferencesFile.arrayBuffer());
      attachments.push({
        filename: visualReferencesFile.name,
        content: buffer,
      });
    }
    
    if (currentLogoFile && currentLogoFile.size > 0) {
      const buffer = Buffer.from(await currentLogoFile.arrayBuffer());
      attachments.push({
        filename: currentLogoFile.name,
        content: buffer,
      });
    }
    
    // Generate HTML email content
    const htmlContent = `
      <h1>New Brand Form Submission</h1>
      <h2>Contact Information</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Business Name:</strong> ${businessName}</p>
      <p><strong>Social Media:</strong> ${socialMedia || 'Not provided'}</p>
      <p><strong>Location:</strong> ${location}</p>
      
      <h2>Business Details</h2>
      <p><strong>Industry/Offering:</strong> ${industry}</p>
      <p><strong>Brand Purpose:</strong> ${purpose || 'Not provided'}</p>
      <p><strong>Target Audience:</strong> ${audience || 'Not provided'}</p>
      <p><strong>Brand Values/Emotions:</strong> ${values || 'Not provided'}</p>
      
      <h2>Project Information</h2>
      <p><strong>Motivation for Brand Identity Change:</strong> ${motivation}</p>
      <p><strong>Monthly Revenue:</strong> ${revenue || 'Not provided'}</p>
      <p><strong>Branding Budget:</strong> ${budget}</p>
      
      <h2>Additional Information</h2>
      <p>${additional || 'No additional information provided.'}</p>
      
      <h2>Files</h2>
      <p><strong>Visual References:</strong> ${visualReferencesFile ? 'Attached' : 'Not provided'}</p>
      <p><strong>Current Logo:</strong> ${currentLogoFile ? 'Attached' : 'Not provided'}</p>
    `;
    
    // Send email
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_FROM || 'your-website@example.com'}>`,
      replyTo: email,
      to: process.env.EMAIL_TO || 'your-email@example.com',
      subject: `Brand Form: ${name} (${email}) - ${businessName}`,
      text: `New brand form submission from ${name} (${email}) for business: ${businessName}\n\nContact them directly by replying to this email or at: ${email}`,
      html: htmlContent,
      attachments,
    });
    
    return NextResponse.json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit form', error: (error as Error).message },
      { status: 500 }
    );
  }
} 