import { PrismaClient } from "@prisma/client"
import { differenceInYears } from 'date-fns';

const prisma = new PrismaClient().$extends({
  result: {
    customers:
    {
      age: {
        needs: { birthday: true },
        compute(customers) {
          differenceInYears(Date.now(), customers.birthday);
          
        },
      }
      }
    }
  }
)

export {prisma}
