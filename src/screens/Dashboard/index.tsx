import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components";
import { useAuth } from "../../hooks/auth";

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

import { 
  Container, 
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer
} from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighLightProps {
  amount: string;
  lastTransaction: string;
}

interface HighLightData {
  entries: HighLightProps;
  expenses: HighLightProps;
  total: HighLightProps;
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highLightData, setHighLightData] = useState<HighLightData>({
    entries: {
      amount: 'R$0,00',
      lastTransaction: '',
    },
    expenses: {
      amount: 'R$0,00',
      lastTransaction: '',
    },
    total: {
      amount: 'R$0,00',
      lastTransaction: '',
    },
  } as HighLightData);
  const [isLoading, setIsLoading] = useState(true);
  const { user, signOut } = useAuth();

  const theme = useTheme();

  function getLastTransactionData(
    transactions: DataListProps[],
    type: 'positive' | 'negative'
  ) {

    const lastTypeTransactions = 
    transactions.filter((transaction) => transaction.type === type)
    .map((transaction) => new Date(transaction.date).getTime());
    
    if(lastTypeTransactions.length != 0) {
      const lastTransaction = Math.max(...lastTypeTransactions);

      return Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
      }).format(new Date(lastTransaction));
    } else {
      return null;
    }
  }

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    if(!transactions.length) {
      setIsLoading(false);
      return;
    }

    let entriesTotal = 0;
    let expensesTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
      .map((item: DataListProps) => {

        if(item.type === 'positive') {
          entriesTotal += Number(item.amount);
        } else {
          expensesTotal += Number(item.amount);
        }

        const amount = Number(item.amount)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          });     

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(item.date));
        
        return {
          id: item.id,
          name:  item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        }
      });

      setTransactions(transactionsFormatted);

      const lastTransactionEntries = getLastTransactionData(transactions, 'positive');
      const lastTransactionExpenses = getLastTransactionData(transactions, 'negative');
      const totalInterval = `01 a ${getLastTransactionData(transactions, 'negative')}`;

      const total = entriesTotal - expensesTotal;

      setHighLightData({
        entries: {
          amount: entriesTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: lastTransactionEntries ? `Última entrada dia ${lastTransactionEntries}` : ''
        },
        expenses: {
          amount: expensesTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: lastTransactionExpenses ? `Última saída dia ${lastTransactionExpenses}` : ''
        },
        total: {
          amount: total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: totalInterval
        }
      });

      setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));
  
  return (
    <Container>
      {
        isLoading ? 
        <LoadContainer> 
          <ActivityIndicator 
            color={theme.colors.secondary}
            size="large"
          /> 
        </LoadContainer> :
        <>
        <Header>
          <UserWrapper>
            <UserInfo>
              <Photo 
                source={{ uri: user.photo }}
                />
              <User>
                <UserGreeting>Olá,</UserGreeting>
                <UserName>{user.name}</UserName>
              </User>
            </UserInfo>

            <LogoutButton onPress={signOut}>
              <Icon name="power"/>
            </LogoutButton>
          </UserWrapper>
        </Header>

        <HighlightCards >
          <HighlightCard 
            type="up"
            title="Entradas" 
            amount={highLightData.entries.amount}
            lastTransaction={highLightData.entries.lastTransaction}
          />
          <HighlightCard 
            type="down"
            title="Saídas" 
            amount={highLightData.expenses.amount} 
            lastTransaction={highLightData.expenses.lastTransaction}
          />
          <HighlightCard 
            type="total"
            title="Total" 
            amount={highLightData.total.amount} 
            lastTransaction={highLightData.total.lastTransaction}  
          />
        </HighlightCards>

        <Transactions>
          <Title>Listagem</Title>

          <TransactionList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <TransactionCard data={item} />}
          />   
        </Transactions>
        </>
      }
    </Container>
  );
}