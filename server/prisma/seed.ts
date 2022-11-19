import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

async function main() {
    const user = await prisma.users.create({
        data: {
          username: 'userZero',
          password: 'Password12',

          accounts: {
            create: {
                balance: 100
            }
          }
        },
    });      
    console.log(user)
}

main()
    .catch((e: Error) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect
    })