import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserService } from '../user/user.service';
import { WarehouseService } from '../warehouse/warehouse.service';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly userService: UserService,
    private readonly warehouseService: WarehouseService,
  ) {}

  @Query(() => [Review], { name: 'reviews' })
  viewAllReview() {
    return this.reviewService.findAll();
  }

  @Query(() => Review, { name: 'review' })
  async findSingleReview(@Args('id') id: number) {
    const review = await this.reviewService.findOne(id);
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return review;
  }

  @Mutation(() => Review)
  leaveFeedback(
    @Args('createReviewInput') CreateReviewInput: CreateReviewInput,
    @Args('userId', { type: () => String }) userId: string,
  ) {
    return this.reviewService.create(
      userId,
      CreateReviewInput as CreateReviewDto,
    );
  }

  @Mutation(() => Review)
  async removeReview(@Args('id') id: number) {
    const review = await this.reviewService.findOne(id);
    await this.reviewService.remove(id);
    return review;
  }

  @ResolveField()
  async user(@Parent() review: Review) {
    if (!review.user_id) return null;
    return this.userService.findById(review.user_id);
  }

  @ResolveField()
  async warehouse(@Parent() review: Review) {
    if (!review.warehouse_id) return null;
    return this.warehouseService.findOne(review.warehouse_id);
  }
}
