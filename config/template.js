import GLOBALS from "./constant.js";

const contactUsInquiry = async (result) => {
  const template = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>${GLOBALS.APP_NAME} - Contact Us Inquiry</title>
        <style>
          .highlight {
            font-weight: bold;
            background: linear-gradient(90deg, #7e22ce, #e879f9, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
          }
        </style>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); padding: 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
          
            <span style="font-size: 24px; font-weight: bold; color: #7e22ce;">FastTry</span>
          </div>

          <h2 style="color: #7e22ce;">📩 New Contact Us Inquiry</h2>
          <p style="font-size: 16px; color: #333;">Hello Admin,</p>
  
          <p style="font-size: 15px; color: #555;">
            You have received a new message from the Contact Us form on <strong>${GLOBALS.APP_NAME}</strong>:
          </p>
  
          <table style="width: 100%; margin-top: 20px; font-size: 15px;">
            <tr>
              <td style="padding: 5px 0;"><strong>Subject:</strong></td>
              <td>${result.subject || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;"><strong>Description:</strong></td>
              <td>${result.description || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;"><strong>Full Name:</strong></td>
              <td>${result.full_name || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;"><strong>Email:</strong></td>
              <td>${result.email || "N/A"}</td>
            </tr>
          </table>
  
          <p style="margin-top: 30px; font-size: 14px; color: #888;">© ${new Date().getFullYear()} FastTry. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
  return template;
};
export default {
  contactUsInquiry
}