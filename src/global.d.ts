declare global {
  var settings: {
    preferredTitle: string;
    searchEngine: 'google' | 'duckduckgo';
    militaryTime: boolean;
    openBookmarkInNewTab: boolean;
    bgUrl: string;
    order: string[];
  };
}

export {};
