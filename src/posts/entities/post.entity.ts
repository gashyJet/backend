import { ApiProperty } from '@nestjs/swagger';
import { CommentEntity } from 'src/comments/entities/comment.entity';
import { BaseEntity } from 'src/entities/base-entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class PostEntity extends BaseEntity {
  @ApiProperty({
    example: '93370d2e-ffd5-448b-a98f-f760d937c7d0',
    description: 'Post identifier',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Body of content', description: 'Post content' })
  @Column()
  caption: string;

  @ApiProperty({
    example: ['source of first image', 'source of second image'],
    description: 'Array of images',
  })
  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];
}
