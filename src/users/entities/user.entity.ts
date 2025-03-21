import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';
import { BaseEntity } from 'src/entities/base-entity';
import { CommentEntity } from 'src/comments/entities/comment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TokenEntity } from 'src/tokens/entities/token.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @ApiProperty({
    example: '93370d2e-ffd5-448b-a98f-f760d937c7d0',
    description: 'User identifier',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Username' })
  @Column({ unique: true, type: 'varchar', length: 100 })
  username: string;

  @ApiProperty({ description: 'Email' })
  @Column({ unique: true, type: 'varchar', length: 50 })
  email: string;

  @ApiProperty({ description: 'Password' })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ description: 'First Name' })
  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @ApiProperty({ description: 'Last Name' })
  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @ApiProperty({ description: 'Profile Picture URL' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePictureUrl: string;

  @ApiProperty({ description: 'Bio' })
  @Column({ type: 'text', nullable: true })
  bio: string;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens: TokenEntity[];
}
