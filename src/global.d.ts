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
      searchEngine: 'google' | 'duckduckgo' | 'bing';
      searchPlaceHolder: string | null;
      searchPlaceHolderAlignment: 'ltr' | 'rtl' | 'center';
    };
    bookmarksWidget: {
      openBookmarkInNewTab: boolean;
    };
    notesWidget: {
      notesValue: string;
    };
    weatherWidget: {
      degreeType: 'C' | 'F';
    };
  };

  var settings: NewTabSettings;
}

export {};
