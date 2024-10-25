import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoggedUser } from 'src/shared/decorators/custom/logged-user.decorator';
import { UserRolesE } from '../users-management/common/constants';
import {
  AllowedTo,
  AuthGuard,
} from '../users-management/features/auth/auth.guard';
import { UserModel } from '../users-management/features/user/user.type';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('toggle/:productId')
  @AllowedTo(UserRolesE.USER)
  async toggleWishlist(
    @LoggedUser() user: UserModel,
    @Param('productId') productId: number,
  ) {
    return await this.wishlistService.toggleWishlistItem(user.id, productId);
  }

  @Get()
  @AllowedTo(UserRolesE.USER)
  async getUserWishlist(@LoggedUser() user: UserModel) {
    return await this.wishlistService.getUserWishlist(user.id);
  }

  @Delete()
  @AllowedTo(UserRolesE.USER)
  async clearWishlist(@LoggedUser() user: UserModel) {
    return await this.wishlistService.clearWishlist(user.id);
  }
}
