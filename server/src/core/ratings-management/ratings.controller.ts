import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  AllowedTo,
  AuthGuard,
} from '../users-management/features/auth/auth.guard';
import { UserRolesE } from '../users-management/common/constants';
import { LoggedUser } from 'src/shared/decorators/custom/logged-user.decorator';
import { UserModel } from '../users-management/features/user/user.type';
import { RatingsService } from './ratings.service';
import {
  CreateReplyDTO,
  CreateReviewDTO,
  UpdateReplyDTO,
  UpdateReviewDTO,
} from './ratings.dto';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post(':productId')
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async createReview(
    @Param('productId') productId: number,
    @Body() body: CreateReviewDTO,
    @LoggedUser() user: UserModel,
  ) {
    return await this.ratingsService.createReview(productId, body, user.id);
  }

  @Post('helpful/:reviewId')
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async toggleHelpful(
    @Param('reviewId') reviewId: number,
    @LoggedUser() user: UserModel,
  ) {
    return await this.ratingsService.toggleHelpful(reviewId, user.id);
  }

  @Patch(':reviewId')
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async editReview(
    @Param('reviewId') reviewId: number,
    @Body() body: UpdateReviewDTO,
    @LoggedUser() user: UserModel,
  ) {
    return await this.ratingsService.editReview(reviewId, body, user.id);
  }

  @Delete(':reviewId')
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async deleteReview(
    @Param('reviewId') reviewId: number,
    @LoggedUser() user: UserModel,
  ) {
    return await this.ratingsService.deleteReview(reviewId, user.id);
  }

  @Get(':reviewId')
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async getReview(@Param('reviewId') reviewId: number) {
    return await this.ratingsService.getReview(reviewId);
  }

  @Post(':reviewId/replies')
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async createReply(
    @Param('reviewId') reviewId: number,
    @Body() body: CreateReplyDTO,
    @LoggedUser() user: UserModel,
  ) {
    return await this.ratingsService.createReply(reviewId, body, user.id);
  }

  @Patch(':reviewId/replies/:replyId')
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async editReply(
    @Param('reviewId') reviewId: number,
    @Param('replyId') replyId: number,
    @Body() body: UpdateReplyDTO,
    @LoggedUser() user: UserModel,
  ) {
    return await this.ratingsService.editReply(
      reviewId,
      replyId,
      body,
      user.id,
    );
  }

  @Delete(':reviewId/replies/:replyId')
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async deleteReply(
    @Param('reviewId') reviewId: number,
    @Param('replyId') replyId: number,
    @LoggedUser() user: UserModel,
  ) {
    return await this.ratingsService.deleteReply(reviewId, replyId, user.id);
  }
}
