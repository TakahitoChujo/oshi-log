export type Genre = 'アイドル' | 'VTuber' | 'その他';

export type LogType =
  | 'ライブ'
  | '配信'
  | 'グッズ'
  | '課金'
  | 'イベント'
  | 'その他';

export interface Oshi {
  id: number;
  name: string;
  group_name: string;
  genre: Genre;
  icon_path: string;
  color: string;
  created_at: string;
}

export interface OshiLog {
  id: number;
  oshi_id: number;
  type: LogType;
  date: string; // YYYY-MM-DD
  amount: number;
  memo: string;
  photo_path: string;
  created_at: string;
}
