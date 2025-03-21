import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsService } from './comments.service';
import { CommentEntity } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { SearchCommentDto } from './dto/search-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('comments')
@ApiInternalServerErrorResponse({ description: 'Server Error' })
@ApiUnauthorizedResponse({ description: 'Unauthorized response' })
@Controller({ version: '1', path: 'comments' })
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new comment' })
  @ApiCreatedResponse({
    description: 'The comment for the post has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiBody({ type: CreateCommentDto })
  @ApiQuery({ name: 'postId', description: 'Post id' })
  create(
    @Query() { postId }: QueryCommentDto,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(postId, createCommentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiOperation({ summary: 'Get all comment for specific post' })
  @ApiQuery({ name: 'postId', description: 'Post id' })
  async findAll(@Query() { postId }: QueryCommentDto) {
    return this.commentsService.findAll(postId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find comment with id' })
  @ApiParam({ name: 'id', description: 'Comment id' })
  @ApiQuery({ name: 'postId', description: 'Post id' })
  @ApiOkResponse({
    description: 'The found comment record',
    type: CommentEntity,
  })
  @ApiNotFoundResponse({ description: 'Not Found' })
  getCommentById(
    @Query() { postId }: QueryCommentDto,
    @Param() { id }: SearchCommentDto,
  ) {
    return this.commentsService.findOne(id, postId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update comment with id' })
  @ApiParam({ name: 'id', description: 'Comment id' })
  @ApiQuery({ name: 'postId', description: 'Post id' })
  @ApiCreatedResponse({ description: 'Comment has been updated' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  update(
    @Query() { postId }: QueryCommentDto,
    @Param() { id }: SearchCommentDto,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, postId, updateCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete comment with id' })
  @ApiParam({ name: 'id', description: 'Comment id' })
  @ApiQuery({ name: 'postId', description: 'Post id' })
  @ApiNoContentResponse({ description: 'Comment has been deleted' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  remove(
    @Query() { postId }: QueryCommentDto,
    @Param() { id }: SearchCommentDto,
  ) {
    return this.commentsService.remove(id, postId);
  }
}
