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
      type: 'time' | 'date';
      font: 'Arial, sans-serif' | 'Monaco, monospace';
      militaryTime: boolean;
    };
    searchBar: {
      searchEngine: 'google' | 'duckduckgo' | 'bing' | 'yahoo';
      searchPlaceHolder: string | null;
      searchPlaceHolderAlignment: 'ltr' | 'rtl' | 'center';
      showIcon: boolean;
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
