import { getCustomRepository, getRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryName: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryName,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError(
        "You don't have enough money for this transaction",
        400,
      );
    }

    const checkIfCategoryExists = await categoryRepository.findOne({
      where: { title: categoryName },
    });

    if (!checkIfCategoryExists) {
      const newCategory = categoryRepository.create({ title: categoryName });
      await categoryRepository.save(newCategory);
    }

    const category = await categoryRepository.findOne({
      where: { title: categoryName },
    });

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: category?.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
