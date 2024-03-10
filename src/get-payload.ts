import dotenv from "dotenv"
import path from "path"
import payload, { Payload } from "payload"
import type { InitOptions } from "payload/config"
// import nodemailer from 'nodemailer'
const nodemailer = require("nodemailer");

dotenv.config({
    path: path.resolve(__dirname, "../.env")
})

// const transporter = nodemailer.createTransport({
//     service: process.env.SERVICE,
//     host: process.env.HOST,
//     port: process.env.EMAILPORT,
//     secure: process.env.SECURE,
//     auth: {
//         user: process.env.SENDER,
//         pass: process.env.PASS,
//     },
// });

let cached = (global as any).payload

if (!cached) {
    cached = (global as any).payload = {
        client: null,
        promise: null
    }
}

interface Args {
    initOptions?: Partial<InitOptions>
}
export const getPayloadClient = async ({ initOptions }: Args = {}): Promise<Payload> => {
    if (!process.env.PAYLOAD_SECRET) {
        throw new Error("Secret is missing")
    }
    if (cached.client) {
        return cached.client
    }
    if (!cached.promise) {
        cached.promise = payload.init({
            email: {
                transportOptions: {
                    host: process.env.SMTP_HOST,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                    port: Number(process.env.SMTP_HOST),
                    secure: Number(process.env.SMTP_PORT) === 465,
                    requireTLS: true,
                },
                fromName: 'Digital Hippo',
                fromAddress: "yosephalemu6607@gmail.com",
            },
            secret: process.env.PAYLOAD_SECRET,
            local: initOptions?.express ? false : true,
            ...(initOptions || {}),
        })
    }
    try {
        cached.client = cached.promise
    } catch (error: unknown) {
        cached.promise = null
        throw error
    }
    return cached.client
}