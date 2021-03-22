import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionRouter = Router();
const upload = multer(uploadConfig);

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
  const deleteTransactionService = new DeleteTransactionService();

  const { id } = req.params;

  const result = await deleteTransactionService.execute(id);

  return res.json(result);
});

transactionRouter.post(
  '/import',
  upload.single('file'),
  async (req, res) => {
    const importTransactionService = new ImportTransactionsService();

    const { filename } = req.file;

    const importedTransactions = await importTransactionService.execute(
      filename,
    );

    return res.json(importedTransactions);
  },
);

export default transactionRouter;
