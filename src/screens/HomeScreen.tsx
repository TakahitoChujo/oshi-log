import React, { useEffect } from 'react';
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

type Nav = NativeStackNavigationProp<RootStackParamList>;

function OshiCard({ oshi }: { oshi: Oshi }) {
  const navigation = useNavigation<Nav>();
  const logs = useOshiStore((s) => s.logs.filter((l) => l.oshi_id === oshi.id));

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: oshi.color }]}
      onPress={() => navigation.navigate('LogList', { oshiId: oshi.id })}
    >
      <View style={[styles.colorDot, { backgroundColor: oshi.color }]} />
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
    padding: 16,
    paddingTop: 20,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  addButton: { fontSize: 16, color: '#E91E8C', fontWeight: '600' },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  cardBody: { flex: 1 },
  oshiName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  groupName: { fontSize: 13, color: '#888', marginTop: 2 },
  logCount: { fontSize: 12, color: '#aaa', marginTop: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  emptyText: { fontSize: 18, color: '#aaa' },
  emptyButton: {
    backgroundColor: '#E91E8C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#E91E8C',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#E91E8C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
