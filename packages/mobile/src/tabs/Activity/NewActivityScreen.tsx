import { AccountEventsMapper } from '@tonkeeper/shared/mappers/AccountEventsMapper';
import { useEventsByAccount } from '@tonkeeper/core/src/query/useEventsByAccount';
import { TransactionsList } from '@tonkeeper/shared/components';
import { Screen, Text, Button } from '@tonkeeper/uikit';
import { StyleSheet, View } from 'react-native';
import { t } from '@tonkeeper/shared/i18n';
import { useWallet } from '../useWallet';
import React, { memo } from 'react';

import { openRequireWalletModal } from '$navigation';
import { useNavigation } from '@tonkeeper/router';

export const ActivityScreen = memo(() => {
  const wallet = useWallet();
  const events = useEventsByAccount(wallet.address.raw, {
    modify: (data) => AccountEventsMapper(data ?? [], wallet.address.raw),
    fetchMoreParams: (lastPage) => ({ before_lt: lastPage.next_from }),
    fetchMoreEnd: (data) => data.events.length < 1,
  });

  const nav = useNavigation();
  const handlePressRecevie = React.useCallback(() => {
    if (wallet) {
      nav.go('Receive', {
        currency: 'ton',
        isFromMainScreen: true,
      });
    } else {
      openRequireWalletModal();
    }
  }, [wallet]);

  const handlePressBuy = React.useCallback(() => {
    if (wallet) {
      nav.openModal('Exchange', { category: 'buy' });
    } else {
      openRequireWalletModal();
    }
  }, [wallet]);


  if (!events.loading && events?.data?.length < 1) {
    return (
      <Screen>
        <View style={styles.emptyContainer}>
          <Text type="h2" style={styles.emptyTitleText}>
            {t('activity.empty_transaction_title')}
          </Text>
          <Text type="body1" color="textSecondary">
            {t('activity.empty_transaction_caption')}
          </Text>
          <View style={styles.emptyButtons}>
            <Button
              title={t('activity.buy_toncoin_btn')}
              style={styles.emptyFirstButton}
              onPress={handlePressBuy}
              color="secondary"
              size="small"
            />
            <Button
              title={t('activity.receive_btn')}
              onPress={handlePressRecevie}
              color="secondary"
              size="small"
            />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Screen.LargeHeader title={t('activity.screen_title')} />
      <TransactionsList
        fetchMoreEnd={events.fetchMoreEnd}
        onFetchMore={events.fetchMore}
        refreshing={events.refreshing}
        onRefresh={events.refresh}
        loading={events.loading}
        events={events.data}
      />
    </Screen>
  );
});

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  emptyButtons: {
    flexDirection: 'row',
    marginTop: 24,
  },
  emptyTitleText: {
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyFirstButton: {
    marginRight: 12,
  },
});
