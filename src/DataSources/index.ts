import Services from 'src/Entities/Services.entity'
import User from 'src/Entities/User'
import { DataSource } from 'typeorm'


export const database = new DataSource({
   type:"postgres",
   host:"localhost",
   port:5432,
   username: "admin",
   password: "admin",
   database: "email_sander",
   synchronize: false,
   logging: false,
   entities: [User,Services],
   subscribers: [],
   migrations: [],
})
