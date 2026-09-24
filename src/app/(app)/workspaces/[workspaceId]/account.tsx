import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { getErrorMessage } from '@/api/client';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ErrorBanner } from '@/components/ErrorBanner';
import { InvoiceRow } from '@/components/InvoiceRow';
import { Loader } from '@/components/Loader';
import { ThemedText } from '@/components/ThemedText';
import { UsageCard } from '@/components/UsageCard';
import { WorkspaceSummary } from '@/components/WorkspaceSummary';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useCurrentUsage } from '@/hooks/useCurrentUsage';
import { useInvoices } from '@/hooks/useInvoices';
import { useTheme } from '@/hooks/useTheme';
import { useWorkspace } from '@/hooks/useWorkspace';

export default function AccountScreen() {
  const theme = useTheme();
  const { workspaceId, name } = useLocalSearchParams<{ workspaceId: string; name?: string }>();
  const { workspace } = useWorkspace(workspaceId);
  const usage = useCurrentUsage(workspaceId);
  const invoices = useInvoices(workspaceId);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([usage.refetch(), invoices.refetch()]);
    } finally {
      setRefreshing(false);
    }
  }, [usage, invoices]);

  const invoiceList = invoices.data ?? [];

  return (
    <>
      <Stack.Screen options={{ title: 'Account' }} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refresh()}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }>
        <WorkspaceSummary workspace={workspace} fallbackName={name} />

        <UsageCard
          usage={usage.data}
          isPending={usage.isPending}
          error={usage.error}
          onRetry={() => void usage.refetch()}
        />

        <View style={styles.section}>
          <ThemedText variant="label" color="textSecondary">
            Invoices
          </ThemedText>

          {invoices.isPending ? (
            <Loader inline size="small" />
          ) : invoices.isError && invoiceList.length === 0 ? (
            <EmptyState
              icon="receipt-outline"
              title="Invoices unavailable"
              message={getErrorMessage(invoices.error)}
              action={
                <Button
                  title="Retry"
                  variant="secondary"
                  icon="refresh-outline"
                  onPress={() => void invoices.refetch()}
                />
              }
            />
          ) : invoiceList.length === 0 ? (
            <EmptyState
              icon="receipt-outline"
              title="No invoices yet"
              message="Invoices for this workspace will appear here once billing starts."
            />
          ) : (
            <View style={styles.list}>
              {invoices.isError ? (
                <ErrorBanner error={invoices.error} onRetry={() => void invoices.refetch()} />
              ) : null}
              {invoiceList.map((invoice) => (
                <InvoiceRow key={invoice.id} invoice={invoice} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.four,
    paddingBottom: Spacing.seven,
    gap: Spacing.five,
  },
  section: { gap: Spacing.three },
  list: { gap: Spacing.two },
});
