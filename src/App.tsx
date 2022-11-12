import React, { useCallback, useEffect, useRef, useState } from "react";

import "./App.scss";
import { WordData } from "./data/WordData";
import {
    /*gameSettingsType,*/ gameNotificationType,
    gameSettings2Type,
    isApiAvailableType,
    isPopUpOpenType,
    playerStatisticsType,
    randomWordAndArrayType,
} from "./models/model";
import Line from "./components/Line/Line";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import KeyboardRow from "./components/KeyboardRow/KeyboardRow";
import SettingsPopUp from "./components/SettingsPopUp/SettingsPopUp";
import HelpPopUp from "./components/HelpPopUp/HelpPopUp";
import StatsPopUp from "./components/StatsPopUp/StatsPopUp";

const ALPHABET_LETTERS = "qwertyuiopasdfghjklzxcvbnm";

export default function App() {
    // Variable <gameSettings> is an object holding the dynamic settings of the game: number of stages and word lenght
    // const [gameSettings, setGameSettings] = useState<gameSettingsType>({
    //     numberStages: 6,
    //     wordLength: 5,
    //     hardMode: false,
    // });

    const [gameSettings2, setGameSettings2] = useState<gameSettings2Type>({
        currentGameSettings: {
            numberStages: 6,
            wordLength: 5,
            hardMode: false,
            lazyMode: false
        },
        futureGameSettings: {
            numberStages: 6,
            wordLength: 5,
        },
    });

    const [randomWordAndArray, setRandomWordAndArray] = useState<randomWordAndArrayType>({
        randomWord: "",
        randomWordArray: [],
    });
    const [stageWordArray, setStageWordArray] = useState<string[]>(
        Array(gameSettings2.currentGameSettings.numberStages).fill("")
    );
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const [currentStage, setCurrentStage] = useState<number>(0);
    const [lineClassNames, setLineClassNames] = useState<string[][]>(
        Array(gameSettings2.currentGameSettings.numberStages).fill(
            Array(gameSettings2.currentGameSettings.wordLength).fill("tile")
        )
    );
    // Object variable holding a boolean for each api used, true is the api is available and false if it's not available
    const [isApiAvailable, setIsApiAvailable] = useState<isApiAvailableType>({
        isDictionaryApiAvailable: false,
        isWordApiAvailable: false,
    });

    // Object variable to handle whether a game notification is being shown, and what text to show
    const [gameNotification, setGameNotification] = useState<gameNotificationType>({
        isGameNotification: false,
        gameNotificationText: "",
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    // Object variable to handle whether each pop up is open or not
    const [isPopUpOpen, setIsPopUpOpen] = useState<isPopUpOpenType>({isSettingsPopUpOpen: false, isStatsPopUpOpen: false, isHelpPopUpOpen: false})

    // Object variable to hold the statistics of the player's games
    const [playerStatistics, setPlayerStatistics] = useState<playerStatisticsType>({
        gamesFinished: 0,
        gamesWon: 0,
        gamesLost: 0,
        currentStreak: 0,
        maxStreak: 0,
        NumberWinsWithXGuesses: Array(13).fill(0)
    });

    // Ref variable to access reset button
    const resetButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            // Check if words Api is available
            const checkWordsApi = await fetch("https://api.datamuse.com/words?sp=?????");
            if (checkWordsApi.ok)
                setIsApiAvailable((prevIsApiAvailable) => ({ ...prevIsApiAvailable, isWordApiAvailable: true }));

            if (!checkWordsApi.ok) {
                const randomWord = WordData[Math.floor(Math.random() * WordData.length)].toLowerCase();
                setRandomWordAndArray({ randomWord: randomWord, randomWordArray: WordData });
            } else {
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
                        gameSettings2.currentGameSettings.wordLength
                    )}-1234567890${randomLettersString}&max=25`
                );
                console.log("HEY1", randomWordsData1);
                const randomWordsArray1 = await randomWordsData1.json();

                // Get 75 words from API that don't include "a" (due to most words gotten from API call including and starting with "a")
                const randomWordsData2 = await fetch(
                    `https://api.datamuse.com/words?sp=${"?".repeat(
                        gameSettings2.currentGameSettings.wordLength
                    )}-1234567890aA${randomLettersString}&max=75`
                );
                console.log("HEYY2", randomWordsData2);
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
            const dictionaryTestData = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/hello");
            if (dictionaryTestData.ok)
                setIsApiAvailable((prevIsApiAvailable) => ({ ...prevIsApiAvailable, isDictionaryApiAvailable: true }));
            console.log(dictionaryTestData);
        };

        fetchData();
        checkDictionaryApi();
        setIsLoading(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // TODO: remove these useEffects
    useEffect(() => {
        console.log("Changed CurrentGuess");
    }, [currentGuess]);

    useEffect(() => {
        console.log("Changed currentStage");
    }, [currentStage]);

    useEffect(() => {
        console.log("Changed randomWordAndArray");
    }, [randomWordAndArray]);

    useEffect(() => {
        console.log("Changed gameSettings2");
    }, [gameSettings2]);

    useEffect(() => {
        console.log("Changed stageWordArray");
    }, [stageWordArray]);

    useEffect(() => {
        console.log("Changed isApiAvailable");
    }, [isApiAvailable]);

    useEffect(() => {
        console.log("Changed isLoading");
    }, [isLoading]);

    useEffect(() => {
        console.log("Changed lineClassNames");
    }, [lineClassNames]);

    const handleStageChange = useCallback(
        () => {
            if (currentStage < gameSettings2.currentGameSettings.numberStages) {
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

                setStageWordArray((prevStageWordArray) => {
                    let newStageWordArray = [...prevStageWordArray];
                    newStageWordArray[currentStage] = currentGuess;
                    return newStageWordArray;
                });

                // Handle game win
                if (currentGuess === randomWordAndArray.randomWord) {
                    // Set notification for game end
                    if (gameNotification.isGameNotification) resetGameNotificationAnimation();
                    if (currentStage === 0) {
                        setGameNotification({ gameNotificationText: "L-U-C-K-Y", isGameNotification: true });
                    } else if (currentStage === 1) {
                        setGameNotification({ gameNotificationText: "Outstanding", isGameNotification: true });
                    } else if (currentStage === 2) {
                        setGameNotification({ gameNotificationText: "Impressive", isGameNotification: true });
                    } else if (currentStage === 3) {
                        setGameNotification({ gameNotificationText: "Amazing", isGameNotification: true });
                    } else if (currentStage === 4) {
                        // If game was close, set appropriate notification text, otherwise set congratulating notification text
                        if (gameSettings2.currentGameSettings.numberStages - currentStage < 2)
                            setGameNotification({ gameNotificationText: "That was close!", isGameNotification: true });
                        else setGameNotification({ gameNotificationText: "Well done!", isGameNotification: true });
                    } else if (currentStage === 5) {
                        if (gameSettings2.currentGameSettings.numberStages - currentStage < 2)
                            setGameNotification({ gameNotificationText: "Phew!", isGameNotification: true });
                        else setGameNotification({ gameNotificationText: "Well done!", isGameNotification: true });
                    } else if (currentStage > 5 && currentStage < 10) {
                        if (gameSettings2.currentGameSettings.numberStages - currentStage < 2)
                            setGameNotification({ gameNotificationText: "That was close!", isGameNotification: true });
                        else setGameNotification({ gameNotificationText: "Well done!", isGameNotification: true });
                    } else {
                        if (gameSettings2.currentGameSettings.numberStages - currentStage < 2)
                            setGameNotification({ gameNotificationText: "That was close!", isGameNotification: true });
                        else setGameNotification({ gameNotificationText: "Well done!", isGameNotification: true });
                    }

                    //Update player statistics with 1 more win
                    setPlayerStatistics(prevPlayerStatistics => {
                        let newNumberWinsWithXGuesses = [...prevPlayerStatistics.NumberWinsWithXGuesses];
                        newNumberWinsWithXGuesses[currentStage] += 1;
                         return {
                             ...prevPlayerStatistics,
                             gamesFinished: prevPlayerStatistics.gamesFinished+1,
                             gamesWon: prevPlayerStatistics.gamesWon+1,
                             currentStreak: prevPlayerStatistics.currentStreak+1,
                             maxStreak: prevPlayerStatistics.currentStreak+1 > prevPlayerStatistics.maxStreak ? prevPlayerStatistics.currentStreak+1 : prevPlayerStatistics.maxStreak,
                             NumberWinsWithXGuesses: newNumberWinsWithXGuesses
                         }
                     });
                    
                    // After a short delay, show the statistics pop up
                    setTimeout(() => {
                        setIsPopUpOpen(prevIsPopUpOpen => ({ ...prevIsPopUpOpen, isStatsPopUpOpen: true}));
                    }, gameSettings2.currentGameSettings.wordLength*200+500);
                }
                setCurrentGuess("");
                setCurrentStage((prevCurrentStage) => prevCurrentStage + 1);
            } else return;
        }, // TODO: replace gameSettings with gameSettings.prevGameSettings or something
        [currentGuess, currentStage, randomWordAndArray, gameNotification, gameSettings2.currentGameSettings]
    );

    const handleKeydown = useCallback(
        (event: KeyboardEvent | React.MouseEvent<HTMLParagraphElement, MouseEvent>, key: string = "") => {
            const keyValue: string = key !== "" ? key : (event as KeyboardEvent).key;
            if (
                currentGuess.length < gameSettings2.currentGameSettings.wordLength &&
                keyValue.length === 1 &&
                /[a-zA-Z]/.test(keyValue)
            ) {
                setLineClassNames((prevLineClassNames) => {
                    let newLineClassNames = [...prevLineClassNames];
                    newLineClassNames[currentStage] = newLineClassNames[currentStage].map((className, index) => {
                        if (index === currentGuess.length) return "tile tick"
                        else return "tile";
                    });
                    return newLineClassNames;
                });
                setCurrentGuess((prevCurrentGuess) => prevCurrentGuess + keyValue);
            } else if (keyValue === "Enter") {
                if (currentGuess.length === gameSettings2.currentGameSettings.wordLength) {
                    if (currentGuess === randomWordAndArray.randomWord) handleStageChange();
                    // Hard mode logic
                    else if (gameSettings2.currentGameSettings.hardMode && currentStage !== 0) {
                        let arrayOfHintedLetters: string[] = []; // Array that will hold all the hinted letters of previous stages
                        // For each previous stage
                        for (let i = 0; i < currentStage; i++) {
                            // For each tile class of stage
                            lineClassNames[i].forEach((classText, index) => {
                                console.log(classText);
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
                                .repeat(gameSettings2.currentGameSettings.wordLength)
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
                        } else {
                            if (isApiAvailable.isDictionaryApiAvailable) {
                                fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + currentGuess)
                                    .then((response) => {
                                        if (response.ok) handleStageChange();
                                        else {
                                            let classArray: string[] = "tile shake,"
                                                .repeat(gameSettings2.currentGameSettings.wordLength)
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
                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            } else {
                                // if dictionary Api is not available, don't check if word exists and allow any word
                                handleStageChange();
                            }
                        }
                    } else if (isApiAvailable.isDictionaryApiAvailable && !gameSettings2.currentGameSettings.lazyMode) {
                        fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + currentGuess)
                            .then((response) => {
                                if (response.ok) handleStageChange();
                                else {
                                    let classArray: string[] = "tile shake,"
                                        .repeat(gameSettings2.currentGameSettings.wordLength)
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
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else {
                        // if dictionary Api is not available or lazy mode is on, don't check if word exists and allow any word
                        handleStageChange();
                    }
                }
            } else if (keyValue === "Backspace") {
                // After hitting backspace, if current row had className "shake", remove it so it can be added again to trigger animation
                // if (lineClassNames[currentStage][0] === "tile shake") {
                //     const newLineClassNamesRow: string[] = Array(gameSettings.wordLength).fill("tile");
                //     setLineClassNames((prevLineClassNames) => {
                //         let newLineClassNames = [...prevLineClassNames];
                //         newLineClassNames[currentStage] = newLineClassNamesRow;
                //         return newLineClassNames;
                //     });
                // }
                setCurrentGuess((prevCurrentGuess) => {
                    if (prevCurrentGuess.length > 0) return prevCurrentGuess.slice(0, -1);
                    else return prevCurrentGuess;
                });
            }
            // TODO: replace gameSettings with gameSettings.prevGameSettings or something
        },
        [
            currentStage,
            currentGuess,
            handleStageChange,
            // gameSettings,
            gameSettings2.currentGameSettings,
            randomWordAndArray,
            lineClassNames,
            stageWordArray,
            gameNotification.isGameNotification,
            isApiAvailable.isDictionaryApiAvailable,
        ]
    );

    useEffect(() => {
        // function handleStageChange() {
        //     console.log(gameSettings.numberStages);
        //     if (currentStage < gameSettings.numberStages) {
        //         //Make checks
        //         let colorArray: string[] = [];
        //         currentGuess
        //             .toLowerCase()
        //             .split("")
        //             .forEach((currentGuessChar, currentGuessIndex) => {
        //                 let color: string = "tile grey";
        //                 randomWordAndArray.randomWord.split("").forEach((randomWordChar, randomWordIndex) => {
        //                     if (currentGuessChar === randomWordChar) {
        //                         if (color !== "tile green") color = "tile yellow";
        //                     }
        //                     if (currentGuessChar === randomWordChar && currentGuessIndex === randomWordIndex)
        //                         color = "tile green";
        //                 });
        //                 colorArray.push(color);
        //             });
        //         setLineClassNames((prevLineClassNames) => {
        //             let newLineClassNames = [...prevLineClassNames];
        //             newLineClassNames[currentStage] = colorArray;
        //             return newLineClassNames;
        //         });

        //         setStageWordArray((prevStageWordArray) => {
        //             let newStageWordArray = [...prevStageWordArray];
        //             newStageWordArray[currentStage] = currentGuess;
        //             return newStageWordArray;
        //         });

        //         if (currentGuess === randomWordAndArray.randomWord) {
        //             alert("you win");
        //         }
        //         setCurrentGuess("");
        //         setCurrentStage((prevCurrentStage) => prevCurrentStage + 1);
        //     } else return;
        // }

        // const handleKeydown = (event: KeyboardEvent) => {
        //     if (currentGuess.length < gameSettings.wordLength && event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
        //         setLineClassNames((prevLineClassNames) => {
        //             let newLineClassNames = [...prevLineClassNames];
        //             newLineClassNames[currentStage] = newLineClassNames[currentStage].map((className, index) => {
        //                 if (index === currentGuess.length) return "tile tick";
        //                 else return "tile";
        //             });
        //             return newLineClassNames;
        //         });
        //         setCurrentGuess((prevCurrentGuess) => prevCurrentGuess + event.key);
        //     } else if (event.key === "Enter") {
        //         if (currentGuess.length === gameSettings.wordLength) {
        //             if (currentGuess === randomWordAndArray.randomWord) handleStageChange();
        //             // TODO: Add Hard mode logic here
        //             // else if (gameSettings.hardMode && currentStage!==0) {
        //             // }
        //             else if (isApiAvailable.isDictionaryApiAvailable) {
        //                 fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + currentGuess)
        //                     .then((response) => {
        //                         if (response.ok) handleStageChange();
        //                         else {
        //                             let classArray: string[] = "tile shake,".repeat(gameSettings.wordLength).split(",");
        //                             classArray.pop();
        //                             setLineClassNames((prevLineClassNames) => {
        //                                 let newLineClassNames = [...prevLineClassNames];
        //                                 newLineClassNames[currentStage] = classArray;
        //                                 return newLineClassNames;
        //                             });
        //                             if (
        //                                 notificationsDivRef.current?.className.includes(
        //                                     "notification_container_animate"
        //                                 )
        //                             )
        //                                 resetGameNotificationAnimation();

        //                             //alert("Word doesn't exist");
        //                         }
        //                     })
        //                     .catch((error) => {
        //                         console.log(error);
        //                     });
        //             } else {
        //                 // if dictionary Api is not available, don't check if word exists and allow any word
        //                 handleStageChange();
        //             }
        //         }
        //     } else if (event.key === "Backspace") {
        //         // After hitting backspace, if current row had className "shake", remove it so it can be added again to trigger animation
        //         // if (lineClassNames[currentStage][0] === "tile shake") {
        //         //     const newLineClassNamesRow: string[] = Array(gameSettings.wordLength).fill("tile");
        //         //     setLineClassNames((prevLineClassNames) => {
        //         //         let newLineClassNames = [...prevLineClassNames];
        //         //         newLineClassNames[currentStage] = newLineClassNamesRow;
        //         //         return newLineClassNames;
        //         //     });
        //         // }
        //         setCurrentGuess((prevCurrentGuess) => {
        //             if (prevCurrentGuess.length > 0) return prevCurrentGuess.slice(0, -1);
        //             else return prevCurrentGuess;
        //         });
        //     }
        // };

        //console.log("Im in the big useEffect");

        // If random word hasn't been correctly guessed yet and if last stage hasn't been reached, let user keep typing guessess
        if (!stageWordArray.includes(randomWordAndArray.randomWord)) {
            console.log(gameSettings2.currentGameSettings.numberStages);
            if (currentStage < gameSettings2.currentGameSettings.numberStages) {
                if (!isPopUpOpen.isSettingsPopUpOpen && !isPopUpOpen.isStatsPopUpOpen && !isPopUpOpen.isHelpPopUpOpen) {
                    window.addEventListener("keydown", handleKeydown);
                    console.log("I created new event listener");
                }
            } else {
                if (
                    gameNotification.gameNotificationText !==
                    `Word was: "${randomWordAndArray.randomWord}". Better luck next time`
                ) {
                    // Update player statistics with 1 more loss
                    setPlayerStatistics(prevPlayerStatistics => ({
                        ...prevPlayerStatistics, 
                        gamesFinished: prevPlayerStatistics.gamesFinished+1,
                        gamesLost: prevPlayerStatistics.gamesLost+1,
                        currentStreak: 0,
                    }));

                    if (gameNotification.isGameNotification) resetGameNotificationAnimation();
                    setGameNotification({
                        gameNotificationText: `Word was: "${randomWordAndArray.randomWord}". Better luck next time`,
                        isGameNotification: true,
                    });
                }
            }
        }

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            console.log("I removed event listener");
        };
        // TODO: replace gameSettings with gameSettings.prevGameSettings or something
    }, [
        currentGuess,
        handleKeydown,
        currentStage,
        gameSettings2.currentGameSettings,
        randomWordAndArray,
        isPopUpOpen,
        stageWordArray,
        gameNotification
    ]);


    function handleKeyClick(event: React.MouseEvent<HTMLParagraphElement, MouseEvent>, key: string) {
        if (!stageWordArray.includes(randomWordAndArray.randomWord)) {
            if (currentStage < gameSettings2.currentGameSettings.numberStages) handleKeydown(event, key);
            else {
                if (
                    gameNotification.gameNotificationText !==
                    `Word was: "${randomWordAndArray.randomWord}". Better luck next time`
                )
                    if (gameNotification.isGameNotification) resetGameNotificationAnimation();
                    setGameNotification({
                        gameNotificationText: `Word was: "${randomWordAndArray.randomWord}". Better luck next time`,
                        isGameNotification: true,
                    });
            }
        }
    }

    console.log(gameNotification);

    function resetGame() {
        // If word length setting has been changed, get new array of random words from api
        if (gameSettings2.futureGameSettings.wordLength !== gameSettings2.currentGameSettings.wordLength) {
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
                        gameSettings2.futureGameSettings.wordLength
                    )}-1234567890${randomLettersString}&max=25`
                );
                const randomWordsArray1 = await randomWordsData1.json();

                // Get 75 words from API that don't include "a" (due to most words gotten from API call including and starting with "a")
                const randomWordsData2 = await fetch(
                    `https://api.datamuse.com/words?sp=${"?".repeat(
                        gameSettings2.futureGameSettings.wordLength
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
            fetchNewData();
            setIsLoading(false);
        } else {
            const newRandomWord =
                randomWordAndArray.randomWordArray[
                    Math.floor(Math.random() * randomWordAndArray.randomWordArray.length)
                ].toLowerCase();
            setRandomWordAndArray((prevRandomWordArray) => ({ ...prevRandomWordArray, randomWord: newRandomWord }));
        }

        const newStageWordArray: string[] = Array(gameSettings2.futureGameSettings.numberStages).fill("");
        setStageWordArray(newStageWordArray);
        const newLineClassNames: string[][] = Array(gameSettings2.futureGameSettings.numberStages).fill(
            Array(gameSettings2.futureGameSettings.wordLength).fill("tile")
        );
        setLineClassNames(newLineClassNames);
        setCurrentGuess("");
        setCurrentStage(0);
        setGameSettings2((prevGameSettings2) => ({
            ...prevGameSettings2,
            currentGameSettings: {
                ...prevGameSettings2.futureGameSettings,
                hardMode: prevGameSettings2.currentGameSettings.hardMode,
                lazyMode: prevGameSettings2.currentGameSettings.lazyMode
            },
        }));
        setIsPopUpOpen(prevIsPopUpOpen => ({...prevIsPopUpOpen, isSettingsPopUpOpen: false}));
    }

    function handleChangeGameSettings(gameSetting: string, option: string) {
        switch (gameSetting) {
            case "word-length":
                if (option === "increment" && gameSettings2.futureGameSettings.wordLength < 10)
                    setGameSettings2((prevGameSettings2) => ({
                        ...prevGameSettings2,
                        futureGameSettings: {
                            ...prevGameSettings2.futureGameSettings,
                            wordLength: prevGameSettings2.futureGameSettings.wordLength + 1,
                        },
                    }));
                else if (option === "decrement" && gameSettings2.futureGameSettings.wordLength > 2)
                    setGameSettings2((prevGameSettings2) => ({
                        ...prevGameSettings2,
                        futureGameSettings: {
                            ...prevGameSettings2.futureGameSettings,
                            wordLength: prevGameSettings2.futureGameSettings.wordLength - 1,
                        },
                    }));
                return;

            case "stage-number":
                if (option === "increment" && gameSettings2.futureGameSettings.numberStages < 13)
                    setGameSettings2((prevGameSettings2) => ({
                        ...prevGameSettings2,
                        futureGameSettings: {
                            ...prevGameSettings2.futureGameSettings,
                            numberStages: prevGameSettings2.futureGameSettings.numberStages + 1,
                        },
                    }));
                else if (option === "decrement" && gameSettings2.futureGameSettings.numberStages > 1)
                    setGameSettings2((prevGameSettings2) => ({
                        ...prevGameSettings2,
                        futureGameSettings: {
                            ...prevGameSettings2.futureGameSettings,
                            numberStages: prevGameSettings2.futureGameSettings.numberStages - 1,
                        },
                    }));
                return;

            case "hard-mode":
                setGameSettings2((prevGameSettings2) => ({
                    ...prevGameSettings2,
                    currentGameSettings: {
                        ...prevGameSettings2.currentGameSettings,
                        hardMode: !prevGameSettings2.currentGameSettings.hardMode,
                    },
                }));
                return;
            
            case "lazy-mode":
                setGameSettings2((prevGameSettings2) => ({
                    ...prevGameSettings2, 
                    currentGameSettings: {
                        ...prevGameSettings2.currentGameSettings,
                        lazyMode: !prevGameSettings2.currentGameSettings.lazyMode
                    }
                }));
                return;

            default:
                return;
        }
    }

    function handleChangeDarkMode() {
        setIsDarkMode((prevIsDarkMode) => !prevIsDarkMode);
    }

    // function handleLetterClick(letter: string) {
    //     if (letter === "Enter") {
    //         if (currentGuess.length === gameSettings.wordLength) {
    //             fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + currentGuess)
    //                 .then((response) => {
    //                     if (response.ok) console.log("handleStateChange"); //handleStageChange();
    //                     else {
    //                         let classArray: string[] = "tile shake,".repeat(5).split(",");
    //                         classArray.pop();
    //                         setLineClassNames((prevLineClassNames) => {
    //                             let newLineClassNames = [...prevLineClassNames];
    //                             newLineClassNames[currentStage] = classArray;
    //                             return newLineClassNames;
    //                         });

    //                         if (notificationsDivRef.current?.className.includes("notification_container_animate"))
    //                             resetGameNotificationAnimation();
    //                     }
    //                 })
    //                 .catch((error) => {
    //                     console.log(error);
    //                 });
    //         }
    //     } else if (letter === "Backspace") {
    //         setCurrentGuess((prevCurrentGuess) => {
    //             if (prevCurrentGuess.length > 0) return prevCurrentGuess.slice(0, -1);
    //             else return prevCurrentGuess;
    //         });
    //     } else if (currentGuess.length < gameSettings.wordLength)
    //         setCurrentGuess((prevCurrentGuess) => prevCurrentGuess + letter);
    //     else return;
    // }

    const notificationsDivRef = useRef<HTMLDivElement>(null);

    function resetGameNotificationAnimation() {
        // if (notificationsDivRef.current)
        //     notificationsDivRef.current.className = "notification_container notification_container_invisible";
        // setTimeout(() => {
        //     if (notificationsDivRef.current)
        //         notificationsDivRef.current.className = "notification_container notification_container_animate";
        // }, 100);

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
                setIsPopUpOpen(prevIsPopUpOpen => ({...prevIsPopUpOpen, isSettingsPopUpOpen: !prevIsPopUpOpen.isSettingsPopUpOpen}));
                break;

            case "stats":
                setIsPopUpOpen(prevIsPopUpOpen => ({...prevIsPopUpOpen, isStatsPopUpOpen: !prevIsPopUpOpen.isStatsPopUpOpen}));
                break;
    
            case "help":
                setIsPopUpOpen(prevIsPopUpOpen => ({...prevIsPopUpOpen, isHelpPopUpOpen: !prevIsPopUpOpen.isHelpPopUpOpen}));
                break;
    
            default:
                break;
        }
    }


    // TODO:
    // - Dark Mode
    // - Visually impaired mode (or whatever its called)
    // - Improve settings component (as pop up), including toggles and toggle animation
    // - Make help component
    // - Improve stats component
    // - Consider having state to keep track of if the last guess submitted was correct or incorrect. That state could actually be an object that has: { and array of all guessed words, the last guessed word}
    //      the last guessed word could then be used to improve the highlighting of the backspace and enter keys in the Keyboard component (if last guess is the same as current guess, keep highlighting backspace key)
    // - Add localStorage for all state variables
    // - Fix bug where after game ending, if you click keyboard, it reshows notification (maybe prevent player from clicking keyboard, or dont do anything when he does)[line 597]
    // - Make stats pop up appear even when game is lost

    const keyboardLetterRowsArray: string[] = [
        ALPHABET_LETTERS.split("a")[0],
        ALPHABET_LETTERS.split("p")[1].split("z")[0],
        ALPHABET_LETTERS.split("l")[1],
    ];

    console.log("------dictionary API", isApiAvailable.isDictionaryApiAvailable ? "available" : "not available");
    console.log("------words API", isApiAvailable.isWordApiAvailable ? "available" : "not available");
    console.log(playerStatistics);

    return (
        <div className="app_container">
            <Navbar toggleIsPopUpOpen={toggleIsPopUpOpen} />

            {isLoading ? (
                <main className="main_container_loading">
                    <i className="fas fa-spinner fa-spin"></i>
                </main>
            ) : (
                <main className="main_container">
                    <div className="game_container">
                        <div className="gameboard_container">
                            {stageWordArray.map((line, index) => {
                                const isCurrentStage = index === currentStage;
                                return (
                                    <Line
                                        key={index}
                                        line={isCurrentStage ? currentGuess : line ?? ""}
                                        lineClassNames={lineClassNames}
                                        index={index}
                                        wordLength={gameSettings2.currentGameSettings.wordLength}
                                        numberStages={gameSettings2.currentGameSettings.numberStages}
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
                                    //handleLetterClick={handleLetterClick}
                                    //handleKeydown={handleKeydown}
                                    wordLength={gameSettings2.currentGameSettings.wordLength}
                                    handleKeyClick={handleKeyClick}
                                    currentGuess={currentGuess}
                                    currentStage={currentStage}
                                    gameNotification={gameNotification}
                                />
                            ))}
                        </div>
                    </div>

                    {/* TODO: Remove this (if words API isnt available, use dummy data; if dictionary API isnt available, dont use it) */}
                    <div className="api_warnings">
                        {/* {isApiAvailable.isDictionaryApiAvailable ? (
                            <p>DictionaryApi is available</p>
                        ) : (
                            <p>DictionaryApi is not available</p>
                        )}

                        {isApiAvailable.isWordApiAvailable ? (
                            <p>WordApi is available</p>
                        ) : (
                            <p>WordApi is not available</p>
                        )} */}
                    </div>

                    {/* <div
                        ref={notificationsDivRef}
                        className={
                            lineClassNames[currentStage] != null && lineClassNames[currentStage][0].includes("shake")
                                ? "notification_container notification_container_animate"
                                : "notification_container notification_container_invisible"
                        }
                    >
                        Word doesn't exist
                    </div> */}

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
                        gameSettings2={gameSettings2}
                        isApiAvailable={isApiAvailable}
                        isDarkMode={isDarkMode}
                        handleChangeDarkMode={handleChangeDarkMode}
                        resetButtonRef={resetButtonRef}
                        resetGame={resetGame}
                    />

                    <StatsPopUp
                        isStatsPopUpOpen={isPopUpOpen.isStatsPopUpOpen}
                        toggleIsPopUpOpen={toggleIsPopUpOpen}
                        playerStatistics={playerStatistics}
                    />

                    <HelpPopUp
                        isHelpPopUpOpen={isPopUpOpen.isHelpPopUpOpen}
                        toggleIsPopUpOpen={toggleIsPopUpOpen}
                    />
                </main>
            )}

            <Footer />
        </div>
    );
}
