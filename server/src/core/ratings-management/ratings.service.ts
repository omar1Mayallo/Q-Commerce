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

  async getProductReviews(
    productId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    const offset = (page - 1) * limit;

    // Raw SQL query to fetch reviews and count the number of replies for each review
    const reviews = await this.knex.raw(
      `
      SELECT
        r.id,
        r.product_id,
        r.user_id,
        r.rating,
        r.review_text,
        r.helpful_count,
        r.created_at,
        COUNT(rep.id) AS reply_count
      FROM "${TABLES.REVIEWS}" r
      LEFT JOIN "${TABLES.REPLIES}" rep ON r.id = rep.review_id
      WHERE r.product_id = ?
      GROUP BY r.id
      ORDER BY r.helpful_count DESC, r.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [productId, limit, offset],
    );

    // Fetch total number of reviews for pagination
    const totalReviews = await this.knex(TABLES.REVIEWS)
      .where({ product_id: productId })
      .count('id as total');

    return {
      reviews: reviews.rows,
      pagination: {
        total: Number(totalReviews[0].total),
        currentPage: page,
        perPage: limit,
        totalPages: Math.ceil(Number(totalReviews[0].total) / limit),
      },
    };
  }

  async getReviewReplies(reviewId: number) {
    // Raw SQL query to fetch all replies for the review, sorted by latest first
    const replies = await this.knex.raw(
      `
      WITH RECURSIVE reply_tree AS (
        SELECT
          rep.id,
          rep.review_id,
          rep.parent_reply_id,
          rep.user_id,
          rep.reply_text,
          rep.created_at,
          1 as level
        FROM "${TABLES.REPLIES}" rep
        WHERE rep.review_id = ? AND rep.parent_reply_id IS NULL
        
        UNION ALL
        
        SELECT
          rep.id,
          rep.review_id,
          rep.parent_reply_id,
          rep.user_id,
          rep.reply_text,
          rep.created_at,
          rt.level + 1 as level
        FROM "${TABLES.REPLIES}" rep
        INNER JOIN reply_tree rt ON rep.parent_reply_id = rt.id
      )
      SELECT * FROM reply_tree
      ORDER BY created_at DESC
      `,
      [reviewId],
    );

    // Convert the flat list of replies into a nested tree structure
    const replyTree = this.buildReplyTree(replies.rows);

    return replyTree;
  }

  private buildReplyTree(replies: any[]) {
    const replyMap = new Map<number, any>();

    // Create a map of all replies by their ID
    replies.forEach((reply) => {
      reply.children = []; // Initialize an empty array for child replies
      replyMap.set(reply.id, reply);
    });

    // Build the tree by adding child replies to their respective parents
    const rootReplies = [];

    replies.forEach((reply) => {
      if (reply.parent_reply_id) {
        // If the reply has a parent, add it to the parent's children array
        const parentReply = replyMap.get(reply.parent_reply_id);
        if (parentReply) {
          parentReply.children.push(reply);
        }
      } else {
        // If no parent, it's a root reply (top-level reply)
        rootReplies.push(reply);
      }
    });

    return rootReplies; // Return the tree structure of root replies with their nested children
  }
}
