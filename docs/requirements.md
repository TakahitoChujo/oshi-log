# 推し活ログアプリ 要件定義書

## 1. プロダクト概要

アイドル・VTuberファン向けの推し活記録アプリ。
ライブ参加・配信視聴・グッズ購入などの活動を一元管理し、思い出として残す。

---

## 2. ターゲットユーザー

- 20〜30代、アイドル / VTuber ファン
- 複数の推しを掛け持ちしている
- 活動が多く記録が追いつかない
- Twitter等で推し活報告をする習慣がある

---

## 3. 収益モデル

- **全機能無料**（MVP段階）
- マネタイズは後フェーズで検討

---

## 4. 機能要件

### 4.1 推し管理

| 機能 | 詳細 |
|---|---|
| 登録 | 名前・グループ名・ジャンル（アイドル/VTuber/その他）・テーマカラー |
| 編集 | 全項目変更可 |
| 削除 | 確認ダイアログあり。紐づくログも全削除（CASCADE） |
| 複数登録 | 制限なし |

### 4.2 活動ログ記録

| 機能 | 詳細 |
|---|---|
| 種別 | ライブ / 配信 / グッズ / 課金 / イベント / その他 |
| 入力項目 | 推し選択・種別・日付（YYYY-MM-DD）・金額（任意）・メモ（任意）・写真（任意） |
| 削除 | ログ詳細画面から削除。確認ダイアログあり |

### 4.3 カレンダー画面

- 月表示カレンダー
- 活動がある日にドット表示（推しカラーで色分け）
- 日付タップ → その日のログ一覧表示

### 4.4 統計画面

- 今月の記録件数・合計支出
- 推しごとの累計活動件数・累計支出
- 「今月のまとめ」をSNS投稿用画像として生成・シェア

### 4.5 設定画面

- 推しの追加・編集・削除
- アプリバージョン表示

---

## 5. 非機能要件

- **オフライン動作**：全データを端末内SQLiteに保存。サーバー不要
- **プライバシー**：データは端末外に送信しない
- **対応OS**：iOS / Android（React Native による同時対応）

---

## 6. 画面構成

### ボトムナビゲーション（4タブ）

```
🏠 ホーム　　📅 カレンダー　　📊 統計　　⚙️ 設定
```

### 画面一覧

| 画面名 | 概要 |
|---|---|
| HomeScreen | 推しカード一覧。FABからログ記録へ遷移 |
| CalendarScreen | 月表示カレンダー＋日付別ログ一覧 |
| StatsScreen | 統計ダッシュボード＋シェア機能 |
| SettingsScreen | 推し管理・アプリ情報 |
| OshiFormScreen | 推し登録・編集（モーダル） |
| LogFormScreen | 活動ログ記録（モーダル） |
| LogListScreen | 推し別ログ一覧 |
| LogDetailScreen | ログ詳細・削除 |

### 画面遷移

```
ホーム
 ├─ FAB → LogForm → 保存 → ホーム
 └─ 推しカード → LogList → LogDetail

カレンダー
 └─ 日付タップ → LogDetail

統計
 └─ シェアボタン → OS標準シェアシート

設定
 └─ 推し管理 → OshiForm（新規 or 編集）
```

---

## 7. データ設計

### テーブル: `oshis`

| カラム | 型 | 備考 |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| name | TEXT | 必須 |
| group_name | TEXT | 任意 |
| genre | TEXT | アイドル / VTuber / その他 |
| icon_path | TEXT | 画像ファイルパス（任意） |
| color | TEXT | テーマカラー（#hex） |
| created_at | TEXT | ISO8601 |

### テーブル: `logs`

| カラム | 型 | 備考 |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| oshi_id | INTEGER | FOREIGN KEY → oshis.id ON DELETE CASCADE |
| type | TEXT | ライブ/配信/グッズ/課金/イベント/その他 |
| date | TEXT | YYYY-MM-DD |
| amount | INTEGER | 金額（0=未入力） |
| memo | TEXT | 任意 |
| photo_path | TEXT | 任意 |
| created_at | TEXT | ISO8601 |

---

## 8. 技術スタック

| レイヤー | 採用技術 | バージョン |
|---|---|---|
| フレームワーク | React Native (Expo) | ~55.x |
| 言語 | TypeScript | ~5.9 |
| ナビゲーション | React Navigation (Bottom Tabs + Native Stack) | ^7.x |
| 状態管理 | Zustand | ^5.x |
| DB | expo-sqlite | ^55.x |
| カレンダー | react-native-calendars | ^1.x |
| グラフ | victory-native | ^41.x |
| シェア画像生成 | react-native-view-shot | ^4.x |
| SNSシェア | expo-sharing | ^55.x |
| 画像選択 | expo-image-picker | ^55.x |
| テスト | jest-expo + @testing-library/react-native | ^55.x / ^13.x |

---

## 9. プロジェクト構成

```
oshi-log/
├── App.tsx                        # エントリポイント（DB初期化 + Navigator）
├── jest.config.js                 # Jest設定
├── jest.setup.js                  # テスト用グローバルスタブ
├── __mocks__/                     # Jestモック（expo-sqlite等）
├── docs/
│   └── requirements.md            # 本ファイル
└── src/
    ├── types/
    │   └── index.ts               # Oshi / OshiLog 型定義
    ├── db/
    │   └── database.ts            # SQLite CRUD関数
    ├── store/
    │   └── useOshiStore.ts        # Zustand store
    ├── navigation/
    │   ├── types.ts               # 画面パラメータ型
    │   └── AppNavigator.tsx       # ナビゲーター定義
    ├── screens/
    │   ├── HomeScreen.tsx
    │   ├── CalendarScreen.tsx
    │   ├── StatsScreen.tsx
    │   ├── SettingsScreen.tsx
    │   ├── OshiFormScreen.tsx
    │   ├── LogFormScreen.tsx
    │   ├── LogListScreen.tsx
    │   └── LogDetailScreen.tsx
    └── __tests__/
        ├── db/database.test.ts    # DB層テスト（11件）
        └── store/useOshiStore.test.ts  # Store層テスト（5件）
```

---

## 10. 開発環境セットアップ

```bash
git clone https://github.com/TakahitoChujo/oshi-log.git
cd oshi-log
npm install

# テスト実行
npm test

# iOS（Mac必須）
npx expo prebuild --platform ios
npx expo run:ios

# Android
npx expo prebuild --platform android
npx expo run:android
```

---

## 11. 今後の拡張候補（v2以降）

| 機能 | 概要 |
|---|---|
| 写真添付 | カメラ / ライブラリから画像をログに添付 |
| 出演情報通知 | X（Twitter）/ 公式サイトのRSS連携で自動通知 |
| データエクスポート | CSV形式でエクスポート |
| 記念日リマインダー | 推しのデビュー日・誕生日などを通知 |
| ウィジェット | 最近の推し活をホーム画面に表示 |
| マネタイズ | ユーザー数が集まった段階でプレミアムプラン検討 |
