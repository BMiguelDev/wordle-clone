// Type definition of the <gameSettings> state variable
export interface gameSettingsType {
    currentGameSettings: {
        numberStages: number;
        wordLength: number;
        hardMode: boolean;
        lazyMode: boolean;
    };
    futureGameSettings: {
        numberStages: number;
        wordLength: number;
    };
}

// Type definition of the <randomWordAndArray> state variable
export interface randomWordAndArrayType {
    randomWord: string;
    randomWordArray: string[];
}

// Type definition of the <isApiAvailable> state variable
export interface isApiAvailableType {
    isDictionaryApiAvailable: boolean;
    isWordApiAvailable: boolean;
}

// Type definition of the <gameNotification> state variable
export interface gameNotificationType {
    isGameNotification: boolean;
    gameNotificationText: string;
}

// Type definition of the <isPopUpOpen> state varialbe
export interface isPopUpOpenType {
    isSettingsPopUpOpen: boolean;
    isStatsPopUpOpen: boolean;
    isHelpPopUpOpen: boolean;
    isExtraMenuOpen: boolean;
}

//Type definition of the <playerStatistics> state variable
export interface playerStatisticsType {
    gamesFinished: number;
    gamesWon: number;
    gamesLost: number;
    currentStreak: number;
    maxStreak: number;
    // This array holds, in index 0, the number of wins with 1 guess, in index 1, the number of wins with 2 guesses, and
    // so on until index 12, with the number of wins with 13 guesses.
    NumberWinsWithXGuesses: number[];
}

// Type definition of the <gameDescription> state variable
export interface gameDescriptionType {
    isGameFinished: boolean;
    isGameWin: boolean;
    attemptedGuesses: string[];
    numberGuessesNeededToWin: number
}

// Type definition of the <isWordLoading> state variable
export interface isWordLoadingType {
    isLoading: boolean;
    startWaitingDate: number;
}