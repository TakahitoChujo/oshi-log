import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useOshiStore } from '../store/useOshiStore';
import { Oshi } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import ColorDot from '../components/ColorDot';
import { primaryColor } from '../utils/color';
import { s, vs, fs } from '../utils/responsive';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function OshiCard({ oshi }: { oshi: Oshi }) {
  const navigation = useNavigation<Nav>();
  const allLogs = useOshiStore((s) => s.logs);
  const logs = useMemo(() => allLogs.filter((l) => l.oshi_id === oshi.id), [allLogs, oshi.id]);

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: primaryColor(oshi.color) }]}
      onPress={() => navigation.navigate('LogList', { oshiId: oshi.id })}
    >
      <ColorDot color={oshi.color} size={s(40)} style={{ marginRight: s(12) }} />
      <View style={styles.cardBody}>
        <Text style={styles.oshiName}>{oshi.name}</Text>
        {oshi.group_name ? (
          <Text style={styles.groupName}>{oshi.group_name}</Text>
        ) : null}
        <Text style={styles.logCount}>{logs.length}件の記録</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { oshis, loadOshis, loadLogs } = useOshiStore();
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    loadOshis();
    loadLogs();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>推し一覧</Text>
        <TouchableOpacity onPress={() => navigation.navigate('OshiForm', {})}>
          <Text style={styles.addButton}>＋ 追加</Text>
        </TouchableOpacity>
      </View>

      {oshis.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>推しを登録しよう！</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('OshiForm', {})}
          >
            <Text style={styles.emptyButtonText}>登録する</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={oshis}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <OshiCard oshi={item} />}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('LogForm', {})}
      >
        <Text style={styles.fabText}>＋ 記録</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingTop: vs(20),
    paddingBottom: vs(8),
  },
  title: { fontSize: fs(22), fontWeight: 'bold', color: '#333' },
  addButton: { fontSize: fs(16), color: '#E91E8C', fontWeight: '600' },
  list: { paddingHorizontal: s(16), gap: vs(12) },
  card: {
    backgroundColor: '#fff',
    borderRadius: s(12),
    padding: s(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: s(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardBody: { flex: 1 },
  oshiName: { fontSize: fs(16), fontWeight: 'bold', color: '#333' },
  groupName: { fontSize: fs(13), color: '#888', marginTop: vs(2) },
  logCount: { fontSize: fs(12), color: '#aaa', marginTop: vs(4) },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: vs(16) },
  emptyText: { fontSize: fs(18), color: '#aaa' },
  emptyButton: {
    backgroundColor: '#E91E8C',
    paddingHorizontal: s(24),
    paddingVertical: vs(12),
    borderRadius: s(24),
  },
  emptyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: fs(16) },
  fab: {
    position: 'absolute',
    bottom: vs(24),
    right: s(24),
    backgroundColor: '#E91E8C',
    paddingHorizontal: s(20),
    paddingVertical: vs(14),
    borderRadius: s(28),
    shadowColor: '#E91E8C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { color: '#fff', fontWeight: 'bold', fontSize: fs(16) },
});
