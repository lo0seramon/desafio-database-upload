import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

transactionRouter.get('/', (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = transactionsRepository.find();
  const balance = transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

// transactionRouter.post('/', (request, response) => {
//   const createTransactionService = new CreateTransactionService();

//   const { title, value, type } = request.body;

//   const transaction = createTransactionService.execute({
//     title,
//     value,
//     type,
//   });

//   return response.json(transaction);
// });

export default transactionRouter;
