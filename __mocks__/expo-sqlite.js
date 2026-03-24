'use strict';

// expo-sqlite のインメモリモック
function createMockDb() {
  const store = { oshis: [], logs: [] };
  let oshiSeq = 1;
  let logSeq = 1;

  return {
    execSync: jest.fn(),
    runSync: jest.fn((sql, params = []) => {
      if (/INSERT INTO oshis/.test(sql)) {
        const id = oshiSeq++;
        store.oshis.push({
          id,
          name: params[0],
          group_name: params[1],
          genre: params[2],
          icon_path: params[3],
          color: params[4],
          created_at: params[5],
        });
        return { lastInsertRowId: id };
      }
      if (/INSERT INTO logs/.test(sql)) {
        const id = logSeq++;
        store.logs.push({
          id,
          oshi_id: params[0],
          type: params[1],
          date: params[2],
          amount: params[3],
          memo: params[4],
          photo_path: params[5],
          created_at: params[6],
        });
        return { lastInsertRowId: id };
      }
      if (/UPDATE oshis/.test(sql)) {
        const idx = store.oshis.findIndex((o) => o.id === params[5]);
        if (idx !== -1) {
          store.oshis[idx] = {
            ...store.oshis[idx],
            name: params[0],
            group_name: params[1],
            genre: params[2],
            icon_path: params[3],
            color: params[4],
          };
        }
        return { lastInsertRowId: 0 };
      }
      if (/DELETE FROM oshis/.test(sql)) {
        const id = params[0];
        store.oshis = store.oshis.filter((o) => o.id !== id);
        store.logs = store.logs.filter((l) => l.oshi_id !== id);
        return { lastInsertRowId: 0 };
      }
      if (/DELETE FROM logs/.test(sql)) {
        store.logs = store.logs.filter((l) => l.id !== params[0]);
        return { lastInsertRowId: 0 };
      }
      return { lastInsertRowId: 0 };
    }),
    getAllSync: jest.fn((sql, params = []) => {
      if (/FROM oshis/.test(sql)) return [...store.oshis].reverse();
      if (/FROM logs/.test(sql) && /oshi_id = \?/.test(sql)) {
        return store.logs.filter((l) => l.oshi_id === params[0]);
      }
      if (/FROM logs/.test(sql) && /date = \?/.test(sql)) {
        return store.logs.filter((l) => l.date === params[0]);
      }
      return [...store.logs];
    }),
    getFirstSync: jest.fn((sql, params = []) => {
      if (/FROM oshis WHERE id/.test(sql)) {
        return store.oshis.find((o) => o.id === params[0]) ?? null;
      }
      if (/SUM\(amount\)/.test(sql)) {
        const total = store.logs
          .filter((l) => l.oshi_id === params[0])
          .reduce((sum, l) => sum + l.amount, 0);
        return { total };
      }
      if (/COUNT\(\*\)/.test(sql)) {
        const count = store.logs.filter((l) => l.oshi_id === params[0]).length;
        return { count };
      }
      return null;
    }),
    _store: store, // テスト用にストアを公開
  };
}

const mockDb = createMockDb();

module.exports = {
  openDatabaseSync: jest.fn(() => mockDb),
};
