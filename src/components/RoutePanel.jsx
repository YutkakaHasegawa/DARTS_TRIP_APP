/**
 * ルート表示パネルコンポーネント
 * 
 * Props:
 * - selectedProfile (object): 選択されたプロフィール {value, label}
 * - onProfileChange (function): プロフィール変更時のコールバック
 * - onShowRoute (function): ルート表示ボタン押下時のコールバック
 * - disabled (boolean): ボタンが無効かどうか
 * - loading (boolean): ルート取得中かどうか
 */

import Select from 'react-select'
import { ROUTING_PROFILES } from '../constants/constants'

// loadingのデフォルト値をfalseに設定して、親コンポーネントから渡されない場合でも安全に動作するようにする
function RoutePanel({
  selectedProfile,
  onProfileChange,
  onShowRoute,
  disabled,
  loading = false
}) {
  return (
    <div className="rough-route">
      <Select
        options={ROUTING_PROFILES}
        value={selectedProfile}
        onChange={onProfileChange}
        isDisabled={disabled || loading}
        isSearchable={false}
        styles={{
          container: (base) => ({
            ...base,
            width: 150,
          }),
        }}
      />
      <button
        onClick={onShowRoute}
        className="route-button"
        disabled={disabled || loading}
      >
        簡易ルートを確認する ({selectedProfile.label})
      </button>
    </div>
  )
}

export default RoutePanel
