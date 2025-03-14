# Deployment Checklist

## Before Deploying

1. **Environment Variables**
   - [ ] Set up the following environment variables in your deployment platform (Vercel, Netlify, etc.):
     ```
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_SECURE=false
     EMAIL_USER=ivannevares9@gmail.com
     EMAIL_PASS=your-app-password
     EMAIL_FROM=ivannevares9@gmail.com
     EMAIL_TO=ivannevares9@gmail.com
     ```

2. **Dependencies**
   - [ ] Make sure `nodemailer` is in your package.json
   - [ ] Run `npm install` to ensure all dependencies are installed

3. **File Upload Limits**
   - [ ] Check your hosting provider's limits for serverless functions
   - [ ] Vercel has a 4.5MB limit for API routes
   - [ ] Consider adding client-side file size validation if needed

## After Deploying

1. **Test the Form**
   - [ ] Fill out the form with test data
   - [ ] Upload small test files (under 1MB)
   - [ ] Check that you receive the email correctly
   - [ ] Verify that file attachments work
   - [ ] Test the reply functionality

2. **Common Issues & Solutions**

   - **Email Not Sending**
     - Check if environment variables are set correctly
     - Verify that your App Password is correct
     - Look at server logs for error messages

   - **File Upload Issues**
     - Check if file size exceeds platform limits
     - Verify that the form has `encType="multipart/form-data"`
     - Try with smaller files first

   - **CORS Errors**
     - Usually not an issue with same-origin API routes
     - If using a separate API, ensure CORS headers are set

3. **Performance Optimization**
   - [ ] Consider adding client-side file compression if large uploads are common
   - [ ] Add file type validation if specific formats are required

## Maintenance

- Periodically check that the email functionality still works
- Google may require you to update App Passwords occasionally
- Keep nodemailer updated to the latest version

## Scaling Considerations

If your form becomes heavily used:
- Consider using a dedicated email service like SendGrid or Mailgun
- For large file uploads, consider direct uploads to cloud storage (AWS S3, Cloudinary)
- Add rate limiting to prevent abuse 