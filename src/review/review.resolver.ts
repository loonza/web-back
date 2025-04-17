import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => [Review], { name: 'reviews' })
  findAll() {
    return this.reviewService.findAll();
  }

  @Query(() => Review, { name: 'review' })
  async findOne(@Args('id') id: number) {
    const review = await this.reviewService.findOne(id);
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return review;
  }

  @Mutation(() => Review)
  createReview(
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
    const review = await this.reviewService.findOne(id); // получить перед удалением
    await this.reviewService.remove(id);
    return review;
  }
}
