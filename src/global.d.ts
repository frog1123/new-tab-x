declare global {
  type NewTabSettings = {
    general: {
      debugMode: boolean;
      preferredTitle: string;
      bgUrl: string;
      accentColor: string;
      order: (string | [string, string])[];
    };
    mainText: {
      font: 'Arial, sans-serif' | 'Monaco, monospace';
      militaryTime: boolean;
    };
    searchBar: {
      searchEngine: 'google' | 'duckduckgo';
    };
    bookmarksWidget: {
      openBookmarkInNewTab: boolean;
    };
    notesWidget: {
      notesValue: string;
    };
  };

  var settings: NewTabSettings;
}

export {};
