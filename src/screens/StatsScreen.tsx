import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useOshiStore } from '../store/useOshiStore';
import { getTotalAmountByOshiId, getLogCountByOshiId } from '../db/database';
import ColorDot from '../components/ColorDot';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { s, vs, fs } from '../utils/responsive';

export default function StatsScreen() {
  const { oshis, logs, loadOshis, loadLogs } = useOshiStore();
  const viewShotRef = useRef<ViewShot>(null);

  useEffect(() => {
    loadOshis();
    loadLogs();
  }, []);

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisMonthLogs = logs.filter((l) => l.date.startsWith(thisMonth));

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>統計</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Text style={styles.shareText}>シェア</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
          <View style={styles.shareCard}>
            <Text style={styles.monthLabel}>{thisMonth} の推し活まとめ</Text>
            <Text style={styles.subLabel}>
              今月の記録: {thisMonthLogs.length}件 ／ 合計:{' '}
              ¥{thisMonthLogs.reduce((s, l) => s + l.amount, 0).toLocaleString()}
            </Text>

            {oshis.map((oshi) => {
              const count = getLogCountByOshiId(oshi.id);
              const total = getTotalAmountByOshiId(oshi.id);
              const monthCount = thisMonthLogs.filter((l) => l.oshi_id === oshi.id).length;
              return (
                <View key={oshi.id} style={styles.oshiRow}>
                  <ColorDot color={oshi.color} size={s(36)} style={{ marginRight: s(12) }} />
                  <View style={styles.oshiInfo}>
                    <Text style={styles.oshiName}>{oshi.name}</Text>
                    <Text style={styles.oshiSub}>{oshi.group_name}</Text>
                  </View>
                  <View style={styles.oshiStats}>
                    <Text style={styles.statValue}>今月 {monthCount}件</Text>
                    <Text style={styles.statValue}>累計 ¥{total.toLocaleString()}</Text>
                    <Text style={styles.statSub}>全{count}件</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ViewShot>
      </ScrollView>
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
  shareButton: {
    backgroundColor: '#E91E8C',
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    borderRadius: s(20),
  },
  shareText: { color: '#fff', fontWeight: 'bold', fontSize: fs(14) },
  scroll: { padding: s(16) },
  shareCard: {
    backgroundColor: '#fff',
    borderRadius: s(16),
    padding: s(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  monthLabel: { fontSize: fs(18), fontWeight: 'bold', color: '#333', marginBottom: vs(4) },
  subLabel: { fontSize: fs(13), color: '#888', marginBottom: vs(16) },
  oshiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  oshiInfo: { flex: 1 },
  oshiName: { fontSize: fs(15), fontWeight: 'bold', color: '#333' },
  oshiSub: { fontSize: fs(12), color: '#aaa', marginTop: vs(2) },
  oshiStats: { alignItems: 'flex-end' },
  statValue: { fontSize: fs(13), color: '#E91E8C', fontWeight: '600' },
  statSub: { fontSize: fs(11), color: '#bbb', marginTop: vs(2) },
});
