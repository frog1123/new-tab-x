declare global {
  type NewTabSettings = {
    general: {
      debugMode: boolean;
      preferredTitle: string;
      bgUrl: string;
      accentColor: string;
      highlightColor: string;
      uiColor: string;
      uiBorderColor: string;
      order: (string | [string, string])[];
      animationSpeed: number;
      animationType: 'up' | 'down';
    };
    mainText: {
      type: 'time' | 'date' | 'custom';
      customText: string;
      font: string;
      mainTextColor: string;
      militaryTime: boolean;
      includeSeconds: boolean;
    };
    searchBar: {
      searchEngine: 'google' | 'duckduckgo' | 'bing' | 'yahoo';
      searchPlaceHolder: string | null;
      searchPlaceHolderAlignment: 'ltr' | 'rtl' | 'center';
      showIcon: boolean;
    };
    bookmarksWidget: {
      openBookmarkInNewTab: boolean;
      bookmarkRows: number;
    };
    notesWidget: {
      notesValue: string;
    };
    weatherWidget: {
      degreeType: 'C' | 'F';
      longitude: string;
      latitude: string;
    };
  };

  var settings: NewTabSettings;
}

export {};
