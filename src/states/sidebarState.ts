import { atom } from 'recoil';

export const sidebarState = atom({
	key: 'sidebarState',
	default: false, // デフォルトは閉じている状態
});
