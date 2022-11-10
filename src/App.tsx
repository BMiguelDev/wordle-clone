import React, { useCallback, useEffect, useRef, useState } from "react";

import "./App.scss";
import { WordData } from "./data/WordData";
import { /*gameSettingsType,*/ gameSettings2Type, isApiAvailableType, randomWordAndArrayType } from "./models/model";
import Line from "./components/Line/Line";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import KeyboardRow from "./components/KeyboardRow/KeyboardRow";
import SettingsPopUp from "./components/SettingsPopUp/SettingsPopUp";

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

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSettingsPopUpOpen, setIsSettingsPopUpOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

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

    useEffect(() => {
        console.log("Changed CurrentGuess");
    }, [currentGuess]);

    useEffect(() => {
        console.log("Changed currentStage");
    }, [currentStage]);

    useEffect(() => {
        console.log("Changed randomWordAndArray");
    }, [randomWordAndArray]);

    // useEffect(() => {
    //     console.log("Changed gameSettings");
    // }, [gameSettings]);

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

                if (currentGuess === randomWordAndArray.randomWord) {
                    alert("you win");
                }
                setCurrentGuess("");
                setCurrentStage((prevCurrentStage) => prevCurrentStage + 1);
            } else return;
        }, // TODO: replace gameSettings with gameSettings.prevGameSettings or something
        [currentGuess, currentStage, /*gameSettings,*/ randomWordAndArray, gameSettings2.currentGameSettings]
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
                        if (index === currentGuess.length) return "tile tick";
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
                        let arrayOfHintedLetters: string[] = []; // Array that will hold all the hinted letters ofo previous stages
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
                            if (notificationsDivRef.current?.className.includes("notification_container_animate"))
                                resetAnimation();
                            console.log("Current Guess must include all hinted letters");
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
                                            if (
                                                notificationsDivRef.current?.className.includes(
                                                    "notification_container_animate"
                                                )
                                            )
                                                resetAnimation();
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
                    } else if (isApiAvailable.isDictionaryApiAvailable) {
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
                                    if (
                                        notificationsDivRef.current?.className.includes(
                                            "notification_container_animate"
                                        )
                                    )
                                        resetAnimation();

                                    //alert("Word doesn't exist");
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
        //                                 resetAnimation();

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
                if (!isSettingsPopUpOpen) {
                    window.addEventListener("keydown", handleKeydown);
                    console.log("I created new event listener");
                }
            } else alert(`Game over, random word was ${randomWordAndArray.randomWord}`);
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
        //gameSettings,
        gameSettings2.currentGameSettings,
        randomWordAndArray,
        isSettingsPopUpOpen,
        stageWordArray,
    ]);

    function resetGame() {
        //resetButtonRef.current?.blur();

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
            setRandomWordAndArray(prevRandomWordArray => ({ ...prevRandomWordArray, randomWord: newRandomWord }));
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
            },
        }));
        setIsSettingsPopUpOpen(false);
    }

    function handleChangeGameSettings(gameSetting: string, option: string) {
        switch (gameSetting) {
            case "word-length":
                if (gameSettings2.futureGameSettings.wordLength > 10 || gameSettings2.futureGameSettings.wordLength < 2)
                    return;
                if (option === "increment" && gameSettings2.futureGameSettings.wordLength < 10)
                    setGameSettings2((prevGameSettings2) => ({
                        ...prevGameSettings2,
                        futureGameSettings: {
                            ...prevGameSettings2.futureGameSettings,
                            wordLength: prevGameSettings2.futureGameSettings.wordLength + 1,
                        },
                        //wordLength: prevGameSettings.wordLength + 1,
                    }));
                else if (option === "decrement" && gameSettings2.futureGameSettings.wordLength > 2)
                    setGameSettings2((prevGameSettings2) => ({
                        ...prevGameSettings2,
                        futureGameSettings: {
                            ...prevGameSettings2.futureGameSettings,
                            wordLength: prevGameSettings2.futureGameSettings.wordLength - 1,
                        },
                        //wordLength: prevGameSettings.wordLength - 1,
                    }));
                return;

            case "stage-number":
                if (
                    gameSettings2.futureGameSettings.numberStages > 13 ||
                    gameSettings2.futureGameSettings.numberStages < 1
                )
                    return;
                if (option === "increment" && gameSettings2.futureGameSettings.numberStages < 13)
                    setGameSettings2((prevGameSettings2) => ({
                        ...prevGameSettings2,
                        futureGameSettings: {
                            ...prevGameSettings2.futureGameSettings,
                            numberStages: prevGameSettings2.futureGameSettings.numberStages + 1,
                        },
                        //numberStages: prevGameSettings.numberStages + 1,
                    }));
                else if (option === "decrement" && gameSettings2.futureGameSettings.numberStages > 1)
                    setGameSettings2((prevGameSettings2) => ({
                        ...prevGameSettings2,
                        futureGameSettings: {
                            ...prevGameSettings2.futureGameSettings,
                            numberStages: prevGameSettings2.futureGameSettings.numberStages - 1,
                        },
                        //numberStages: prevGameSettings.numberStages - 1,
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
    //                             resetAnimation();
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

    function resetAnimation() {
        if (notificationsDivRef.current)
            notificationsDivRef.current.className = "notification_container notification_container_invisible";
        setTimeout(() => {
            if (notificationsDivRef.current)
                notificationsDivRef.current.className = "notification_container notification_container_animate";
        }, 100);
    }

    function toggleIsSettingsPopUpOpen(event: React.MouseEvent) {
        event.stopPropagation();
        setIsSettingsPopUpOpen((prevIsSettingsPopUpOpen) => !prevIsSettingsPopUpOpen);
    }

    // TODO:
    // - make game settings work (Change gameSettings to object with prevGameSettings; only apply newGameSettings on gameReset and on handleStateChange; big
    //      useEffect should have prevGameSettings)
    // - Fix gameSetting of word length (upon changing word length settings, also change size of lineClassNames array)
    // - Fix notifications components to take any text dynamically
    // - Dark Mode
    // - Improve settings component (as pop up)
    // - Make winning message component (as pop up) appear after tiles flip (maybe keep track of player wins, and how many guesses it took)
    // - Fix bug: when wrong word is inputted and "enter", backspace key flashes and notifications is shown, but quickly (too quickly [BECAUSE 'SHAKE' is removed from lineClassNames (line 591)]), notification hides and enter key is highlighted. (Seems like a state-being-flipped problem)

    const keyboardLetterRowsArray: string[] = [
        ALPHABET_LETTERS.split("a")[0],
        ALPHABET_LETTERS.split("p")[1].split("z")[0],
        ALPHABET_LETTERS.split("l")[1],
    ];

    console.log("------dictionary API", isApiAvailable.isDictionaryApiAvailable ? "available" : "not available");
    console.log("------words API", isApiAvailable.isWordApiAvailable ? "available" : "not available");

    return (
        <div className="app_container">
            <Navbar toggleIsSettingsPopUpOpen={toggleIsSettingsPopUpOpen} />

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
                                    handleKeydown={handleKeydown}
                                    currentGuess={currentGuess}
                                    currentStage={currentStage}
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

                    <div
                        ref={notificationsDivRef}
                        className={
                            lineClassNames[currentStage] != null && lineClassNames[currentStage][0].includes("shake")
                                ? "notification_container notification_container_animate"
                                : "notification_container notification_container_invisible"
                        }
                    >
                        Word doesn't exist
                    </div>

                    {/* {isSettingsPopUpOpen && ( */}
                    <SettingsPopUp
                        isSettingsPopUpOpen={isSettingsPopUpOpen}
                        toggleIsSettingsPopUpOpen={toggleIsSettingsPopUpOpen}
                        handleChangeGameSettings={handleChangeGameSettings}
                        gameSettings2={gameSettings2}
                        isApiAvailable={isApiAvailable}
                        isDarkMode={isDarkMode}
                        handleChangeDarkMode={handleChangeDarkMode}
                        resetButtonRef={resetButtonRef}
                        resetGame={resetGame}
                    />
                    {/* )} */}
                </main>
            )}

            <Footer />
        </div>
    );
}
