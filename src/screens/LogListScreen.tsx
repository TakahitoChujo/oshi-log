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
import ColorBg from '../components/ColorBg';
import { s, vs, fs } from '../utils/responsive';

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
  }, []);

  useEffect(() => {
    if (oshi) navigation.setOptions({ title: oshi.name });
  }, [oshi?.name]);

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
              <ColorBg color={oshi?.color ?? '#E91E8C'} style={styles.typeBadge}>
                <Text style={styles.typeText}>{item.type}</Text>
              </ColorBg>
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
        style={styles.fab}
        onPress={() => navigation.navigate('LogForm', { oshiId })}
      >
        <ColorBg color={oshi?.color ?? '#E91E8C'} style={styles.fabBg}>
          <Text style={styles.fabText}>＋ 記録</Text>
        </ColorBg>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  list: { padding: s(16), gap: vs(10) },
  card: {
    backgroundColor: '#fff',
    borderRadius: s(12),
    padding: s(14),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  typeBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: s(8),
    marginRight: s(12),
  },
  typeText: { color: '#fff', fontSize: fs(12), fontWeight: '600' },
  cardBody: { flex: 1 },
  date: { fontSize: fs(13), color: '#888' },
  memo: { fontSize: fs(14), color: '#333', marginTop: vs(2) },
  amount: { fontSize: fs(14), color: '#E91E8C', fontWeight: '600' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: vs(16) },
  emptyText: { fontSize: fs(16), color: '#aaa' },
  addButton: {
    backgroundColor: '#E91E8C',
    paddingHorizontal: s(24),
    paddingVertical: vs(12),
    borderRadius: s(24),
  },
  addText: { color: '#fff', fontWeight: 'bold', fontSize: fs(15) },
  fab: {
    position: 'absolute',
    bottom: vs(24),
    right: s(24),
    borderRadius: s(28),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    overflow: 'hidden',
  },
  fabBg: {
    paddingHorizontal: s(20),
    paddingVertical: vs(14),
    alignItems: 'center' as const,
  },
  fabText: { color: '#fff', fontWeight: 'bold', fontSize: fs(16) },
});
