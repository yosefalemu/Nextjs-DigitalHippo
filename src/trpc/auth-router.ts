import { AuthCredentialValidator } from "../validators/auth-validators"
import { publicProcedure, router } from "./trpc"
import { getPayloadClient } from "../get-payload"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const authRouter = router({
    createUser: publicProcedure
        .input(AuthCredentialValidator)
        .mutation(async ({ input }) => {
            const { firstName, lastName, userName, email, password } = input
            console.log("input from user", input);

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
            console.log("user found", users);

            if (users.length !== 0) {
                const userNameTaken = users.find(user => user.userName === userName)
                const emailTaken = users.find(user => user.email === email)
                if (userNameTaken) {
                    console.log("User name is taken");
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "username is taken"
                    })
                } else if (emailTaken) {
                    console.log("Email is taken");
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "Email is taken"
                    })
                } else {

                }
            }
            console.log("No user with this credentials");

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

})
