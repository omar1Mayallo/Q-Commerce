import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/database/database.provider';
import { TABLES } from 'src/shared/constants/tables.constants';
import { RepositoryService } from 'src/shared/modules/repository/repository.service';
import { WishlistItemModel, WishlistModel } from './wishlist.type';

@Injectable()
export class WishlistService {
  constructor(
    private readonly wishlistRepoService: RepositoryService<WishlistModel>,
    private readonly wishlistItemsRepoService: RepositoryService<WishlistItemModel>,
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
  ) {}

  async toggleWishlistItem(userId: number, productId: number) {
    // 1. Check if the user already has a wishlist
    let wishlist = await this.wishlistRepoService.getOne(
      TABLES.WISHLISTS,
      {
        user_id: userId,
      },
      { withNotFoundError: false },
    );

    // 2. If the wishlist does not exist, create it
    if (!wishlist) {
      wishlist = await this.wishlistRepoService.createOne(TABLES.WISHLISTS, {
        user_id: userId,
      });
    }

    // 3. Now that we have a wishlist, check if the product already exists in the wishlist
    const existingItem = await this.wishlistItemsRepoService.getOne(
      TABLES.WISHLIST_ITEMS,
      {
        wishlist_id: wishlist.id, // Use the wishlist ID we just got or created
        product_id: productId,
      },
      { withNotFoundError: false }, // No error if item not found
    );

    // 4. If the item exists, remove it from the wishlist
    if (existingItem) {
      await this.wishlistItemsRepoService.deleteByIds(TABLES.WISHLIST_ITEMS, [
        existingItem.id,
      ]);
      return { message: 'Product removed from wishlist' };
    }
    // 5. If the item does not exist, add it to the wishlist
    else {
      await this.wishlistItemsRepoService.createOne(TABLES.WISHLIST_ITEMS, {
        wishlist_id: wishlist.id, // Link it to the existing (or newly created) wishlist
        product_id: productId, // Add the product
      });
      return { message: 'Product added to wishlist' };
    }
  }

  async getUserWishlist(userId: number) {
    // Using Knex for more complex SQL with joins
    return await this.knex(TABLES.WISHLIST_ITEMS)
      .join(
        TABLES.PRODUCTS,
        `${TABLES.WISHLIST_ITEMS}.product_id`,
        `${TABLES.PRODUCTS}.id`,
      )
      .join(
        TABLES.WISHLISTS,
        `${TABLES.WISHLIST_ITEMS}.wishlist_id`,
        `${TABLES.WISHLISTS}.id`,
      )
      .where(`${TABLES.WISHLISTS}.user_id`, userId)
      .select(
        `${TABLES.PRODUCTS}.id as product_id`,
        `${TABLES.PRODUCTS}.product_name`,
        `${TABLES.PRODUCTS}.base_price`,
        `${TABLES.PRODUCTS}.product_description`,
        `${TABLES.WISHLIST_ITEMS}.created_at as added_at`,
      );
  }

  async clearWishlist(userId: number) {
    // Fetch the user's wishlist
    const wishlist = await this.wishlistRepoService.getOne(TABLES.WISHLISTS, {
      user_id: userId,
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    // Delete all items in the wishlist
    await this.wishlistItemsRepoService.deleteManyByFields(
      TABLES.WISHLIST_ITEMS,
      { wishlist_id: wishlist.id },
    );

    return { message: 'Wishlist cleared' };
  }
}
