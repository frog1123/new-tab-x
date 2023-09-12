declare global {
  var settings: {
    preferredTitle: string;
    searchEngine: 'google' | 'duckduckgo';
    militaryTime: boolean;
    openBookmarkInNewTab: boolean;
    notesValue: string;
    bgUrl: string;
    order: (string | [string, string])[];
  };
}

export {};
