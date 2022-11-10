// Type definition of the <gameSettings> state variable
export interface gameSettingsType {
    numberStages: number;
    wordLength: number;
    hardMode: boolean;
}

// Type definition of the <gameSettings2> state variable
export interface gameSettings2Type {
    currentGameSettings: {
        numberStages: number;
        wordLength: number;
        hardMode: boolean;
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
