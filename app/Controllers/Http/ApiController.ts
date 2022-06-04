import Mail from '@ioc:Adonis/Addons/Mail';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Helper from 'App/Helpers/Helper'
import Message from 'App/Models/Message';
import User from 'App/Models/User';

export default class ApiController {
    public async login(ctx : HttpContextContract) {
        let {email, password} = ctx.request.all();

        let userData = await User.query().where({
            email,
            password
        }).first();

        if(userData === null) {
            return {
                status: 400,
                message: "Wrong Cradential!"
            }
        }
        if(!userData.is_verified) {
            let otp = Helper.generateOTP();
            let name = userData.name;
            let email = userData.email
            await Mail.send((message) => {
                message
                  .from('support@chatify.com')
                  .to(email)
                  .subject('Email Verification')
                  .htmlView('verification', { otp, name})
              })
            return {
                message: 201,
                id : userData.id,
                otp: otp

            }
        }
        return {
            status: 200,
            userData
        };
    }

    public async register(ctx : HttpContextContract) {
        let {name, email, password} = ctx.request.all();

        let username = Helper.generateUID();
        let avatar = await Helper.uploadFile(ctx);
        let otp = Helper.generateOTP()

        let userData = await User.create({name, username, email, avatar, password})

        await Mail.send((message) => {
            message
              .from('support@chatify.com')
              .to(email)
              .subject('Email Verification')
              .htmlView('verification', { otp, name})
          })

        return {
            id: userData.id,
            otp
        };
    }
    public async users(ctx : HttpContextContract) {
        let id = ctx.request.params().id;

        let userDetails = await User.find(id);

        return userDetails
    }
    public async postMessageToUsername( ctx : HttpContextContract) {
        let {username, message, sender_id} = ctx.request.all();

        let user = await User.query().where('username', username).first();

        if(user === null) {
            return {
                status : 400,
                message : "Username doesn't exist"
            }
        }

        await Message.create({
            sender_id,
            recipient_id: user.id,
            message
        })

        return {
            status: 200,
            message : "Message sent!"
        }
    }

    public async verify(ctx : HttpContextContract) {
        let id = ctx.request.params().id;

        await User.query().update({
            is_verified: true
        });

        let userDetails = await User.find(id);

        return userDetails;
    }

    public async messages(ctx : HttpContextContract) {
        type messageType = {
            recipient_id : number,
            name : string,
            time : string,
            message: string | undefined,
            avatar : string
        }
        let id = ctx.request.params().id;

        let history : string[] = []
        let resultData : messageType[] = [];

        let messagesForUser = await Message.query().where('user_id', id).orWhere('recipient_id', id).orderBy('id', 'desc').preload('recipient').preload('sender');

        messagesForUser.forEach((message) => {
            let historyId = Helper.makeHistoryId(message.recipient_id, message.sender_id);

            if(history.includes(historyId)) {
                return false;
            }
            history = [...history, historyId]
            if(message.sender_id === id) {
                let tmpData = {
                    recipient_id: message.recipient_id,
                    name : message.recipient.name,
                    time : message.createdAt.toFormat("HH:mm"),
                    message : Helper.makePreviewText(message.message),
                    avatar : message.recipient.avatar
                }
                resultData = [...resultData, tmpData]
            }
            else if(message.recipient_id === id) {
                let tmpData = {
                    recipient_id: message.sender_id,
                    name : message.sender.name,
                    time : message.createdAt.toFormat("HH:mm"),
                    message : Helper.makePreviewText(message.message),
                    avatar : message.sender.avatar
                }
                resultData = [...resultData, tmpData]
            }
        })
        
        return resultData

    }
    public async getChats(ctx : HttpContextContract) {
        let {sender_id, recipient_id} = ctx.request.params()

        let messages = Message.query().where({sender_id, recipient_id})

        return messages;
    }

    public async postMessage(ctx : HttpContextContract) {
        let messageData = ctx.request.all()

        await Message.create(messageData);

        return {status: 200, message: "Message Sent!"}
    }
}
