import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('posts')
@ApiInternalServerErrorResponse({ description: 'Server Error' })
@ApiUnauthorizedResponse({ description: 'Unauthorized response' })
@Controller({ version: '1', path: 'posts' })
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new post' })
  @ApiCreatedResponse({
    description: 'The post has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiBody({ type: CreatePostDto })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiOperation({ summary: 'Get all posts' })
  getPosts() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find post with id' })
  @ApiParam({ name: 'id', description: 'Gets the post by id' })
  @ApiOkResponse({
    description: 'The found post record',
    type: PostEntity,
  })
  @ApiNotFoundResponse({ description: 'Not Found' })
  getPostById(@Param() { id }: SearchPostDto) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update post with id' })
  @ApiParam({ name: 'id', description: 'Update the post by id' })
  @ApiCreatedResponse({ description: 'Post has been updated' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  update(@Param() { id }: SearchPostDto, @Body() post: UpdatePostDto) {
    return this.postsService.update(id, post);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete post with id' })
  @ApiParam({ name: 'id', description: 'Delete the post by id' })
  @ApiNoContentResponse({ description: 'Post has been deleted' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  delete(@Param() { id }: SearchPostDto) {
    return this.postsService.remove(id);
  }
}
