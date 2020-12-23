import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

transactionRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionRouter.post('/', async (request, response) => {
  const createTransactionService = new CreateTransactionService();

  const { title, value, type, category } = request.body;

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    categoryName: category,
  });

  return response.json(transaction);
});

transactionRouter.delete('/:id', async (req, res) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const { id } = req.params;

  console.log(id);

  const transaction = await transactionsRepository.find({
    where: { id },
  });

  console.log(transaction);

  const result = await transactionsRepository.remove(transaction);

  return res.json(result);
});

export default transactionRouter;
