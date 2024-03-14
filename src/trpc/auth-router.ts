import { SignUpCredentialValidator } from "../validators/signup-validators"
import { publicProcedure, router } from "./trpc"
import { getPayloadClient } from "../get-payload"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { SignInCredentialValidator } from "../validators/signin-validators"

export const authRouter = router({
    createUser: publicProcedure
        .input(SignUpCredentialValidator)
        .mutation(async ({ input }) => {
            const { firstName, lastName, userName, email, password } = input
            const payload = await getPayloadClient()
            const { docs: users } = await payload.find({
                collection: "users",
                where: {
                    or: [
                        {
                            userName: {
                                equals: userName
                            }
                        },
                        {
                            email: {
                                equals: email
                            }
                        }
                    ]
                }
            })
            if (users.length !== 0) {
                const userNameTaken = users.find(user => user.userName === userName)
                const emailTaken = users.find(user => user.email === email)
                if (userNameTaken) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "username is taken"
                    })
                } else if (emailTaken) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "Email is taken"
                    })
                } else {

                }
            }
            await payload.create({
                collection: "users",
                data: {
                    firstName,
                    lastName,
                    userName,
                    email,
                    password,
                    role: "user"
                }
            })
            return { success: true, sentToEmail: email }
        }),
    verifyEmail: publicProcedure
        .input(z.object({ token: z.string() }))
        .query(async ({ input }) => {
            const { token } = input
            const payload = await getPayloadClient()

            const isVerified = await payload.verifyEmail({
                collection: 'users',
                token,
            })
            if (!isVerified)
                throw new TRPCError({ code: 'UNAUTHORIZED' })

            return { success: true }
        }),
    signIn: publicProcedure
        .input(SignInCredentialValidator)
        .mutation(async ({ input, ctx }) => {
            const { email, password } = input
            const { res } = ctx
            const payload = await getPayloadClient()
            const { docs: registerUser } = await payload.find({
                collection: "users",
                where: {
                    email: {
                        equals: email
                    }
                }
            })
            if (registerUser?.length === 0) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid email"
                })
            }
            try {
                await payload.login({
                    collection: "users",
                    data: {
                        email,
                        password
                    },
                    res
                })

            } catch (error) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Incorrect password"
                })
            }
            return { success: true }
        })
})
