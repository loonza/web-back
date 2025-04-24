import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationInput } from './dto/create-reservation.input';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UserService } from 'src/user/user.service';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { User } from '../user/entities/user.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly userService: UserService,
    private readonly warehouseService: WarehouseService,
  ) {}

  @Query(() => [Reservation])
  viewAllBookings(
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ) {
    if (userId) {
      return this.reservationService.findByUserId(userId);
    }
    return this.reservationService.findAlls();
  }

  @Mutation(() => Reservation)
  Book(
    @Args('userId', { type: () => String }) userId: string,
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput,
  ) {
    return this.reservationService.create(
      userId,
      createReservationInput as CreateReservationDto,
    );
  }

  @Mutation(() => Reservation)
  CancelBooking(@Args('id', { type: () => Int }) id: number) {
    return this.reservationService.remove(id);
  }

  @ResolveField(() => User, { nullable: true })
  async user(@Parent() reservation: Reservation) {
    if (!reservation.user_id) return null;
    return this.userService.findById(reservation.user_id);
  }

  @ResolveField(() => Warehouse, { nullable: true })
  async warehouse(@Parent() reservation: Reservation) {
    if (!reservation.warehouse_id) return null;
    return this.warehouseService.findOne(reservation.warehouse_id);
  }
}
