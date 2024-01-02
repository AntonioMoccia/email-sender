import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
    name: 'users'
})
class User {

    @PrimaryGeneratedColumn()    
    id_user: number

    @Column()
    name: string
    
    @Column()
    email: string
    
    @Column()
    password: string


}

export default User