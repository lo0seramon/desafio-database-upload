import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public getBalance(): Balance {
    const incomeTransactions = this.transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((acumulator, currentValue) => {
        return acumulator + currentValue.value;
      }, 0);

    const outcomeTransactions = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((acumulator, currentValue) => {
        return acumulator + currentValue.value;
      }, 0);

    const balance: Balance = {
      income: incomeTransactions,
      outcome: outcomeTransactions,
      total: incomeTransactions - outcomeTransactions,
    };

    return balance;
  }
}

export default TransactionsRepository;
