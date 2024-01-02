import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'services'
})
class Services<T> {

    @PrimaryGeneratedColumn('uuid')
    id_service: string

    @Column()
    service_type: string
    
    @Column({ type: 'json' })
    authParams: T
}
export default Services