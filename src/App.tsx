import React, { useEffect, useRef, useState } from "react";

import "./App.scss";
import { WordData } from "./data/WordData";
import { Line } from "./Line";

const ALPHABET_LETTERS = "qwertyuiopasdfghjklzxcvbnm";

export default function App() {
    // Variable <gameSettings> is an object holding the dynamic settings of the game: number of stages and word lenght
    const [gameSettings, setGameSettings] = useState<gameSettingsType>({ numberStages: 6, wordLength: 5 });

    const [randomWordAndArray, setRandomWordAndArray] = useState<randomWordAndArrayType>({
        randomWord: "",
        randomWordArray: [],
    });
    const [stageWordArray, setStageWordArray] = useState<string[]>(Array(gameSettings.numberStages).fill(""));
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const [currentStage, setCurrentStage] = useState<number>(0);
    const [lineClassNames, setLineClassNames] = useState<string[][]>(
        Array(gameSettings.numberStages).fill(Array(gameSettings.wordLength).fill("tile"))
    );
    // Object variable holding a boolean for each api used, true is the api is available and false if it's not available
    const [isApiAvailable, setIsApiAvailable] = useState<isApiAvailableType>({
        isDictionaryApiAvailable: false,
        isWordApiAvailable: false,
    });

    // Ref variable to access reset button
    const resetButtonRef = useRef<HTMLButtonElement>(null);

    interface isApiAvailableType {
        isDictionaryApiAvailable: boolean;
        isWordApiAvailable: boolean;
    }
    interface randomWordAndArrayType {
        randomWord: string;
        randomWordArray: string[];
    }

    interface gameSettingsType {
        numberStages: number;
        wordLength: number;
    }

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

                // Get 75 words from API that may include "a"
                const randomWordsData1 = await fetch(
                    `https://api.datamuse.com/words?sp=${"?".repeat(
                        gameSettings.wordLength
                    )}-1234567890${randomLettersString}&max=25`
                );
                console.log("HEY1", randomWordsData1);
                const randomWordsArray1 = await randomWordsData1.json();

                // Get 425 words from API that don't include "a" (due to most words gotten from API call including and starting with "a")
                const randomWordsData2 = await fetch(
                    `https://api.datamuse.com/words?sp=${"?".repeat(
                        gameSettings.wordLength
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
        fetchData();

        // Check if dictionary Api is available
        const checkDictionaryApi = async () => {
            const dictionaryTestData = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/hello");
            if (dictionaryTestData.ok)
                setIsApiAvailable((prevIsApiAvailable) => ({ ...prevIsApiAvailable, isDictionaryApiAvailable: true }));
            console.log(dictionaryTestData);
        };
        checkDictionaryApi();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        function handleStageChange() {
            if (currentStage < gameSettings.numberStages) {
                //Make checks
                let colorArray: string[] = [];
                currentGuess
                    .toLowerCase()
                    .split("")
                    .forEach((currentGuessChar, currentGuessIndex) => {
                        let color: string = "tile flip grey";
                        randomWordAndArray.randomWord.split("").forEach((randomWordChar, randomWordIndex) => {
                            if (currentGuessChar === randomWordChar) {
                                if (color !== "tile flip green") color = "tile flip yellow";
                            }
                            if (currentGuessChar === randomWordChar && currentGuessIndex === randomWordIndex)
                                color = "tile flip green";
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
        }

        const handleKeydown = (event: KeyboardEvent) => {
            if (currentGuess.length < gameSettings.wordLength && event.key.length === 1 && /[a-zA-Z]/.test(event.key))
                setCurrentGuess((prevCurrentGuess) => prevCurrentGuess + event.key);
            else if (event.key === "Enter") {
                if (currentGuess.length === gameSettings.wordLength) {
                    if (isApiAvailable.isDictionaryApiAvailable) {
                        fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + currentGuess)
                            .then((response) => {
                                if (response.ok) handleStageChange();
                                else {
                                    let classArray: string[] = "tile shake,".repeat(gameSettings.wordLength).split(",");
                                    classArray.pop();
                                    setLineClassNames((prevLineClassNames) => {
                                        let newLineClassNames = [...prevLineClassNames];
                                        newLineClassNames[currentStage] = classArray;
                                        return newLineClassNames;
                                    });
                                    if(notificationsDivRef.current?.className.includes('notification_container_animate')) resetAnimation();
                                  
                                    //alert("Word doesn't exist");
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else { // if dictionary Api is not available, don't check if word exists and allow any word
                        handleStageChange();
                    }
                }
            } else if (event.key === "Backspace") {
                // After hitting backspace, if current row had className "shake", remove it (so that it can be 
                // added again if word doesn't exist and trigger the shaking animation again)
                if(lineClassNames[currentStage][0]==="tile shake") {
                    const newLineClassNamesRow: string[] = Array(gameSettings.wordLength).fill("tile");
                    setLineClassNames((prevLineClassNames) => {
                        let newLineClassNames = [...prevLineClassNames];
                        newLineClassNames[currentStage] = newLineClassNamesRow;
                        return newLineClassNames;
                    });
                }
                setCurrentGuess((prevCurrentGuess) => {
                    if (prevCurrentGuess.length > 0) return prevCurrentGuess.slice(0, -1);
                    else return prevCurrentGuess;
                });
            }
        };
        // If random word hasn't been correctly guessed yet and if last stage hasn't been reached, let user keep typing guessess
        if (!stageWordArray.includes(randomWordAndArray.randomWord)) {
            if (currentStage < gameSettings.numberStages) {
                window.addEventListener("keydown", handleKeydown);
            } else alert(`Game over, random word was ${randomWordAndArray.randomWord}`);
        }

        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    }, [currentGuess, currentStage, randomWordAndArray, gameSettings, stageWordArray, isApiAvailable, lineClassNames]);

    function resetGame() {
        resetButtonRef.current?.blur();
        const newRandomWord =
            randomWordAndArray.randomWordArray[
                Math.floor(Math.random() * randomWordAndArray.randomWordArray.length)
            ].toLowerCase();
        setRandomWordAndArray({ ...randomWordAndArray, randomWord: newRandomWord });
        const newStageWordArray: string[] = Array(gameSettings.numberStages).fill("");
        setStageWordArray(newStageWordArray);
        const newLineClassNames: string[][] = Array(gameSettings.numberStages).fill(
            Array(gameSettings.wordLength).fill("tile")
        );
        setLineClassNames(newLineClassNames);
        setCurrentGuess("");
        setCurrentStage(0);
    }

    function handleChangeStages(type: string) {
        if (gameSettings.numberStages > 12 || gameSettings.numberStages < 2) return;
        if (type === "increment")
            setGameSettings((prevGameSettings) => ({
                ...gameSettings,
                numberStages: prevGameSettings.numberStages + 1,
            }));
        else if (type === "decrement")
            setGameSettings((prevGameSettings) => ({
                ...gameSettings,
                numberStages: prevGameSettings.numberStages - 1,
            }));
        else return;
    }

    function handleChangeWordLength(type: string) {
        if (gameSettings.wordLength > 10 || gameSettings.wordLength < 2) return;
        if (type === "increment")
            setGameSettings((prevGameSettings) => ({ ...gameSettings, wordLength: prevGameSettings.wordLength + 1 }));
        else if (type === "decrement")
            setGameSettings((prevGameSettings) => ({ ...gameSettings, wordLength: prevGameSettings.wordLength - 1 }));
        else return;
    }

    function handleLetterClick(letter: string) {
        if (letter === "Enter") {
            if (currentGuess.length === gameSettings.wordLength) {
                fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + currentGuess)
                    .then((response) => {
                if (response.ok) console.log("handleStateChange"); //handleStageChange();
                    else {
                        let classArray: string[] = "tile shake,".repeat(5).split(",");
                        classArray.pop();
                        setLineClassNames((prevLineClassNames) => {
                            let newLineClassNames = [...prevLineClassNames];
                            newLineClassNames[currentStage] = classArray;
                            return newLineClassNames;
                        });
                        if(notificationsDivRef.current?.className.includes('notification_container_animate')) resetAnimation();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        } else if (letter === "Backspace") {
            setCurrentGuess((prevCurrentGuess) => {
                if (prevCurrentGuess.length > 0) return prevCurrentGuess.slice(0, -1);
                else return prevCurrentGuess;
            });
        } else if (currentGuess.length < gameSettings.wordLength)
            setCurrentGuess((prevCurrentGuess) => prevCurrentGuess + letter);
        else return;
    }

    const notificationsDivRef = useRef<HTMLDivElement>(null);

    function resetAnimation() {
        // var el = document.getElementById('.notification_container');
        // if(el) {
        //     el.style.animation = 'none';
        //     const hi = () => {if(el) el.offsetHeight; /* trigger reflow */}
        //     const hello = () => el.style.animation = null; 
        // }
        // var me = this;
        // if(notificationsDivRef.current)
        // { 
            //notificationsDivRef.current.style.animation = 'none';

            if(notificationsDivRef.current) notificationsDivRef.current.className='notification_container notification_container_invisible';
            setTimeout(() => {
                if(notificationsDivRef.current) notificationsDivRef.current.className="notification_container notification_container_animate";
            }, 100)
            
            // setTimeout(() => {
            //     if(notificationsDivRef.current) notificationsDivRef.current.style.animation = '';
        //     // }, 10);
        // }

        // if(notificationsDivRef.current?.style.animation) {
        //     //notificationsDivRef.current?.style.animation='none';
        //     notificationsDivRef.current.offsetHeight;
        // }
        

    }
    // TODO:
    // - refactor code components
    // - make game settings work
    // - Add Footer and Header (header is just to look like the target website)
    // - Fix handleEnter (both Api call and function being only iniside useEffect)
    // - Fix notification div not reshowing when user enters the same currentGuess

    return (
        <div className="app">
            <div className="gameboard_container">
                {stageWordArray.map((line, index) => {
                    const isCurrentStage = index === currentStage;
                    return (
                        <Line
                            key={index}
                            line={isCurrentStage ? currentGuess : line ?? ""}
                            lineClassNames={lineClassNames}
                            index={index}
                            wordLength={gameSettings.wordLength}
                        />
                    );
                })}
            </div>
            <button ref={resetButtonRef} onClick={resetGame}>
                Reset
            </button>
            <div className="keyboard_container">
                <div className="keyboard_row">
                    {ALPHABET_LETTERS.substring(0, ALPHABET_LETTERS.search("p") + 1)
                        .split("")
                        .map((letter, index) => {
                            let letterClassName: string = "letter";
                            stageWordArray.forEach((word, index) => {
                                const letterIndexInStageWord = word.search(letter);
                                if (letterIndexInStageWord !== -1) {
                                    if (lineClassNames[index][letterIndexInStageWord].includes("green"))
                                        letterClassName = "letter letter_green";
                                    else if (lineClassNames[index][letterIndexInStageWord].includes("yellow")) {
                                        if (!letterClassName.includes("letter_green"))
                                            letterClassName = "letter letter_yellow";
                                    } else if (lineClassNames[index][letterIndexInStageWord].includes("grey")) {
                                        if (
                                            !letterClassName.includes("letter_green") &&
                                            !letterClassName.includes("letter_yellow")
                                        )
                                            letterClassName = "letter letter_grey";
                                    }
                                }
                            });
                            return (
                                <p onClick={() => handleLetterClick(letter)} key={index} className={letterClassName}>
                                    {letter}
                                </p>
                            );
                        })}
                </div>
                <div className="keyboard_row">
                    {ALPHABET_LETTERS.substring(ALPHABET_LETTERS.search("p") + 1, ALPHABET_LETTERS.search("l") + 1)
                        .split("")
                        .map((letter, index) => {
                            let letterClassName: string = "letter";
                            stageWordArray.forEach((word, index) => {
                                const letterIndexInStageWord = word.search(letter);
                                if (letterIndexInStageWord !== -1) {
                                    if (lineClassNames[index][letterIndexInStageWord].includes("green"))
                                        letterClassName = "letter letter_green";
                                    else if (lineClassNames[index][letterIndexInStageWord].includes("yellow")) {
                                        if (!letterClassName.includes("letter_green"))
                                            letterClassName = "letter letter_yellow";
                                    } else if (lineClassNames[index][letterIndexInStageWord].includes("grey")) {
                                        if (
                                            !letterClassName.includes("letter_green") &&
                                            !letterClassName.includes("letter_yellow")
                                        )
                                            letterClassName = "letter letter_grey";
                                    }
                                }
                            });
                            return (
                                <p onClick={() => handleLetterClick(letter)} key={index} className={letterClassName}>
                                    {letter}
                                </p>
                            );
                        })}
                </div>
                <div className="keyboard_row">
                    <p className={ currentGuess.length===5 && !lineClassNames[currentStage][0].includes("shake") ? "highlight" : ""} onClick={() => handleLetterClick("Enter")}>Enter</p>
                    {ALPHABET_LETTERS.substring(ALPHABET_LETTERS.search("l") + 1, ALPHABET_LETTERS.length)
                        .split("")
                        .map((letter, index) => {
                            let letterClassName: string = "letter";
                            stageWordArray.forEach((word, index) => {
                                const letterIndexInStageWord = word.search(letter);
                                if (letterIndexInStageWord !== -1) {
                                    if (lineClassNames[index][letterIndexInStageWord].includes("green"))
                                        letterClassName = "letter letter_green";
                                    else if (lineClassNames[index][letterIndexInStageWord].includes("yellow")) {
                                        if (!letterClassName.includes("letter_green"))
                                            letterClassName = "letter letter_yellow";
                                    } else if (lineClassNames[index][letterIndexInStageWord].includes("grey")) {
                                        if (
                                            !letterClassName.includes("letter_green") &&
                                            !letterClassName.includes("letter_yellow")
                                        )
                                            letterClassName = "letter letter_grey";
                                    }
                                }
                            });
                            return (
                                <p onClick={() => handleLetterClick(letter)} key={index} className={letterClassName}>
                                    {letter}
                                </p>
                            );
                        })}
                    <p className={ currentGuess.length===5 && lineClassNames[currentStage][0].includes("shake") ? "highlight" : ""} onClick={() => handleLetterClick("Backspace")}>Backspace</p>
                </div>
            </div>
            <div className="game_settings_container">
                <div>
                    <p>Word Lenght</p>
                    <button onClick={() => handleChangeWordLength("increment")}>+</button>
                    {gameSettings.wordLength}
                    <button onClick={() => handleChangeWordLength("decrement")}>-</button>
                </div>
                <div>
                    <p>Number of Stages</p>
                    <button onClick={() => handleChangeStages("increment")}>+</button>
                    {gameSettings.numberStages}
                    <button onClick={() => handleChangeStages("decrement")}>-</button>
                </div>
            </div>

            <div className="api_warnings">
                {isApiAvailable.isDictionaryApiAvailable ? (
                    <p>DictionaryApi is available</p>
                ) : (
                    <p>DictionaryApi is not available</p>
                )}

                {isApiAvailable.isWordApiAvailable ? <p>WordApi is available</p> : <p>WordApi is not available</p>}
            </div>

            <div ref={notificationsDivRef} className={(lineClassNames[currentStage] != null && lineClassNames[currentStage][0].includes('shake')) ? "notification_container notification_container_animate" : "notification_container notification_container_invisible" }>
                    Word doesn't exist
            </div>

            {/* {
                lineClassNames[currentStage] != null &&
                (lineClassNames[currentStage][0].includes("shake") && <div className="notification_container">Word doesn't exist</div>)
            } */}

            <button onClick={resetAnimation}>Reset Notification Animation</button>
        </div>
    );
}
