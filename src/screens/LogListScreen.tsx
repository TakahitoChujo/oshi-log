import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useOshiStore } from '../store/useOshiStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type RouteT = RouteProp<RootStackParamList, 'LogList'>;

export default function LogListScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const { oshiId } = route.params;

  const { oshis, logs, loadLogs, loadOshis } = useOshiStore();
  const oshi = oshis.find((o) => o.id === oshiId);
  const oshiLogs = logs.filter((l) => l.oshi_id === oshiId).sort((a, b) => b.date.localeCompare(a.date));

  useEffect(() => {
    loadOshis();
    loadLogs();
    if (oshi) navigation.setOptions({ title: oshi.name });
  }, [oshi]);

  return (
    <SafeAreaView style={styles.container}>
      {oshiLogs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>まだ記録がありません</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('LogForm', { oshiId })}
          >
            <Text style={styles.addText}>記録する</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={oshiLogs}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('LogDetail', { logId: item.id })}
            >
              <View style={[styles.typeBadge, { backgroundColor: oshi?.color ?? '#E91E8C' }]}>
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.date}>{item.date}</Text>
                {item.memo ? (
                  <Text style={styles.memo} numberOfLines={2}>{item.memo}</Text>
                ) : null}
              </View>
              {item.amount > 0 && (
                <Text style={styles.amount}>¥{item.amount.toLocaleString()}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: oshi?.color ?? '#E91E8C' }]}
        onPress={() => navigation.navigate('LogForm', { oshiId })}
      >
        <Text style={styles.fabText}>＋ 記録</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  list: { padding: 16, gap: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  typeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  cardBody: { flex: 1 },
  date: { fontSize: 13, color: '#888' },
  memo: { fontSize: 14, color: '#333', marginTop: 2 },
  amount: { fontSize: 14, color: '#E91E8C', fontWeight: '600' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  emptyText: { fontSize: 16, color: '#aaa' },
  addButton: {
    backgroundColor: '#E91E8C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  fabText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
