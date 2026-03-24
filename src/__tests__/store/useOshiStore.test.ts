import { useOshiStore } from '../../store/useOshiStore';

// DB全体をモック
jest.mock('../../db/database', () => {
  const oshis: any[] = [];
  const logs: any[] = [];
  let oshiSeq = 1;
  let logSeq = 1;

  return {
    getAllOshis: jest.fn(() => [...oshis]),
    insertOshi: jest.fn((name, group_name, genre, icon_path, color) => {
      const id = oshiSeq++;
      oshis.push({ id, name, group_name, genre, icon_path, color, created_at: new Date().toISOString() });
      return id;
    }),
    updateOshi: jest.fn((id, name, group_name, genre, icon_path, color) => {
      const idx = oshis.findIndex((o) => o.id === id);
      if (idx !== -1) oshis[idx] = { ...oshis[idx], name, group_name, genre, icon_path, color };
    }),
    deleteOshi: jest.fn((id) => {
      const idx = oshis.findIndex((o) => o.id === id);
      if (idx !== -1) oshis.splice(idx, 1);
      const logIdxs = logs.reduce((acc: number[], l, i) => (l.oshi_id === id ? [...acc, i] : acc), []);
      logIdxs.reverse().forEach((i) => logs.splice(i, 1));
    }),
    getAllLogs: jest.fn(() => [...logs]),
    insertLog: jest.fn((oshi_id, type, date, amount, memo, photo_path) => {
      const id = logSeq++;
      logs.push({ id, oshi_id, type, date, amount, memo, photo_path, created_at: new Date().toISOString() });
      return id;
    }),
    deleteLog: jest.fn((id) => {
      const idx = logs.findIndex((l) => l.id === id);
      if (idx !== -1) logs.splice(idx, 1);
    }),
    getLogsByOshiId: jest.fn((oshi_id) => logs.filter((l) => l.oshi_id === oshi_id)),
  };
});

describe('useOshiStore', () => {
  beforeEach(() => {
    useOshiStore.setState({ oshis: [], logs: [] });
  });

  it('推しを追加してloadOshisで取得できる', () => {
    useOshiStore.getState().addOshi('花咲みく', 'スターズ', 'アイドル', '', '#FF69B4');
    const { oshis } = useOshiStore.getState();
    expect(oshis.length).toBeGreaterThanOrEqual(1);
    expect(oshis[0].name).toBe('花咲みく');
  });

  it('推しを編集できる', () => {
    useOshiStore.getState().addOshi('花咲みく', '', 'アイドル', '', '#FF69B4');
    const id = useOshiStore.getState().oshis[0].id;
    useOshiStore.getState().editOshi(id, '花咲みく改', 'スターズ', 'アイドル', '', '#FF0000');
    const updated = useOshiStore.getState().oshis.find((o) => o.id === id);
    expect(updated?.name).toBe('花咲みく改');
  });

  it('推しを削除できる', () => {
    useOshiStore.getState().addOshi('花咲みく', '', 'アイドル', '', '#FF69B4');
    const id = useOshiStore.getState().oshis[0].id;
    useOshiStore.getState().removeOshi(id);
    expect(useOshiStore.getState().oshis.find((o) => o.id === id)).toBeUndefined();
  });

  it('ログを追加してloadLogsで取得できる', () => {
    useOshiStore.getState().addOshi('天音すず', '', 'VTuber', '', '#9B59B6');
    const oshiId = useOshiStore.getState().oshis[0].id;
    useOshiStore.getState().addLog(oshiId, 'ライブ', '2025-05-01', 8000, 'よかった', '');
    const { logs } = useOshiStore.getState();
    expect(logs.length).toBeGreaterThanOrEqual(1);
    expect(logs[0].type).toBe('ライブ');
  });

  it('ログを削除できる', () => {
    useOshiStore.getState().addOshi('天音すず', '', 'VTuber', '', '#9B59B6');
    const oshiId = useOshiStore.getState().oshis[0].id;
    useOshiStore.getState().addLog(oshiId, '配信', '2025-05-02', 500, '', '');
    const logId = useOshiStore.getState().logs[0].id;
    useOshiStore.getState().removeLog(logId);
    expect(useOshiStore.getState().logs.find((l) => l.id === logId)).toBeUndefined();
  });
});
