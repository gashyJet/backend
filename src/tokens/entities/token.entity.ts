import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tokens' })
export class TokenEntity {
  @ApiProperty({ description: 'Token identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Refresh token' })
  @Column({ type: 'text' })
  refreshToken: string;

  @ApiProperty({ description: 'Access token' })
  @Column({ type: 'varchar', length: 255 })
  accessToken: string;

  @ApiProperty({ description: 'User who owns this token' })
  @ManyToOne(() => UserEntity, (user) => user.tokens)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty({ description: 'Expiration date for refresh token' })
  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
