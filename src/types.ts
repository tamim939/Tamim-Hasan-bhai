/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export interface WebAppInitData {
  user?: TelegramUser;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: WebAppInitData;
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (fn: () => void) => void;
        };
        themeParams: {
          bg_color: string;
          text_color: string;
          hint_color: string;
          link_color: string;
          button_color: string;
          button_text_color: string;
        };
      };
    };
  }
}

export interface SMMService {
  id: string;
  category: string;
  name: string;
  pricePer1000: number;
  min: number;
  max: number;
  description: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'telegram' | 'twitter';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  platform: SMMService['platform'];
}
