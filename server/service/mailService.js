import nodemailer from 'nodemailer';
class MailSerivce {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.yandex.ru",
            port: 465,
            secure: true,
            auth: {
              user: "KittenBOT",
              pass: "ueljspcvmlxepbox"
            }
          });
    }
    async sendActivationLink(to, link, next) {
        await this.transporter.sendMail({
            from: "KittenBOT@yandex.ru",
            to: to,
            subject: 'Активируйте свой аккаунт на: ' + process.env.API_URL,
            text: '',
            html:
                `
                <div>
                    <h1>Для активации перейдите по сыллке</h1>
                    <a href="${link}">${link}</a>
                </div>
                `
        })
    }
}

export default new MailSerivce();