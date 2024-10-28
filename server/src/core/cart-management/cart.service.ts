import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/database/database.provider';
import { TABLES } from 'src/shared/constants/tables.constants';
import { RepositoryService } from 'src/shared/modules/repository/repository.service';
import { CartItemModel, CartModel } from './cart.type';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepoService: RepositoryService<CartModel>,
    private readonly cartItemsRepoService: RepositoryService<CartItemModel>,
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
  ) {}

  // ! TODO: Check if this product variant quantity is not sold out in the current productRegionalData
  async toggleCartItem(userId: number, productVariantId: number) {
    // Check if the user already has a cart
    let cart = await this.cartRepoService.getOne(
      TABLES.CARTS,
      { user_id: userId },
      { withNotFoundError: false },
    );

    // If the cart does not exist, create it
    if (!cart) {
      cart = await this.cartRepoService.createOne(TABLES.CARTS, {
        user_id: userId,
      });
    }

    // Check if the product variant already exists in the cart
    const existingItem = await this.cartItemsRepoService.getOne(
      TABLES.CART_ITEMS,
      { cart_id: cart.id, product_variant_id: productVariantId },
      { withNotFoundError: false },
    );

    // If the item exists, remove it from the cart
    if (existingItem) {
      await this.cartItemsRepoService.deleteByIds(TABLES.CART_ITEMS, [
        existingItem.id,
      ]);
      return { message: 'Product removed from cart' };
    } else {
      // Otherwise, add it to the cart with a default quantity of 1
      await this.cartItemsRepoService.createOne(TABLES.CART_ITEMS, {
        cart_id: cart.id,
        product_variant_id: productVariantId,
        quantity: 1,
      });
      return { message: 'Product added to cart' };
    }
  }

  // ! TODO: Check if this product variant quantity is available in the current productRegionalData
  async changeCartItemQuantity(
    userId: number,
    productVariantId: number,
    quantity: number,
  ) {
    // Fetch the user's cart
    const cart = await this.cartRepoService.getOne(TABLES.CARTS, {
      user_id: userId,
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Update the quantity for the specific product variant in the cart
    await this.cartItemsRepoService.updateOne(
      TABLES.CART_ITEMS,
      { cart_id: cart.id, product_variant_id: productVariantId },
      { quantity },
    );

    return { message: 'Cart item quantity updated' };
  }

  async getUserCart(userId: number) {
    // Fetch all items in the user's cart, joining with the product details
    return await this.knex(TABLES.CART_ITEMS)
      .join(
        TABLES.PRODUCT_VARIANTS,
        `${TABLES.CART_ITEMS}.product_variant_id`,
        `${TABLES.PRODUCT_VARIANTS}.id`,
      )
      .join(TABLES.CARTS, `${TABLES.CART_ITEMS}.cart_id`, `${TABLES.CARTS}.id`)
      .where(`${TABLES.CARTS}.user_id`, userId)
      .select(
        `${TABLES.PRODUCT_VARIANTS}.id as product_variant_id`,
        `${TABLES.PRODUCT_VARIANTS}.sku`,
        `${TABLES.PRODUCT_VARIANTS}.unique_variant_name`,
        `${TABLES.CART_ITEMS}.quantity`,
        `${TABLES.CART_ITEMS}.created_at as added_at`,
      );
  }

  async clearCart(userId: number) {
    return await this.cartRepoService.deleteOne(TABLES.CARTS, {
      user_id: userId,
    });
  }
}
