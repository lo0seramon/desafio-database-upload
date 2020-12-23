import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.find({
      where: { id },
    });

    if (transaction.length < 1) {
      throw new AppError('Transaction not found!');
    }

    const result = await transactionsRepository.remove(transaction);

    return result;
  }
}

export default DeleteTransactionService;
