export type RootStackParamList = {
  // ボトムタブ
  MainTabs: undefined;

  // モーダル・スタック画面
  OshiForm: { oshiId?: number };   // 新規 or 編集
  LogForm: { oshiId?: number };    // ログ記録
  LogList: { oshiId: number };     // 推し別ログ一覧
  LogDetail: { logId: number };    // ログ詳細
};

export type TabParamList = {
  Home: undefined;
  Calendar: undefined;
  Stats: undefined;
  Settings: undefined;
};
