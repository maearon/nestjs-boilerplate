import { Injectable } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import * as nodemailer from "nodemailer"

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransporter({
      host: this.configService.get("SMTP_HOST", "localhost"),
      port: this.configService.get("SMTP_PORT", 587),
      secure: false,
      auth: {
        user: this.configService.get("SMTP_USER"),
        pass: this.configService.get("SMTP_PASS"),
      },
    })
  }

  async sendAccountActivation(user: any, token: string) {
    const activationUrl = `${this.configService.get("APP_URL")}/account_activations/${token}/edit?email=${encodeURIComponent(user.email)}`

    await this.transporter.sendMail({
      from: this.configService.get("FROM_EMAIL", "noreply@example.com"),
      to: user.email,
      subject: "Account activation",
      html: `
        <h1>Sample app</h1>
        <p>Hi ${user.name},</p>
        <p>Welcome to the Sample App! Click on the link below to activate your account:</p>
        <a href="${activationUrl}">Activate</a>
      `,
    })
  }

  async sendPasswordReset(user: any, token: string) {
    const resetUrl = `${this.configService.get("APP_URL")}/password_resets/${token}/edit?email=${encodeURIComponent(user.email)}`

    await this.transporter.sendMail({
      from: this.configService.get("FROM_EMAIL", "noreply@example.com"),
      to: user.email,
      subject: "Password reset",
      html: `
        <h1>Password reset</h1>
        <p>To reset your password click the link below:</p>
        <a href="${resetUrl}">Reset password</a>
        <p>This link will expire in two hours.</p>
        <p>If you did not request your password to be reset, please ignore this email and your password will stay as it is.</p>
      `,
    })
  }
}
