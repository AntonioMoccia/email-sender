import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'services'
})
class Services<T> {

    @PrimaryGeneratedColumn('uuid')
    id_service?: string

    @Column()
    email:string

    @Column({
        nullable:false
    })
    provider: string
    
    @Column({ type: 'jsonb' })
    authParams: T
}
export default Services