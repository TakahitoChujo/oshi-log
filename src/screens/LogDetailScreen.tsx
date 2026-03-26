import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useOshiStore } from '../store/useOshiStore';
import ColorBg from '../components/ColorBg';
import { s, vs, fs } from '../utils/responsive';

type RouteT = RouteProp<RootStackParamList, 'LogDetail'>;

export default function LogDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const { logId } = route.params;

  const { logs, oshis, removeLog, loadLogs } = useOshiStore();
  const log = logs.find((l) => l.id === logId);
  const oshi = oshis.find((o) => o.id === log?.oshi_id);

  useEffect(() => {
    loadLogs();
  }, []);

  if (!log) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>記録が見つかりません</Text>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert('記録を削除', 'この記録を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          removeLog(logId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ColorBg color={oshi?.color ?? '#E91E8C'} style={styles.header}>
          <Text style={styles.typeLarge}>{log.type}</Text>
          <Text style={styles.oshiNameHeader}>{oshi?.name ?? '不明'}</Text>
        </ColorBg>

        <View style={styles.card}>
          <Row label="日付" value={log.date} />
          {log.amount > 0 && (
            <Row label="金額" value={`¥${log.amount.toLocaleString()}`} />
          )}
          {log.memo ? <Row label="メモ" value={log.memo} multiline /> : null}
        </View>

        {log.photo_path ? (
          <Image source={{ uri: log.photo_path }} style={styles.photo} resizeMode="cover" />
        ) : null}

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>この記録を削除</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <View style={[rowStyles.row, multiline && rowStyles.rowMulti]}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={[rowStyles.value, multiline && rowStyles.valueMulti]}>{value}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  rowMulti: { flexDirection: 'column', gap: vs(4) },
  label: { fontSize: fs(13), color: '#aaa', fontWeight: '600' },
  value: { fontSize: fs(15), color: '#333' },
  valueMulti: { marginTop: vs(4) },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { gap: vs(16) },
  header: {
    padding: s(24),
    alignItems: 'center',
    gap: vs(4),
  },
  typeLarge: { fontSize: fs(28), color: '#fff', fontWeight: 'bold' },
  oshiNameHeader: { fontSize: fs(16), color: 'rgba(255,255,255,0.85)' },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: s(16),
    borderRadius: s(12),
    padding: s(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  photo: {
    marginHorizontal: s(16),
    borderRadius: s(12),
    width: '100%',
    height: vs(200),
  },
  deleteButton: {
    marginHorizontal: s(16),
    marginBottom: vs(32),
    padding: s(14),
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: '#E91E8C',
    alignItems: 'center',
  },
  deleteText: { color: '#E91E8C', fontWeight: '600', fontSize: fs(15) },
  notFound: { textAlign: 'center', color: '#aaa', marginTop: vs(40), fontSize: fs(14) },
});
