import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationInput } from './dto/create-reservation.input';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) {}

  @Query(() => [Reservation], { name: 'reservations' })
  findAll(@Args('userId', { type: () => String }) userId: string) {
    return this.reservationService.findAll(userId);
  }

  @Mutation(() => Reservation)
  createReservation(
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
  removeReservation(@Args('id', { type: () => Int }) id: number) {
    return this.reservationService.remove(id);
  }
}
