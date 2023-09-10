declare global {
  var settings: {
    searchEngine: 'google' | 'duckduckgo';
    openBookmarkInNewTab: boolean;
    bgUrl: string;
    order: string[];
  };
}

export {};
