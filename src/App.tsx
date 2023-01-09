import React, { useCallback, useEffect, useRef, useState } from "react";

import "./App.scss";
import { WordData } from "./data/WordData";
import {
    gameNotificationType,
    gameSettingsType,
    isApiAvailableType,
    isPopUpOpenType,
    playerStatisticsType,
    randomWordAndArrayType,
    gameDescriptionType,
} from "./models/model";
import Line from "./components/Line/Line";
import Navbar from "./components/Navbar/Navbar";
import KeyboardRow from "./components/KeyboardRow/KeyboardRow";
import SettingsPopUp from "./components/SettingsPopUp/SettingsPopUp";
import HelpPopUp from "./components/HelpPopUp/HelpPopUp";
import StatsPopUp from "./components/StatsPopUp/StatsPopUp";
import ExtraMenu from "./components/ExtraMenu/ExtraMenu";

const LOCAL_STORAGE_KEY_GAME_SETTINGS = "WordleCloneApp.gameSettings";
const LOCAL_STORAGE_KEY_RANDOM_WORD_AND_ARRAY = "WordleCloneApp.randomWordAndArray";
const LOCAL_STORAGE_KEY_STAGE_WORD_ARRAY = "WordleCloneApp.stageWordArray";
const LOCAL_STORAGE_KEY_CURRENT_GUESS = "WordleCloneApp.currentGuess";
const LOCAL_STORAGE_KEY_CURRENT_STAGE = "WordleCloneApp.currentStage";
const LOCAL_STORAGE_KEY_LINE_CLASS_NAMES = "WordleCloneApp.lineClassNames";
const LOCAL_STORAGE_KEY_IS_WORD_API_AVAILABLE = "WordleCloneApp.isWordApiAvailable";
const LOCAL_STORAGE_KEY_GAME_NOTIFICATION = "WordleCloneApp.gameNotification";
const LOCAL_STORAGE_KEY_IS_DARK_MODE = "WordleCloneApp.isDarkMode";
const LOCAL_STORAGE_KEY_IS_HIGH_CONTRAST_MODE = "WordleCloneApp.isHighContrastMode";
const LOCAL_STORAGE_KEY_IS_POPUP_OPEN = "WordleCloneApp.isPopUpOpen";
const LOCAL_STORAGE_KEY_PLAYER_STATISTICS = "WordleCloneApp.playerStatistics";
const LOCAL_STORAGE_KEY_GAME_DESCRIPTION = "WordleCloneApp.gameDescription";

const ALPHABET_LETTERS = "qwertyuiopasdfghjklzxcvbnm";
const MAX_NUMBER_STAGES = 12;
const MIN_NUMBER_STAGES = 1;
const MAX_WORD_LENGTH = 10;
const MIN_WORD_LENGTH = 2;

const DUMMY_DATA_WORD_LENGTH = 5;

export default function App() {
    // Object state variable to hold the current and future game settings
    const [gameSettings, setgameSettings] = useState<gameSettingsType>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY_GAME_SETTINGS);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else
            return {
                currentGameSettings: {
                    numberStages: 6,
                    wordLength: 5,
                    hardMode: false,
                    lazyMode: false,
                },
                futureGameSettings: {
                    numberStages: 6,
                    wordLength: 5,
                },
            };
    });

    const [randomWordAndArray, setRandomWordAndArray] = useState<randomWordAndArrayType>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY_RANDOM_WORD_AND_ARRAY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else
            return {
                randomWord: "",
                randomWordArray: [],
            };
    });

    const [stageWordArray, setStageWordArray] = useState<string[]>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY_STAGE_WORD_ARRAY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return Array(gameSettings.currentGameSettings.numberStages).fill("");
    });

    const [currentGuess, setCurrentGuess] = useState<string>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_GUESS);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return "";
    });

    const [currentStage, setCurrentStage] = useState<number>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_STAGE);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return 0;
    });

    // Object state variable holding a boolean for the availability of each API used
    const [isApiAvailable, setIsApiAvailable] = useState<isApiAvailableType>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY_IS_WORD_API_AVAILABLE);
        if (localStorageItem)
            return { isDictionaryApiAvailable: false, isWordApiAvailable: JSON.parse(localStorageItem) };
        else
            return {
                isDictionaryApiAvailable: false,
                isWordApiAvailable: false,
            };
    });

    // Object state variable to handle whether a game notification is being shown, and what text to show
    const [gameNotification, setGameNotification] = useState<gameNotificationType>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY_GAME_NOTIFICATION);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else
            return {
                isGameNotification: false,
                gameNotificationText: "",
            };
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY_IS_DARK_MODE);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else {
            // Set isDarkMode based on browser's settings
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? true : false;
        }
    });

    const [isHighContrastMode, setIsHighContrastMode] = useState<boolean>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY_IS_HIGH_CONTRAST_MODE);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return false;
    });

    // Object state variable to handle whether each pop up is open or not
    const [isPopUpOpen, setIsPopUpOpen] = useState<isPopUpOpenType>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY_IS_POPUP_OPEN);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else
            return {
                isSettingsPopUpOpen: false,
                isStatsPopUpOpen: false,
                isHelpPopUpOpen: false,
                isExtraMenuOpen: false,
            };
    });

    // Object state variable to hold the statistics of the player's games
    const [playerStatistics, setPlayerStatistics] = useState<playerStatisticsType>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY_PLAYER_STATISTICS);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else
            return {
                gamesFinished: 0,
                gamesWon: 0,
                gamesLost: 0,
                currentStreak: 0,
                maxStreak: 0,
                NumberWinsWithXGuesses: Array(MAX_NUMBER_STAGES).fill(0),
            };
    });

    // Object state variable to hold game description
    const [gameDescription, setGameDescription] = useState<gameDescriptionType>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY_GAME_DESCRIPTION);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else
            return {
                isGameFinished: false,
                isGameWin: false,
                attemptedGuesses: [],
                numberGuessesNeededToWin: 0,
            };
    });

    const [lineClassNames, setLineClassNames] = useState<string[][]>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY_LINE_CLASS_NAMES);
        // If upon page refresh game had already ended, add "faster_animation" to make tiles animate faster and replace
        // "green_correct_animation" with just "green" to avoid repeating winning animation
        if (localStorageItem) {
            let newLineClassNames: string[][] = JSON.parse(localStorageItem);
            return newLineClassNames.map((line) => {
                return line.map((classString) => {
                    if (gameDescription.isGameFinished) {
                        classString += " faster_animation";
                    }
                    if (classString.includes("green_correct_animation"))
                        return classString.replace("green_correct_animation", "green");
                    else return classString;
                });
            });
        } else
            return Array(gameSettings.currentGameSettings.numberStages).fill(
                Array(gameSettings.currentGameSettings.wordLength).fill("tile")
            );
    });

    const [isDeviceSmartphoneLandscape, setIsDeviceSmartphoneLandscape] = useState<boolean>(() => {
        return window.innerWidth > 500 && window.innerWidth < 1001 && window.innerHeight < 651 ? true : false;
    });

    // useEffect hooks to store state variables in local storage whenever they update
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_GAME_SETTINGS, JSON.stringify(gameSettings));
    }, [gameSettings]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_RANDOM_WORD_AND_ARRAY, JSON.stringify(randomWordAndArray));
    }, [randomWordAndArray]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_STAGE_WORD_ARRAY, JSON.stringify(stageWordArray));
    }, [stageWordArray]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_GUESS, JSON.stringify(currentGuess));
    }, [currentGuess]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_STAGE, JSON.stringify(currentStage));
    }, [currentStage]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_LINE_CLASS_NAMES, JSON.stringify(lineClassNames));
    }, [lineClassNames]);

    useEffect(() => {
        localStorage.setItem(
            LOCAL_STORAGE_KEY_IS_WORD_API_AVAILABLE,
            JSON.stringify(isApiAvailable.isWordApiAvailable)
        );
    }, [isApiAvailable.isWordApiAvailable]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_GAME_NOTIFICATION, JSON.stringify(gameNotification));
    }, [gameNotification]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_IS_DARK_MODE, JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_IS_HIGH_CONTRAST_MODE, JSON.stringify(isHighContrastMode));
    }, [isHighContrastMode]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_IS_POPUP_OPEN, JSON.stringify(isPopUpOpen));
    }, [isPopUpOpen]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_PLAYER_STATISTICS, JSON.stringify(playerStatistics));
    }, [playerStatistics]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_GAME_DESCRIPTION, JSON.stringify(gameDescription));
    }, [gameDescription]);

    // Ref variable to access reset button
    const resetButtonRef = useRef<HTMLButtonElement>(null);

    // Ref variable to access app container div
    const appDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            // Check if words Api is available
            const checkWordsApi = await fetch("https://api.datamuse.com/words?sp=?????", { cache: "no-store" })
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    console.log("Error: Word API Unavailable");
                    setIsApiAvailable((prevIsApiAvailable) => ({
                        ...prevIsApiAvailable,
                        isWordApiAvailable: false,
                    }));
                    const randomWord = WordData[Math.floor(Math.random() * WordData.length)].toLowerCase();
                    setRandomWordAndArray({ randomWord: randomWord, randomWordArray: WordData });
                });

            if (!checkWordsApi?.ok) {
                const randomWord = WordData[Math.floor(Math.random() * WordData.length)].toLowerCase();
                setRandomWordAndArray({ randomWord: randomWord, randomWordArray: WordData });
            } else if (checkWordsApi?.ok) {
                setIsApiAvailable((prevIsApiAvailable) => ({ ...prevIsApiAvailable, isWordApiAvailable: true }));
                // Get 4 random letters that can't be part of the retrieved words, because API doesn't return random words.
                let randomLettersArray: string[] = [];
                for (let i = 0; i < 4; i++) {
                    randomLettersArray.push(
                        ALPHABET_LETTERS.split("")[Math.floor(Math.random() * ALPHABET_LETTERS.length)]
                    );
                }
                const randomLettersString = randomLettersArray.toString().replaceAll(",", "");

                // Get 25 words from API that may include "a"
                const randomWordsData1 = await fetch(
                    `https://api.datamuse.com/words?sp=${"?".repeat(
                        gameSettings.currentGameSettings.wordLength
                    )}-1234567890${randomLettersString}&max=25`
                );
                const randomWordsArray1 = await randomWordsData1.json();

                // Get 75 words from API that don't include "a" (due to most words gotten from API call including and starting with "a")
                const randomWordsData2 = await fetch(
                    `https://api.datamuse.com/words?sp=${"?".repeat(
                        gameSettings.currentGameSettings.wordLength
                    )}-1234567890aA${randomLettersString}&max=75`
                );
                const randomWordsArray2 = await randomWordsData2.json();

                // Join both arrays and keep only the words
                const jointRandomWordsArray = [...randomWordsArray1, ...randomWordsArray2];
                const newJointRandomWordsArray: string[] = jointRandomWordsArray.map((element) => {
                    const elementWord: string = element.word;
                    if (elementWord.includes(" ")) {
                        return undefined;
                    }
                    return element.word;
                });
                const newJointRandomWordsArrayNoWhiteSpaces = newJointRandomWordsArray.filter(
                    (element) => element != null
                );
                const randomWord =
                    newJointRandomWordsArrayNoWhiteSpaces[
                        Math.floor(Math.random() * newJointRandomWordsArrayNoWhiteSpaces.length)
                    ].toLowerCase();
                setRandomWordAndArray({
                    randomWord: randomWord,
                    randomWordArray: newJointRandomWordsArrayNoWhiteSpaces,
                });
            }
        };

        // Check if dictionary Api is available
        const checkDictionaryApi = async () => {
            const dictionaryTestData = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/hello", {
                cache: "no-store",
            })
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    console.log("Error: Dictionary API Unavailable");
                    setIsApiAvailable((prevIsApiAvailable) => ({
                        ...prevIsApiAvailable,
                        isDictionaryApiAvailable: false,
                    }));
                    setgameSettings((prevGameSettings) => ({
                        ...prevGameSettings,
                        currentGameSettings: {
                            ...prevGameSettings.currentGameSettings,
                            lazyMode: true,
                        },
                    }));
                });
            if (dictionaryTestData?.ok)
                setIsApiAvailable((prevIsApiAvailable) => ({ ...prevIsApiAvailable, isDictionaryApiAvailable: true }));
            else if (!dictionaryTestData?.ok) {
                setIsApiAvailable((prevIsApiAvailable) => ({
                    ...prevIsApiAvailable,
                    isDictionaryApiAvailable: false,
                }));
                setgameSettings((prevGameSettings) => ({
                    ...prevGameSettings,
                    currentGameSettings: {
                        ...prevGameSettings.currentGameSettings,
                        lazyMode: true,
                    },
                }));
            }
        };

        // Check if words Api is available
        const checkWordsApi = () => {
            fetch("https://api.datamuse.com/words?sp=?????", { cache: "no-store" })
                .then((response) => {
                    if (response.ok) {
                        setIsApiAvailable((prevIsApiAvailable) => ({
                            ...prevIsApiAvailable,
                            isWordApiAvailable: true,
                        }));
                    } else {
                        setIsApiAvailable((prevIsApiAvailable) => ({
                            ...prevIsApiAvailable,
                            isWordApiAvailable: false,
                        }));
                    }
                })
                .catch((error) => {
                    console.log("Error: Word API Unavailable");
                    setIsApiAvailable((prevIsApiAvailable) => ({
                        ...prevIsApiAvailable,
                        isWordApiAvailable: false,
                    }));
                });
        };

        const handleResize = () => {
            setIsDeviceSmartphoneLandscape(
                window.innerWidth > 500 && window.innerWidth < 1001 && window.innerHeight < 651 ? true : false
            );

            // Update height to prevent 100vh bug where page may be covered by the browser's UI (in mobile) 
            if(appDivRef.current) appDivRef.current.style.height=`${window.innerHeight}px`;
        };

        if (randomWordAndArray.randomWordArray.length === 0) fetchData();
        checkWordsApi();
        checkDictionaryApi();
        window.addEventListener("resize", handleResize);
        handleResize();
        setIsLoading(false);

        return () => {
            window.removeEventListener("resize", handleResize);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStageChange = useCallback(() => {
        if (currentStage < gameSettings.currentGameSettings.numberStages) {
            //If current guess is correct, skip color checks and give every tile the class "green_correct_animation"
            if (currentGuess === randomWordAndArray.randomWord) {
                const colorArray: string[] = Array(gameSettings.currentGameSettings.wordLength).fill(
                    "tile green_correct_animation"
                );
                setLineClassNames((prevLineClassNames) => {
                    let newLineClassNames = [...prevLineClassNames];
                    newLineClassNames[currentStage] = colorArray;
                    return newLineClassNames;
                });
            } else {
                //Make checks
                let colorArray: string[] = [];
                currentGuess
                    .toLowerCase()
                    .split("")
                    .forEach((currentGuessChar, currentGuessIndex) => {
                        let color: string = "tile grey";
                        randomWordAndArray.randomWord.split("").forEach((randomWordChar, randomWordIndex) => {
                            if (currentGuessChar === randomWordChar) {
                                if (color !== "tile green") color = "tile yellow";
                            }
                            if (currentGuessChar === randomWordChar && currentGuessIndex === randomWordIndex)
                                color = "tile green";
                        });
                        colorArray.push(color);
                    });
                setLineClassNames((prevLineClassNames) => {
                    let newLineClassNames = [...prevLineClassNames];
                    newLineClassNames[currentStage] = colorArray;
                    return newLineClassNames;
                });
            }

            setStageWordArray((prevStageWordArray) => {
                let newStageWordArray = [...prevStageWordArray];
                newStageWordArray[currentStage] = currentGuess;
                return newStageWordArray;
            });

            setGameDescription((prevGameDescription) => {
                let newAttemptedGuesses = [...prevGameDescription.attemptedGuesses];
                newAttemptedGuesses.push(currentGuess);
                return {
                    ...prevGameDescription,
                    attemptedGuesses: newAttemptedGuesses,
                };
            });

            // Handle game win
            if (currentGuess === randomWordAndArray.randomWord) {
                // Set notification for game end
                if (gameNotification.isGameNotification)
                    setTimeout(() => {
                        resetGameNotificationAnimation();
                    }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 600);
                if (currentStage === 0) {
                    // Show the notification after a short delay, to leave time for tile animations to end
                    setTimeout(() => {
                        setGameNotification({ gameNotificationText: "L-U-C-K-Y", isGameNotification: true });
                    }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 600);
                } else if (currentStage === 1) {
                    setTimeout(() => {
                        setGameNotification({ gameNotificationText: "Outstanding", isGameNotification: true });
                    }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 600);
                } else if (currentStage === 2) {
                    setTimeout(() => {
                        setGameNotification({ gameNotificationText: "Impressive", isGameNotification: true });
                    }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 600);
                } else if (currentStage === 3) {
                    setTimeout(() => {
                        setGameNotification({ gameNotificationText: "Amazing", isGameNotification: true });
                    }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 600);
                } else if (currentStage === 4) {
                    // If game was close, set appropriate notification text, otherwise set congratulating notification text
                    if (gameSettings.currentGameSettings.numberStages - currentStage < 2) {
                        setTimeout(() => {
                            setGameNotification({ gameNotificationText: "That was close!", isGameNotification: true });
                        }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 600);
                    } else {
                        setTimeout(() => {
                            setGameNotification({ gameNotificationText: "Well done!", isGameNotification: true });
                        }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 600);
                    }
                } else if (currentStage === 5) {
                    if (gameSettings.currentGameSettings.numberStages - currentStage < 2) {
                        setTimeout(() => {
                            setGameNotification({ gameNotificationText: "Phew!", isGameNotification: true });
                        }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 600);
                    } else {
                        setTimeout(() => {
                            setGameNotification({ gameNotificationText: "Well done!", isGameNotification: true });
                        }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 600);
                    }
                } else {
                    if (gameSettings.currentGameSettings.numberStages - currentStage < 2) {
                        setTimeout(() => {
                            setGameNotification({ gameNotificationText: "That was close!", isGameNotification: true });
                        }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 600);
                    } else {
                        setTimeout(() => {
                            setGameNotification({ gameNotificationText: "Well done!", isGameNotification: true });
                        }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 600);
                    }
                }

                //Update player statistics with 1 more win
                setPlayerStatistics((prevPlayerStatistics) => {
                    let newNumberWinsWithXGuesses = [...prevPlayerStatistics.NumberWinsWithXGuesses];
                    newNumberWinsWithXGuesses[currentStage] += 1;
                    return {
                        ...prevPlayerStatistics,
                        gamesFinished: prevPlayerStatistics.gamesFinished + 1,
                        gamesWon: prevPlayerStatistics.gamesWon + 1,
                        currentStreak: prevPlayerStatistics.currentStreak + 1,
                        maxStreak:
                            prevPlayerStatistics.currentStreak + 1 > prevPlayerStatistics.maxStreak
                                ? prevPlayerStatistics.currentStreak + 1
                                : prevPlayerStatistics.maxStreak,
                        NumberWinsWithXGuesses: newNumberWinsWithXGuesses,
                    };
                });

                setGameDescription((prevGameDescription) => ({
                    ...prevGameDescription,
                    isGameFinished: true,
                    isGameWin: true,
                    numberGuessesNeededToWin: currentStage + 1,
                }));

                // After a short delay, show the statistics pop up
                setTimeout(() => {
                    setIsPopUpOpen((prevIsPopUpOpen) => ({ ...prevIsPopUpOpen, isStatsPopUpOpen: true }));
                }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 600 + (gameSettings.currentGameSettings.wordLength - 1) * 100 + 500 + 200);
            }
            setCurrentGuess("");
            setCurrentStage((prevCurrentStage) => prevCurrentStage + 1);
        } else return;
    }, [currentGuess, currentStage, randomWordAndArray, gameNotification, gameSettings.currentGameSettings]);

    const handleKeydown = useCallback(
        (event: KeyboardEvent | React.MouseEvent<HTMLParagraphElement, MouseEvent>, key: string = "") => {
            const keyValue: string = key !== "" ? key : (event as KeyboardEvent).key;
            if (
                currentGuess.length < gameSettings.currentGameSettings.wordLength &&
                keyValue.length === 1 &&
                /[a-zA-Z]/.test(keyValue)
            ) {
                setLineClassNames((prevLineClassNames) => {
                    let newLineClassNames = [...prevLineClassNames];
                    newLineClassNames[currentStage] = newLineClassNames[currentStage].map((className, index) => {
                        if (index === currentGuess.length) return "tile tick";
                        else return "tile";
                    });
                    return newLineClassNames;
                });
                setCurrentGuess((prevCurrentGuess) => prevCurrentGuess + keyValue);
            } else if (keyValue === "Enter") {
                if (currentGuess.length === gameSettings.currentGameSettings.wordLength) {
                    if (currentGuess === randomWordAndArray.randomWord) handleStageChange();
                    // Hard mode logic
                    else if (gameSettings.currentGameSettings.hardMode && currentStage !== 0) {
                        let arrayOfHintedLetters: string[] = []; // Array that will hold all the hinted letters of previous stages
                        // For each previous stage
                        for (let i = 0; i < currentStage; i++) {
                            // For each tile class of stage
                            lineClassNames[i].forEach((classText, index) => {
                                if (classText.includes("green") || classText.includes("yellow")) {
                                    const hintedLetter = stageWordArray[i][index];
                                    if (!arrayOfHintedLetters.includes(hintedLetter))
                                        arrayOfHintedLetters.push(hintedLetter);
                                }
                            });
                        }

                        let isHintedLettersInCurrentGuess: boolean = true; // Flag that holds the truth value of whether the currentGuess passes hard mode or not
                        // Iterate through <arrayOfHintedLetters> to check if all of them are included in <currentGuess>
                        arrayOfHintedLetters.forEach((letter) => {
                            if (!currentGuess.includes(letter)) isHintedLettersInCurrentGuess = false;
                        });

                        if (!isHintedLettersInCurrentGuess) {
                            let classArray: string[] = "tile shake,"
                                .repeat(gameSettings.currentGameSettings.wordLength)
                                .split(",");
                            classArray.pop();
                            setLineClassNames((prevLineClassNames) => {
                                let newLineClassNames = [...prevLineClassNames];
                                newLineClassNames[currentStage] = classArray;
                                return newLineClassNames;
                            });

                            if (gameNotification.isGameNotification) resetGameNotificationAnimation();
                            setGameNotification({
                                gameNotificationText: "Word must include all hinted letters",
                                isGameNotification: true,
                            });

                            setGameDescription((prevGameDescription) => {
                                let newAttemptedGuesses = [...prevGameDescription.attemptedGuesses];
                                newAttemptedGuesses.push(currentGuess);
                                return {
                                    ...prevGameDescription,
                                    attemptedGuesses: newAttemptedGuesses,
                                };
                            });
                        } else {
                            if (isApiAvailable.isDictionaryApiAvailable) {
                                fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + currentGuess)
                                    .then((response) => {
                                        if (response.ok) handleStageChange();
                                        else {
                                            let classArray: string[] = "tile shake,"
                                                .repeat(gameSettings.currentGameSettings.wordLength)
                                                .split(",");
                                            classArray.pop();
                                            setLineClassNames((prevLineClassNames) => {
                                                let newLineClassNames = [...prevLineClassNames];
                                                newLineClassNames[currentStage] = classArray;
                                                return newLineClassNames;
                                            });

                                            if (gameNotification.isGameNotification) resetGameNotificationAnimation();
                                            setGameNotification({
                                                gameNotificationText: "Word doesn't exist",
                                                isGameNotification: true,
                                            });

                                            setGameDescription((prevGameDescription) => {
                                                let newAttemptedGuesses = [...prevGameDescription.attemptedGuesses];
                                                newAttemptedGuesses.push(currentGuess);
                                                return {
                                                    ...prevGameDescription,
                                                    attemptedGuesses: newAttemptedGuesses,
                                                };
                                            });
                                        }
                                    })
                                    .catch((error) => {
                                        console.log("Error: Dictionary API Unavailable");
                                        setIsApiAvailable((prevIsApiAvailable) => ({
                                            ...prevIsApiAvailable,
                                            isDictionaryApiAvailable: false,
                                        }));
                                        setgameSettings((prevGameSettings) => ({
                                            ...prevGameSettings,
                                            currentGameSettings: {
                                                ...prevGameSettings.currentGameSettings,
                                                lazyMode: true,
                                            },
                                        }));
                                        setGameNotification({
                                            gameNotificationText: "Dictionary API unavailable. Lazy mode turned on",
                                            isGameNotification: true,
                                        });
                                        handleStageChange();
                                    });
                            } else {
                                // if dictionary Api is not available, don't check if word exists and allow any word
                                handleStageChange();
                            }
                        }
                    } else if (isApiAvailable.isDictionaryApiAvailable && !gameSettings.currentGameSettings.lazyMode) {
                        fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + currentGuess)
                            .then((response) => {
                                if (response.ok) handleStageChange();
                                else {
                                    let classArray: string[] = "tile shake,"
                                        .repeat(gameSettings.currentGameSettings.wordLength)
                                        .split(",");
                                    classArray.pop();
                                    setLineClassNames((prevLineClassNames) => {
                                        let newLineClassNames = [...prevLineClassNames];
                                        newLineClassNames[currentStage] = classArray;
                                        return newLineClassNames;
                                    });

                                    if (gameNotification.isGameNotification) resetGameNotificationAnimation();
                                    setGameNotification({
                                        gameNotificationText: "Word doesn't exist",
                                        isGameNotification: true,
                                    });

                                    setGameDescription((prevGameDescription) => {
                                        let newAttemptedGuesses = [...prevGameDescription.attemptedGuesses];
                                        newAttemptedGuesses.push(currentGuess);
                                        return {
                                            ...prevGameDescription,
                                            attemptedGuesses: newAttemptedGuesses,
                                        };
                                    });
                                }
                            })
                            .catch((error) => {
                                console.log("Error: Dictionary API Unavailable");
                                setIsApiAvailable((prevIsApiAvailable) => ({
                                    ...prevIsApiAvailable,
                                    isDictionaryApiAvailable: false,
                                }));
                                setgameSettings((prevGameSettings) => ({
                                    ...prevGameSettings,
                                    currentGameSettings: {
                                        ...prevGameSettings.currentGameSettings,
                                        lazyMode: true,
                                    },
                                }));
                                setGameNotification({
                                    gameNotificationText: "Dictionary API unavailable. Lazy mode turned on",
                                    isGameNotification: true,
                                });
                                handleStageChange();
                            });
                    } else {
                        // if dictionary Api is not available or lazy mode is on, don't check if word exists and allow any word
                        handleStageChange();
                    }
                }
            } else if (keyValue === "Backspace") {
                setCurrentGuess((prevCurrentGuess) => {
                    if (prevCurrentGuess.length > 0) return prevCurrentGuess.slice(0, -1);
                    else return prevCurrentGuess;
                });
            }
        },
        [
            currentStage,
            currentGuess,
            handleStageChange,
            gameSettings.currentGameSettings,
            randomWordAndArray,
            lineClassNames,
            stageWordArray,
            gameNotification.isGameNotification,
            isApiAvailable.isDictionaryApiAvailable,
        ]
    );

    useEffect(() => {
        // If random word hasn't been correctly guessed yet and if last stage hasn't been reached, let user keep typing guessess
        if (!stageWordArray.includes(randomWordAndArray.randomWord)) {
            if (currentStage < gameSettings.currentGameSettings.numberStages) {
                if (
                    !isPopUpOpen.isSettingsPopUpOpen &&
                    !isPopUpOpen.isStatsPopUpOpen &&
                    !isPopUpOpen.isHelpPopUpOpen &&
                    !isPopUpOpen.isExtraMenuOpen
                ) {
                    window.addEventListener("keydown", handleKeydown);
                    //console.log("I created new event listener");
                }
            } else if (currentStage === gameSettings.currentGameSettings.numberStages) {
                // Update player statistics with 1 more loss
                setPlayerStatistics((prevPlayerStatistics) => ({
                    ...prevPlayerStatistics,
                    gamesFinished: prevPlayerStatistics.gamesFinished + 1,
                    gamesLost: prevPlayerStatistics.gamesLost + 1,
                    currentStreak: 0,
                }));

                setGameDescription((prevGameDescription) => ({
                    ...prevGameDescription,
                    isGameFinished: true,
                    isGameWin: false,
                    numberGuessesNeededToWin: 0,
                }));

                // After a short delay, show the statistics pop up
                setTimeout(() => {
                    setIsPopUpOpen((prevIsPopUpOpen) => ({ ...prevIsPopUpOpen, isStatsPopUpOpen: true }));
                }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 500 + 1000);

                if (gameNotification.isGameNotification)
                    setTimeout(() => {
                        resetGameNotificationAnimation();
                    }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 500);
                setTimeout(() => {
                    setGameNotification({
                        gameNotificationText: `Word was: "${randomWordAndArray.randomWord}". Better luck next time`,
                        isGameNotification: true,
                    });
                }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 500);

                setCurrentGuess("");
                setCurrentStage((prevCurrentStage) => prevCurrentStage + 1);
            } else return;
        }

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            //console.log("I removed event listener");
        };
    }, [
        currentGuess,
        handleKeydown,
        currentStage,
        gameSettings.currentGameSettings,
        randomWordAndArray,
        isPopUpOpen,
        stageWordArray,
        gameNotification,
    ]);

    function handleKeyClick(event: React.MouseEvent<HTMLParagraphElement, MouseEvent>, key: string) {
        if (!stageWordArray.includes(randomWordAndArray.randomWord)) {
            if (currentStage < gameSettings.currentGameSettings.numberStages) handleKeydown(event, key);
            else if (currentStage === gameSettings.currentGameSettings.numberStages) {
                // Update player statistics with 1 more loss
                setPlayerStatistics((prevPlayerStatistics) => ({
                    ...prevPlayerStatistics,
                    gamesFinished: prevPlayerStatistics.gamesFinished + 1,
                    gamesLost: prevPlayerStatistics.gamesLost + 1,
                    currentStreak: 0,
                }));

                setGameDescription((prevGameDescription) => ({
                    ...prevGameDescription,
                    isGameFinished: true,
                    isGameWin: false,
                    numberGuessesNeededToWin: 0,
                }));

                // After a short delay, show the statistics pop up
                setTimeout(() => {
                    setIsPopUpOpen((prevIsPopUpOpen) => ({ ...prevIsPopUpOpen, isStatsPopUpOpen: true }));
                }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 500 + 1000);

                if (gameNotification.isGameNotification)
                    setTimeout(() => {
                        resetGameNotificationAnimation();
                    }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 500);
                setTimeout(() => {
                    setGameNotification({
                        gameNotificationText: `Word was: "${randomWordAndArray.randomWord}". Better luck next time`,
                        isGameNotification: true,
                    });
                }, (gameSettings.currentGameSettings.wordLength - 1) * 200 + 500);

                setCurrentGuess("");
                setCurrentStage((prevCurrentStage) => prevCurrentStage + 1);
            } else return;
        }
    }

    function resetGame() {
        // If word length setting has been changed, get new array of random words from API
        if (gameSettings.futureGameSettings.wordLength !== gameSettings.currentGameSettings.wordLength) {
            setIsLoading(true);
            const fetchNewData = async () => {
                // Get 4 random letters that can't be part of the retrieved words, because API doesn't return random words.
                let randomLettersArray: string[] = [];
                for (let i = 0; i < 4; i++) {
                    randomLettersArray.push(
                        ALPHABET_LETTERS.split("")[Math.floor(Math.random() * ALPHABET_LETTERS.length)]
                    );
                }
                const randomLettersString = randomLettersArray.toString().replaceAll(",", "");

                // Get 25 words from API that may include "a"
                const randomWordsData1 = await fetch(
                    `https://api.datamuse.com/words?sp=${"?".repeat(
                        gameSettings.futureGameSettings.wordLength
                    )}-1234567890${randomLettersString}&max=25`
                );
                const randomWordsArray1 = await randomWordsData1.json();

                // Get 75 words from API that don't include "a" (due to most words gotten from API call including and starting with "a")
                const randomWordsData2 = await fetch(
                    `https://api.datamuse.com/words?sp=${"?".repeat(
                        gameSettings.futureGameSettings.wordLength
                    )}-1234567890aA${randomLettersString}&max=75`
                );
                const randomWordsArray2 = await randomWordsData2.json();

                // Join both arrays and keep only the words
                const jointRandomWordsArray = [...randomWordsArray1, ...randomWordsArray2];
                const newJointRandomWordsArray: string[] = jointRandomWordsArray.map((element) => {
                    const elementWord: string = element.word;
                    if (elementWord.includes(" ")) {
                        // Remove words that have spaces
                        return undefined;
                    }
                    return element.word;
                });
                // Remove the array positions where words with spaces were
                const newJointRandomWordsArrayNoWhiteSpaces = newJointRandomWordsArray.filter(
                    (element) => element != null
                );

                const randomWord =
                    newJointRandomWordsArrayNoWhiteSpaces[
                        Math.floor(Math.random() * newJointRandomWordsArrayNoWhiteSpaces.length)
                    ].toLowerCase();
                setRandomWordAndArray({
                    randomWord: randomWord,
                    randomWordArray: newJointRandomWordsArrayNoWhiteSpaces,
                });
            };

            // First check if words api is still available. If yes, proceed to getting new random words.
            // If no, get dummy data and update isApiAvailable state
            fetch("https://api.datamuse.com/words?sp=?????", { cache: "no-store" })
                .then((response) => {
                    if (response.ok) {
                        // setIsApiAvailable((prevIsApiAvailable) => ({
                        //     ...prevIsApiAvailable,
                        //     isWordApiAvailable: true,
                        // }));
                        fetchNewData();
                        const newLineClassNames: string[][] = Array(gameSettings.futureGameSettings.numberStages).fill(
                            Array(gameSettings.futureGameSettings.wordLength).fill("tile")
                        );
                        setLineClassNames(newLineClassNames);
                        setgameSettings((prevgameSettings) => ({
                            ...prevgameSettings,
                            currentGameSettings: {
                                ...prevgameSettings.futureGameSettings,
                                hardMode: prevgameSettings.currentGameSettings.hardMode,
                                lazyMode: prevgameSettings.currentGameSettings.lazyMode,
                            },
                        }));
                        const newStageWordArray: string[] = Array(gameSettings.futureGameSettings.numberStages).fill(
                            ""
                        );
                        setStageWordArray(newStageWordArray);
                    } else {
                        setIsApiAvailable((prevIsApiAvailable) => ({
                            ...prevIsApiAvailable,
                            isWordApiAvailable: false,
                        }));
                        const randomWord = WordData[Math.floor(Math.random() * WordData.length)].toLowerCase();
                        setRandomWordAndArray({ randomWord: randomWord, randomWordArray: WordData });
                        setGameNotification({
                            gameNotificationText: `Word API unavailable. Playing with ${DUMMY_DATA_WORD_LENGTH} letter random word`,
                            isGameNotification: true,
                        });

                        const newLineClassNames: string[][] = Array(gameSettings.futureGameSettings.numberStages).fill(
                            Array(DUMMY_DATA_WORD_LENGTH).fill("tile")
                        );
                        setLineClassNames(newLineClassNames);
                        setgameSettings((prevgameSettings) => ({
                            futureGameSettings: {
                                ...prevgameSettings.futureGameSettings,
                                wordLength: DUMMY_DATA_WORD_LENGTH,
                            },
                            currentGameSettings: {
                                ...prevgameSettings.futureGameSettings,
                                wordLength: DUMMY_DATA_WORD_LENGTH,
                                hardMode: prevgameSettings.currentGameSettings.hardMode,
                                lazyMode: prevgameSettings.currentGameSettings.lazyMode,
                            },
                        }));
                        const newStageWordArray: string[] = Array(gameSettings.futureGameSettings.numberStages).fill(
                            ""
                        );
                        setStageWordArray(newStageWordArray);
                    }
                })
                .catch((error) => {
                    console.log("Error: Word API Unavailable");
                    setIsApiAvailable((prevIsApiAvailable) => ({
                        ...prevIsApiAvailable,
                        isWordApiAvailable: false,
                    }));
                    const randomWord = WordData[Math.floor(Math.random() * WordData.length)].toLowerCase();
                    setRandomWordAndArray({ randomWord: randomWord, randomWordArray: WordData });
                    setGameNotification({
                        gameNotificationText: "Word API unavailable. Playing with 5 letter random word",
                        isGameNotification: true,
                    });

                    const newLineClassNames: string[][] = Array(gameSettings.futureGameSettings.numberStages).fill(
                        Array(DUMMY_DATA_WORD_LENGTH).fill("tile")
                    );
                    setLineClassNames(newLineClassNames);
                    setgameSettings((prevgameSettings) => ({
                        futureGameSettings: {
                            ...prevgameSettings.futureGameSettings,
                            wordLength: DUMMY_DATA_WORD_LENGTH,
                        },
                        currentGameSettings: {
                            ...prevgameSettings.futureGameSettings,
                            wordLength: DUMMY_DATA_WORD_LENGTH,
                            hardMode: prevgameSettings.currentGameSettings.hardMode,
                            lazyMode: prevgameSettings.currentGameSettings.lazyMode,
                        },
                    }));
                    const newStageWordArray: string[] = Array(gameSettings.futureGameSettings.numberStages).fill("");
                    setStageWordArray(newStageWordArray);
                });

            setIsLoading(false);
        } else {
            // check if words api is available first (in order to set state correctly and prevent user from changing settings from here forward if api is unavailable)
            // then simply get another random word from the randomArray variable.
            fetch("https://api.datamuse.com/words?sp=?????", { cache: "no-store" })
                .then((response) => {
                    if (response.ok)
                        setIsApiAvailable((prevIsApiAvailable) => ({
                            ...prevIsApiAvailable,
                            isWordApiAvailable: true,
                        }));
                    else
                        setIsApiAvailable((prevIsApiAvailable) => ({
                            ...prevIsApiAvailable,
                            isWordApiAvailable: false,
                        }));
                })
                .catch((error) => {
                    console.log("Error: Word API Unavailable");
                    setIsApiAvailable((prevIsApiAvailable) => ({
                        ...prevIsApiAvailable,
                        isWordApiAvailable: false,
                    }));
                });

            const newRandomWord =
                randomWordAndArray.randomWordArray[
                    Math.floor(Math.random() * randomWordAndArray.randomWordArray.length)
                ].toLowerCase();
            setRandomWordAndArray((prevRandomWordArray) => ({ ...prevRandomWordArray, randomWord: newRandomWord }));

            const newLineClassNames: string[][] = Array(gameSettings.futureGameSettings.numberStages).fill(
                Array(gameSettings.futureGameSettings.wordLength).fill("tile")
            );
            setLineClassNames(newLineClassNames);
            setgameSettings((prevgameSettings) => ({
                ...prevgameSettings,
                currentGameSettings: {
                    ...prevgameSettings.futureGameSettings,
                    hardMode: prevgameSettings.currentGameSettings.hardMode,
                    lazyMode: prevgameSettings.currentGameSettings.lazyMode,
                },
            }));
            const newStageWordArray: string[] = Array(gameSettings.futureGameSettings.numberStages).fill("");
            setStageWordArray(newStageWordArray);
        }

        // check if dictionary api is available (to set state correctly and prevent user from changing settings if api is unavailable)
        fetch("https://api.dictionaryapi.dev/api/v2/entries/en/hello", { cache: "no-store" })
            .then((response) => {
                if (response.ok)
                    setIsApiAvailable((prevIsApiAvailable) => ({
                        ...prevIsApiAvailable,
                        isDictionaryApiAvailable: true,
                    }));
                else {
                    setIsApiAvailable((prevIsApiAvailable) => ({
                        ...prevIsApiAvailable,
                        isDictionaryApiAvailable: false,
                    }));
                    setgameSettings((prevgameSettings) => ({
                        ...prevgameSettings,
                        currentGameSettings: {
                            //...prevgameSettings.futureGameSettings,
                            ...prevgameSettings.currentGameSettings,
                            lazyMode: true,
                        },
                    }));
                }
            })
            .catch((error) => {
                console.log("Error: Dictionary API Unavailable");
                setIsApiAvailable((prevIsApiAvailable) => ({
                    ...prevIsApiAvailable,
                    isDictionaryApiAvailable: false,
                }));
                setgameSettings((prevgameSettings) => ({
                    ...prevgameSettings,
                    currentGameSettings: {
                        //...prevgameSettings.futureGameSettings,
                        ...prevgameSettings.currentGameSettings,
                        lazyMode: true,
                    },
                }));
            });

        setCurrentGuess("");
        setCurrentStage(0);
        // setgameSettings((prevgameSettings) => ({
        //     ...prevgameSettings,
        //     currentGameSettings: {
        //         ...prevgameSettings.futureGameSettings,
        //         hardMode: prevgameSettings.currentGameSettings.hardMode,
        //         lazyMode: prevgameSettings.currentGameSettings.lazyMode,
        //     },
        // }));
        setGameDescription({
            attemptedGuesses: [],
            isGameFinished: false,
            isGameWin: false,
            numberGuessesNeededToWin: 0,
        });
        setIsPopUpOpen((prevIsPopUpOpen) => ({ ...prevIsPopUpOpen, isSettingsPopUpOpen: false }));
    }

    function handleChangeGameSettings(gameSetting: string, option: string) {
        switch (gameSetting) {
            case "word-length":
                if (option === "increment" && gameSettings.futureGameSettings.wordLength < MAX_WORD_LENGTH)
                    setgameSettings((prevgameSettings) => ({
                        ...prevgameSettings,
                        futureGameSettings: {
                            ...prevgameSettings.futureGameSettings,
                            wordLength: prevgameSettings.futureGameSettings.wordLength + 1,
                        },
                    }));
                else if (option === "decrement" && gameSettings.futureGameSettings.wordLength > MIN_WORD_LENGTH)
                    setgameSettings((prevgameSettings) => ({
                        ...prevgameSettings,
                        futureGameSettings: {
                            ...prevgameSettings.futureGameSettings,
                            wordLength: prevgameSettings.futureGameSettings.wordLength - 1,
                        },
                    }));
                return;

            case "stage-number":
                if (option === "increment" && gameSettings.futureGameSettings.numberStages < MAX_NUMBER_STAGES)
                    setgameSettings((prevgameSettings) => ({
                        ...prevgameSettings,
                        futureGameSettings: {
                            ...prevgameSettings.futureGameSettings,
                            numberStages: prevgameSettings.futureGameSettings.numberStages + 1,
                        },
                    }));
                else if (option === "decrement" && gameSettings.futureGameSettings.numberStages > MIN_NUMBER_STAGES)
                    setgameSettings((prevgameSettings) => ({
                        ...prevgameSettings,
                        futureGameSettings: {
                            ...prevgameSettings.futureGameSettings,
                            numberStages: prevgameSettings.futureGameSettings.numberStages - 1,
                        },
                    }));
                return;

            case "hard-mode":
                setgameSettings((prevgameSettings) => ({
                    ...prevgameSettings,
                    currentGameSettings: {
                        ...prevgameSettings.currentGameSettings,
                        hardMode: !prevgameSettings.currentGameSettings.hardMode,
                    },
                }));
                return;

            case "lazy-mode":
                setgameSettings((prevgameSettings) => ({
                    ...prevgameSettings,
                    currentGameSettings: {
                        ...prevgameSettings.currentGameSettings,
                        lazyMode: !prevgameSettings.currentGameSettings.lazyMode,
                    },
                }));
                return;

            default:
                return;
        }
    }

    function handleChangeDarkMode() {
        setIsDarkMode((prevIsDarkMode) => !prevIsDarkMode);
    }

    function handleChangeHighContrastMode() {
        setIsHighContrastMode((prevIsHighContrastMode) => !prevIsHighContrastMode);
    }

    const notificationsDivRef = useRef<HTMLDivElement>(null);

    function resetGameNotificationAnimation() {
        if (notificationsDivRef.current)
            notificationsDivRef.current.className = "notification_container notification_container_invisible";
        setTimeout(() => {
            if (notificationsDivRef.current) notificationsDivRef.current.className = "notification_container";
        }, 100);
    }

    function toggleIsPopUpOpen(event: React.MouseEvent, popUpName: string) {
        event.stopPropagation();
        switch (popUpName) {
            case "settings":
                setIsPopUpOpen((prevIsPopUpOpen) => ({
                    ...prevIsPopUpOpen,
                    isSettingsPopUpOpen: !prevIsPopUpOpen.isSettingsPopUpOpen,
                }));
                break;

            case "stats":
                setIsPopUpOpen((prevIsPopUpOpen) => ({
                    ...prevIsPopUpOpen,
                    isStatsPopUpOpen: !prevIsPopUpOpen.isStatsPopUpOpen,
                }));
                break;

            case "help":
                setIsPopUpOpen((prevIsPopUpOpen) => ({
                    ...prevIsPopUpOpen,
                    isHelpPopUpOpen: !prevIsPopUpOpen.isHelpPopUpOpen,
                }));
                break;

            case "extramenu":
                setIsPopUpOpen((prevIsPopUpOpen) => ({
                    ...prevIsPopUpOpen,
                    isExtraMenuOpen: !prevIsPopUpOpen.isExtraMenuOpen,
                }));
                break;

            default:
                break;
        }
    }

    // TODO:
    // - make app responsive (Fix tile size when word legnth bigger than number of stages. Maybe add to tsx file a conditional to descrease a bit the max height and max width when the device's screen is x pixels)

    const keyboardLetterRowsArray: string[] = [
        ALPHABET_LETTERS.split("a")[0],
        ALPHABET_LETTERS.split("p")[1].split("z")[0],
        ALPHABET_LETTERS.split("l")[1],
    ];

    // console.log("------dictionary API", isApiAvailable.isDictionaryApiAvailable ? "available" : "not available");
    // console.log("------words API", isApiAvailable.isWordApiAvailable ? "available" : "not available");
    // console.log("------random Word", randomWordAndArray.randomWord);
    // console.log("--------------------------------------");

    
    return (
        <div
            ref={appDivRef}
            className={`app_container ${isDarkMode ? "dark_mode" : ""} ${
                isHighContrastMode ? "high_contrast_mode" : ""
            }`}
        >
            <Navbar toggleIsPopUpOpen={toggleIsPopUpOpen} />

            {isLoading ? (
                <main className="main_container_loading">
                    <i className="fas fa-spinner fa-spin"></i>
                </main>
            ) : (
                <main className="main_container">
                    <div className="game_container">
                        <div
                            className="gameboard_container"
                            // Change style specifically if device screen is mobile sized and in landscape mode
                            style={{
                                flexDirection:
                                    isDeviceSmartphoneLandscape && gameSettings.currentGameSettings.numberStages > 6
                                        ? "row"
                                        : "column",
                            }}
                        >
                            {stageWordArray.map((line, index) => {
                                const isCurrentStage = index === currentStage;
                                return (
                                    <Line
                                        key={index}
                                        line={isCurrentStage ? currentGuess : line ?? ""}
                                        lineClassNames={lineClassNames}
                                        index={index}
                                        wordLength={gameSettings.currentGameSettings.wordLength}
                                        numberStages={gameSettings.currentGameSettings.numberStages}
                                        setLineClassNames={setLineClassNames}
                                    />
                                );
                            })}
                        </div>
                        <div className="keyboard_container">
                            {keyboardLetterRowsArray.map((keyboardRowString, index) => (
                                <KeyboardRow
                                    key={index}
                                    keyboardRowString={keyboardRowString}
                                    stageWordArray={stageWordArray}
                                    lineClassNames={lineClassNames}
                                    wordLength={gameSettings.currentGameSettings.wordLength}
                                    handleKeyClick={handleKeyClick}
                                    currentGuess={currentGuess}
                                    gameDescription={gameDescription}
                                />
                            ))}
                        </div>
                    </div>

                    <div
                        ref={notificationsDivRef}
                        className={`notification_container ${
                            !gameNotification.isGameNotification ? "notification_container_invisible" : ""
                        }`}
                        onAnimationEnd={() =>
                            setGameNotification((prevGameNotification) => ({
                                ...prevGameNotification,
                                isGameNotification: false,
                            }))
                        }
                    >
                        {gameNotification.gameNotificationText}
                    </div>

                    <SettingsPopUp
                        isSettingsPopUpOpen={isPopUpOpen.isSettingsPopUpOpen}
                        toggleIsPopUpOpen={toggleIsPopUpOpen}
                        handleChangeGameSettings={handleChangeGameSettings}
                        gameSettings={gameSettings}
                        isApiAvailable={isApiAvailable}
                        isDarkMode={isDarkMode}
                        isHighContrastMode={isHighContrastMode}
                        handleChangeDarkMode={handleChangeDarkMode}
                        handleChangeHighContrastMode={handleChangeHighContrastMode}
                        resetButtonRef={resetButtonRef}
                        resetGame={resetGame}
                    />
                    <StatsPopUp
                        isStatsPopUpOpen={isPopUpOpen.isStatsPopUpOpen}
                        toggleIsPopUpOpen={toggleIsPopUpOpen}
                        playerStatistics={playerStatistics}
                        gameDescription={gameDescription}
                    />
                    <HelpPopUp isHelpPopUpOpen={isPopUpOpen.isHelpPopUpOpen} toggleIsPopUpOpen={toggleIsPopUpOpen} />
                    <ExtraMenu isExtraMenuOpen={isPopUpOpen.isExtraMenuOpen} toggleIsPopUpOpen={toggleIsPopUpOpen} />

                    <button
                        className={`reset_game_button ${
                            !gameDescription.isGameFinished ? "reset_game_button_hide" : ""
                        }`}
                        onClick={resetGame}
                    >
                        Restart Game
                    </button>
                </main>
            )}
        </div>
    );
}
