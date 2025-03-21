import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseEntity } from 'src/entities/base-entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class CommentEntity extends BaseEntity {
  @ApiProperty({
    example: '93370d2e-ffd5-448b-a98f-f760d937c7d0',
    description: 'Comment identifier',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '93370d2e-ffd5-448b-a98f-f760d937c7d0',
    description: 'Post identifier',
  })
  @Column('uuid')
  postId: string;

  @ApiProperty({
    example: '93370d2e-ffd5-448b-a98f-f760d937c7d0',
    description: 'Parrent comment identifier',
  })
  @Column('uuid', { nullable: true })
  @IsOptional()
  parentCommentId?: string | null;

  @ApiProperty({ example: 'Body of content', description: 'Comment content' })
  @Column()
  comment: string;

  @ManyToOne(() => PostEntity, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post: PostEntity;

  @ManyToOne(() => CommentEntity, { nullable: true })
  @JoinColumn({ name: 'parentCommentId' })
  parentComment: CommentEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
