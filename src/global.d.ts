declare global {
  var settings: {
    preferredTitle: string;
    searchEngine: 'google' | 'duckduckgo';
    openBookmarkInNewTab: boolean;
    bgUrl: string;
    order: string[];
  };
}

export {};
