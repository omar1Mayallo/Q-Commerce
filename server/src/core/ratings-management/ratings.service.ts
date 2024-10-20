import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/database/database.provider';
import { TABLES } from 'src/shared/constants/tables.constants';
import { RepositoryService } from 'src/shared/modules/repository/repository.service';
import { ProductModel } from '../products-management/features/products/products.type';
import {
  CreateReplyDTO,
  CreateReviewDTO,
  UpdateReplyDTO,
  UpdateReviewDTO,
} from './ratings.dto';
import { ReplyModel, ReviewHelpfulModel, ReviewModel } from './ratings.type';

@Injectable()
export class RatingsService {
  constructor(
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
    private readonly reviewRepoService: RepositoryService<ReviewModel>,
    private readonly replyRepoService: RepositoryService<ReplyModel>,
    private readonly productRepoService: RepositoryService<ProductModel>,
    private readonly reviewHelpfulRepoService: RepositoryService<ReviewHelpfulModel>,
  ) {}

  async createReview(productId: number, body: CreateReviewDTO, userId: number) {
    // Check if product exists
    await this.productRepoService.getOne(TABLES.PRODUCTS, { id: productId });

    // Check if the user already has a review for this product
    const existingReview = await this.reviewRepoService.getOne(
      TABLES.REVIEWS,
      {
        product_id: productId,
        user_id: userId,
      },
      { withNotFoundError: false },
    );

    if (existingReview) {
      // If a review exists, return a conflict message
      throw new ConflictException(
        'You have already reviewed this product. You can only edit your review.',
      );
    }

    // Insert the review into the Reviews table
    return await this.reviewRepoService.createOne(TABLES.REVIEWS, {
      product_id: productId,
      user_id: userId,
      ...body,
    });
  }

  async toggleHelpful(reviewId: number, userId: number) {
    // Check if the review exists
    const review = await this.reviewRepoService.getOne(TABLES.REVIEWS, {
      id: reviewId,
    });

    // Start a transaction
    return await this.knex.transaction(async (trx) => {
      // Check if the user has already marked this review
      const existingHelpful = await this.reviewHelpfulRepoService.getOne(
        TABLES.HELPFUL_REVIEWS,
        {
          user_id: userId,
          review_id: reviewId,
        },
        { withNotFoundError: false, trx }, // Pass transaction to the method
      );

      if (existingHelpful) {
        // If already marked, un-mark it (remove the entry and decrement the helpful count)
        await this.reviewHelpfulRepoService.deleteByIds(
          TABLES.HELPFUL_REVIEWS,
          [existingHelpful.id],
          { trx }, // Pass transaction to the method
        );

        await this.reviewRepoService.updateOne(
          TABLES.REVIEWS,
          { id: reviewId },
          { helpful_count: review.helpful_count - 1 },
          { trx }, // Pass transaction to the method
        );

        return { message: 'Review unmarked as helpful.' };
      } else {
        // If not marked, mark it (add the entry and increment the helpful count)
        await this.reviewRepoService.updateOne(
          TABLES.REVIEWS,
          { id: reviewId },
          { helpful_count: review.helpful_count + 1 },
          { trx }, // Pass transaction to the method
        );

        return await this.reviewHelpfulRepoService.createOne(
          TABLES.HELPFUL_REVIEWS,
          {
            user_id: userId,
            review_id: reviewId,
            is_helpful: true,
          },
          { trx }, // Pass transaction to the method
        );
      }
    });
  }

  async editReview(reviewId: number, body: UpdateReviewDTO, userId: number) {
    return await this.reviewRepoService.updateOne(
      TABLES.REVIEWS,
      { id: reviewId, user_id: userId },
      { ...body, is_edited: true },
    );
  }

  async deleteReview(reviewId: number, userId: number) {
    return await this.reviewRepoService.deleteOne(TABLES.REVIEWS, {
      id: reviewId,
      user_id: userId,
    });
  }

  async getReview(reviewId: number) {
    return await this.reviewRepoService.getOne(TABLES.REVIEWS, {
      id: reviewId,
    });
  }

  async createReply(reviewId: number, body: CreateReplyDTO, userId: number) {
    // Check if the review exists
    await this.reviewRepoService.getOne(TABLES.REVIEWS, { id: reviewId });

    // If parent_reply_id is provided, check if the parent reply exists
    if (body.parent_reply_id) {
      await this.replyRepoService.getOne(TABLES.REPLIES, {
        id: body.parent_reply_id,
      });
    }

    // Insert the reply
    return await this.replyRepoService.createOne(TABLES.REPLIES, {
      user_id: userId,
      review_id: reviewId,
      parent_reply_id: body.parent_reply_id || null,
      reply_text: body.reply_text,
    });
  }

  async editReply(
    reviewId: number,
    replyId: number,
    body: UpdateReplyDTO,
    userId: number,
  ) {
    return await this.replyRepoService.updateOne(
      TABLES.REPLIES,
      { id: replyId, user_id: userId, review_id: reviewId },
      { reply_text: body.reply_text },
    );
  }

  async deleteReply(reviewId: number, replyId: number, userId: number) {
    return await this.replyRepoService.deleteOne(TABLES.REPLIES, {
      id: replyId,
      user_id: userId,
      review_id: reviewId,
    });
  }
}
