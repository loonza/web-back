import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async viewAllUsers() {
    return this.userService.findAllUsers();
  }

  @Query(() => User)
  async findUserByUsername(
    @Args('username', { type: () => String }) username: string,
  ) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException(
        `Пользователь с username ${username} не найден`,
      );
    }
    return user;
  }

  @Mutation(() => User)
  async Register(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput as CreateUserDto);
  }

  @Mutation(() => User)
  async deleteAccount(@Args('id', { type: () => String }) id: string) {
    return this.userService.removeById(id);
  }
}
