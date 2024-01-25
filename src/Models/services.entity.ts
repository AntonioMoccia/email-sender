import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'services'
})
class Services {

    @PrimaryGeneratedColumn('uuid')
    id_service?: string

    @Column()
    email:string

    @Column({
        nullable:false
    })
    provider: string
    
    @Column({ type: 'jsonb' })
    authParams: any
}
export default Services