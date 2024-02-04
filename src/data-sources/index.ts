import Services from '@models/services.entity'
import { DataSource } from 'typeorm'


export const database = new DataSource({
   type:"postgres",
   host:"localhost",
   port:5432,
   username: "admin",
   password: "admin",
   database: "email_sender",
   synchronize: true,
   logging: true,
   entities: [Services],
   subscribers: [],
   migrations: [],
})
