import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput } from './dto/create-payment.input';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Reservation } from '../reservation/entities/reservation.entity';
import { ReservationService } from '../reservation/reservation.service';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly reservationService: ReservationService,
  ) {}

  @Query(() => [Payment], { name: 'payments' })
  async viewAllPayments(
    @Args('createPaymentInput') CreatePaymenInput: CreatePaymentInput,
  ) {
    return this.paymentService.findReservation(CreatePaymenInput);
  }

  @Mutation(() => Payment)
  async pay(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
  ): Promise<Payment> {
    const months = createPaymentInput.months;
    return await this.paymentService.create(
      createPaymentInput as CreatePaymentDto,
      months,
    );
  }

  @Query(() => [Payment])
  async allPayments() {
    return this.paymentService.findAllPayments();
  }

  @Mutation(() => Payment)
  async cancelPayment(
    @Args('reservationId', { type: () => Number }) reservationId: number,
  ): Promise<Payment> {
    return await this.paymentService.remove(reservationId);
  }

  @ResolveField(() => Reservation, { nullable: true })
  async reservation(@Parent() payment: Payment): Promise<Reservation | null> {
    return this.reservationService.findById(payment.reservation_id);
  }
}
