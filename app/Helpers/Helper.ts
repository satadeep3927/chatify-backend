import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Helper{
    public static generateUID() {
        let uniqueId : number;
        while(true) {
            uniqueId = Math.floor(Math.random() * 10**10)
            if(uniqueId.toString().length >= 10) {
                break;
            }
        }

        return uniqueId.toString()
    }

    public static async uploadFile(ctx : HttpContextContract) {
        const coverImage = ctx.request.file('file', {
            extnames: ['jpg', 'png', 'jpeg'],
          })!
          
          await coverImage.moveToDisk('./')
        
          let fileName = coverImage.fileName;

          return fileName || "default.jpg";
          
    }

    public static generateOTP() {
        let otp : number;
        while(true) {
            otp = Math.floor(Math.random() * 10**4)
            if(otp.toString().length >= 4) {
                break;
            }
        }

        return otp.toString()
    }

    public static makeHistoryId(num1, num2) {
        if(num1 > num2) {
            return `${num1}${num2}`
        }
        return `${num2}${num2}`
    }

    public static makePreviewText(text : string) {
        if(text.length <= 27) {
            return text;
        }
        text.slice(0, 25) + '...'
    }
}
