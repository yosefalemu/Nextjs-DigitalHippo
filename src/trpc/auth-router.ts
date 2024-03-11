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
            console.log("input in the auth router", token);
            const payload = await getPayloadClient()

            const isVerified = await payload.verifyEmail({
                collection: 'users',
                token,
            })
            console.log("is verified in the authrounter", isVerified);

            if (!isVerified)
                throw new TRPCError({ code: 'UNAUTHORIZED' })

            return { success: true }
        }),
    signIn: publicProcedure
        .input(SignInCredentialValidator)
        .mutation(async ({ input, ctx }) => {
            const { email, password } = input
            console.log("email", email);
            console.log("password", password);
            const { res } = ctx
            console.log("response in auth router", res);
            const payload = await getPayloadClient()
            const { docs: registerUser } = await payload.find({
                collection: "users",
                where: {
                    email: {
                        equals: email
                    }
                }
            })
            console.log("register user", registerUser);
            console.log("New");

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
