declare global {
  var settings: {
    general: {
      preferredTitle: string;
      bgUrl: string;
      order: (string | [string, string])[];
    };
    mainText: {
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
}

export {};
