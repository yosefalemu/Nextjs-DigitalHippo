import { Access, CollectionConfig } from "payload/types"

const AdminAndUser: Access = ({ req: { user } }) => {
    if (user.role === "admin") return true
    console.log("user in the user collection", user);
    return {
        id: {
            equals: user.id
        }
    }
}
export const Users: CollectionConfig = {
    slug: "users",
    admin: {
        useAsTitle: "userName",
        hidden: ({ user }) => user.role !== "admin",
        defaultColumns: ["id"]
    },
    auth: {
        verify: {
            generateEmailHTML: ({ token }) => {
                return `<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}'>Verify email</a>`
            }
        }
    },
    access: {
        read: AdminAndUser,
        create: () => true,
        update: ({ req }) => req.user.role === "admin",
        delete: ({ req }) => req.user.role === "admin"
    },

    fields: [
        {
            name: 'firstName',
            required: true,
            type: "text"
        },
        {
            name: "lastName",
            required: true,
            type: "text"
        },
        {
            name: "userName",
            required: true,
            type: "text"
        },
        {
            name: 'role',
            defaultValue: 'user',
            required: true,
            type: 'select',
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
            ],
        },
        {
            name: "products",
            label: "Products",
            type: "relationship",
            relationTo: "products",
            hasMany: true,
            admin: {
                condition: () => false
            }
        },
        {
            name: "product_files",
            label: "Product files",
            type: "relationship",
            relationTo: "product_files",
            hasMany: true,
            admin: {
                condition: () => false
            }
        },
    ]
}