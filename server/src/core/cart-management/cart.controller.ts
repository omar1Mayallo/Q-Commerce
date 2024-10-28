import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { LoggedUser } from 'src/shared/decorators/custom/logged-user.decorator';
import { UserRolesE } from '../users-management/common/constants';
import {
  AllowedTo,
  AuthGuard,
} from '../users-management/features/auth/auth.guard';
import { UserModel } from '../users-management/features/user/user.type';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('toggle/:productVariantId')
  @AllowedTo(UserRolesE.USER)
  async toggleCartItem(
    @LoggedUser() user: UserModel,
    @Param('productVariantId') productVariantId: number,
  ) {
    return await this.cartService.toggleCartItem(user.id, productVariantId);
  }

  @Patch('quantity/:productVariantId')
  @AllowedTo(UserRolesE.USER)
  async changeCartItemQuantity(
    @LoggedUser() user: UserModel,
    @Param('productVariantId') productVariantId: number,
    @Body('quantity') quantity: number,
  ) {
    return await this.cartService.changeCartItemQuantity(
      user.id,
      productVariantId,
      quantity,
    );
  }

  @Get()
  @AllowedTo(UserRolesE.USER)
  async getUserCart(@LoggedUser() user: UserModel) {
    return await this.cartService.getUserCart(user.id);
  }

  @Delete()
  @AllowedTo(UserRolesE.USER)
  async clearCart(@LoggedUser() user: UserModel) {
    return await this.cartService.clearCart(user.id);
  }
}
