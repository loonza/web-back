import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput } from './dto/create-payment.input';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Query(() => [Payment], { name: 'payments' })
  async getAllPayments(
    @Args('createPaymentInput') CreatePaymenInput: CreatePaymentInput,
  ) {
    return this.paymentService.findReservation(CreatePaymenInput);
  }

  @Mutation(() => Payment)
  async createPayment(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
  ): Promise<Payment> {
    try {
      const months = createPaymentInput.months;
      return await this.paymentService.create(
        createPaymentInput as CreatePaymentDto,
        months,
      );
    } catch (error) {
      if (
        error.code === 'P2003' &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        error.meta?.field_name?.includes('reservation_id')
      ) {
        throw new NotFoundException('Бронь с таким ID не найдена');
      }
      throw new BadRequestException('Ошибка при создании оплаты');
    }
  }

  @Query(() => [Payment])
  async allPayments() {
    return this.paymentService.findAllPayments();
  }

  @Mutation(() => Payment)
  async removePayment(
    @Args('reservationId', { type: () => Number }) reservationId: number,
  ): Promise<Payment> {
    try {
      return await this.paymentService.remove(reservationId);
    } catch (error) {
      throw new NotFoundException(
        error.message || 'Ошибка при удалении оплаты',
      );
    }
  }
}
