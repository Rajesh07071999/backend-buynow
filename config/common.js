import GLOBALS from "./constant.js";
import nodemailer from 'nodemailer';
const common = {
  async checkUniqueEmail(email,model) {
    try {
      const user = await model.findOne({
        email: email,
      });

      if (user != null) {
        return true;
      }

      return false;
    } catch (error) {
      return error;
    }
  },
  async checkUniqueMobile(mobilenumber,model) {
    try {
      const user = await model.findOne({
        phone:mobilenumber,
      });

      if (user != null) {
        return true;
      }
      return false;
    } catch (error) {
      return error;
    }
  },
  async singleInsert(data, tableName) {
    try {
      const result = await tableName.create(data);
      return result;
    } catch (error) {
      throw error;
    }
  },
  async singleUpdate(data, model, whereCondition) {
    
    try {
      const result = await model.updateOne(whereCondition, data);
      return result;
    } catch (error) {
      throw error;
    }
  },
  async singleDelete(model, whereCondition) {
    try {
      const result = await model.deleteOne(whereCondition);
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }
  
,  
  async singleGet(tableName, condition) {
    try {
      const record = await tableName.findOne(condition);
      return record ? record : null;
    } catch (error) {
      throw error;
    }
  },
  async sendEmail(toEmail, sub, message) {
    try {
      const transporter = nodemailer.createTransport({
        host: GLOBALS.HOST_NAME,
        port: 587,
        secure: false,
        auth: {
          user: GLOBALS.EMAIL_ID,
          pass: GLOBALS.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: GLOBALS.EMAIL_ID,
        to: toEmail,
        subject: sub,
        html: message,
        replyTo: toEmail,
      };
     

      const response = await transporter.sendMail(mailOptions);

      if (response) {
        return true;
      }
      else {
        return false
      }
    } catch (error) {
      return error;
    }
  },
};

export default common;
