import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, View } from 'react-native';

import { ListItem } from '@/components/ListItem';
import { Radius, type Theme } from '@/constants/theme';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency, formatEpochDate } from '@/lib/format';

export function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const theme = useTheme();
  const styles = useStyles(makeStyles);
  const canOpen = /^https?:\/\//i.test(invoice.url);

  const open = () => {
    void WebBrowser.openBrowserAsync(invoice.url);
  };

  return (
    <ListItem
      title={formatCurrency(invoice.amount, invoice.currency)}
      subtitle={`Paid ${formatEpochDate(invoice.date)}`}
      leading={
        <View style={styles.icon}>
          <Ionicons name="receipt-outline" size={20} color={theme.textSecondary} />
        </View>
      }
      onPress={canOpen ? open : undefined}
      accessibilityLabel={`Invoice for ${formatCurrency(invoice.amount, invoice.currency)}, paid ${formatEpochDate(invoice.date)}`}
    />
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    icon: {
      width: 44,
      height: 44,
      borderRadius: Radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primarySoft,
    },
  });
