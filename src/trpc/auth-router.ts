import { AuthCredentialValidator } from "@/validators/auth-validators"
import { publicProcedure, router } from "./trpc"
import { getPayloadClient } from "@/get-payload"
import { TRPCError } from "@trpc/server"

export const authRouter = router({
    createUser: publicProcedure
        .input(AuthCredentialValidator)
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
                throw new TRPCError({ code: "CONFLICT" })
            }

            await payload.create({
                collection: "users",
                data: {
                    firstName,
                    lastName,
                    userName,
                    password,
                    role: "user"
                }
            })
            return { success: true, sentToEmail: email }
        })

})
