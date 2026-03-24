import {
  initDatabase,
  insertOshi,
  getAllOshis,
  getOshiById,
  updateOshi,
  deleteOshi,
  insertLog,
  getLogsByOshiId,
  getLogsByDate,
  deleteLog,
  getTotalAmountByOshiId,
  getLogCountByOshiId,
} from '../../db/database';

describe('database', () => {
  beforeEach(() => {
    initDatabase();
  });

  describe('Oshi CRUD', () => {
    it('推しを登録できる', () => {
      const id = insertOshi('花咲みく', 'スターズ', 'アイドル', '', '#FF69B4');
      expect(id).toBeGreaterThan(0);
    });

    it('全推しを取得できる', () => {
      insertOshi('花咲みく', 'スターズ', 'アイドル', '', '#FF69B4');
      insertOshi('天音すず', '', 'VTuber', '', '#9B59B6');
      const oshis = getAllOshis();
      expect(oshis.length).toBeGreaterThanOrEqual(2);
    });

    it('IDで推しを取得できる', () => {
      const id = insertOshi('花咲みく', 'スターズ', 'アイドル', '', '#FF69B4');
      const oshi = getOshiById(id);
      expect(oshi).not.toBeNull();
      expect(oshi?.name).toBe('花咲みく');
    });

    it('推しを更新できる', () => {
      const id = insertOshi('花咲みく', 'スターズ', 'アイドル', '', '#FF69B4');
      updateOshi(id, '花咲みく改', 'ニュースターズ', 'アイドル', '', '#FF0000');
      const oshi = getOshiById(id);
      expect(oshi?.name).toBe('花咲みく改');
    });

    it('推しを削除すると紐づくログも消える', () => {
      const oshiId = insertOshi('花咲みく', '', 'アイドル', '', '#FF69B4');
      insertLog(oshiId, 'ライブ', '2025-04-01', 8000, 'サイコーだった', '');
      deleteOshi(oshiId);
      expect(getOshiById(oshiId)).toBeNull();
      expect(getLogsByOshiId(oshiId)).toHaveLength(0);
    });
  });

  describe('Log CRUD', () => {
    it('ログを記録できる', () => {
      const oshiId = insertOshi('天音すず', '', 'VTuber', '', '#9B59B6');
      const logId = insertLog(oshiId, '配信', '2025-04-10', 500, 'スパチャした', '');
      expect(logId).toBeGreaterThan(0);
    });

    it('推しIDでログを取得できる', () => {
      const oshiId = insertOshi('天音すず', '', 'VTuber', '', '#9B59B6');
      insertLog(oshiId, '配信', '2025-04-10', 500, '', '');
      insertLog(oshiId, 'グッズ', '2025-04-11', 3000, '', '');
      const logs = getLogsByOshiId(oshiId);
      expect(logs.length).toBeGreaterThanOrEqual(2);
    });

    it('日付でログを取得できる', () => {
      const oshiId = insertOshi('天音すず', '', 'VTuber', '', '#9B59B6');
      insertLog(oshiId, 'ライブ', '2025-05-01', 10000, '', '');
      const logs = getLogsByDate('2025-05-01');
      expect(logs.length).toBeGreaterThanOrEqual(1);
    });

    it('ログを削除できる', () => {
      const oshiId = insertOshi('天音すず', '', 'VTuber', '', '#9B59B6');
      const logId = insertLog(oshiId, '配信', '2025-04-10', 500, '', '');
      deleteLog(logId);
      const logs = getLogsByOshiId(oshiId);
      expect(logs.find((l) => l.id === logId)).toBeUndefined();
    });

    it('累計金額を取得できる', () => {
      const oshiId = insertOshi('花咲みく', '', 'アイドル', '', '#FF69B4');
      insertLog(oshiId, 'ライブ', '2025-04-01', 8000, '', '');
      insertLog(oshiId, 'グッズ', '2025-04-02', 3000, '', '');
      const total = getTotalAmountByOshiId(oshiId);
      expect(total).toBeGreaterThanOrEqual(11000);
    });

    it('ログ件数を取得できる', () => {
      const oshiId = insertOshi('花咲みく', '', 'アイドル', '', '#FF69B4');
      insertLog(oshiId, 'ライブ', '2025-04-01', 8000, '', '');
      insertLog(oshiId, '配信', '2025-04-02', 0, '', '');
      const count = getLogCountByOshiId(oshiId);
      expect(count).toBeGreaterThanOrEqual(2);
    });
  });
});
