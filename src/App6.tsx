import React, { useEffect, useState } from "react";
import "./App6.scss";

const NUMBER_STAGES: number = 6;
const WORD_LENGTH: number = 5;

export default function App5() {
    const [randomWordAndArray, setRandomWordAndArray] = useState<randomWordAndArrayType>({randomWord: "", randomWordArray: []});
    const [stageWordArray, setStageWordArray] = useState<string[]>(Array(NUMBER_STAGES).fill(""));
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const [currentStage, setCurrentStage] = useState<number>(0);
    const [lineClassNames, setLineClassNames] = useState<string[][]>(
        Array(NUMBER_STAGES).fill(Array(WORD_LENGTH).fill("tile"))
    );

    interface randomWordAndArrayType {
        randomWord: string;
        randomWordArray: string[];
    }

    useEffect(() => {
        const fetchData = async () => {
            // Get 75 words from API that may include "a"
            const randomWordsData1 = await fetch(`https://api.datamuse.com/words?sp=${'?'.repeat(WORD_LENGTH)}-1234567890&max=75`);
            const randomWordsArray1 = await randomWordsData1.json();

            // Get 425 words from API that don't include "a" (due to most words gotten from default API call including and starting with "a")
            const randomWordsData2 = await fetch(`https://api.datamuse.com/words?sp=${'?'.repeat(WORD_LENGTH)}-1234567890aA&max=425`);
            const randomWordsArray2 = await randomWordsData2.json();

            // Join both arrays and keep only the words
            const jointRandomWordsArray = [...randomWordsArray1, ...randomWordsArray2];
            const newJointRandomWordsArray: string[] = jointRandomWordsArray.map(element => {
                return element.word;
            });
            const randomWord = newJointRandomWordsArray[Math.floor(Math.random() * newJointRandomWordsArray.length)].toLowerCase();
            setRandomWordAndArray({randomWord: randomWord, randomWordArray: newJointRandomWordsArray})
        }
        fetchData();
    }, []);

    useEffect(() => {
        function handleStageChange() {
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

            if (currentStage < 5) {
                if (currentGuess === randomWordAndArray.randomWord) {
                    alert("you win");
                }
                setCurrentGuess("");
                setCurrentStage((prevCurrentStage) => prevCurrentStage + 1);
            } else alert(`Game over, random word was ${randomWordAndArray.randomWord}`);
        }

        const handleKeydown = (event: KeyboardEvent) => {
            if (currentGuess.length < 5 && event.key.length === 1 && /[a-zA-Z]/.test(event.key))
                setCurrentGuess((prevCurrentGuess) => prevCurrentGuess + event.key);
            else if (event.key === "Enter") {
                if (currentGuess.length === 5) {
                    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + currentGuess)
                        .then((response) => {
                            if (response.ok) handleStageChange();
                            else {
                                alert("Word doesn't exist");
                                throw new Error("Error");
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            } else if (event.key === "Backspace") {
                setCurrentGuess((prevCurrentGuess) => {
                    if (prevCurrentGuess.length > 0) return prevCurrentGuess.slice(0, -1);
                    else return prevCurrentGuess;
                });
            }
        };
        window.addEventListener("keydown", handleKeydown);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    }, [currentGuess, currentStage, randomWordAndArray]);

    function resetGame() {
        const newRandomWord = randomWordAndArray.randomWordArray[Math.floor(Math.random() * randomWordAndArray.randomWordArray.length)].toLowerCase();
        setRandomWordAndArray({ ...randomWordAndArray, randomWord: newRandomWord })
        const newStageWordArray: string[] = Array(NUMBER_STAGES).fill("");
        setStageWordArray(newStageWordArray);
        const newLineClassNames: string[][] = Array(NUMBER_STAGES).fill(Array(WORD_LENGTH).fill("tile"));
        setLineClassNames(newLineClassNames);
        setCurrentGuess("");
        setCurrentStage(0);
    }

    return (
        <div className="app">
            {stageWordArray.map((line, index) => {
                const isCurrentStage = index === currentStage;
                return (
                    <Line
                        key={index}
                        line={isCurrentStage ? currentGuess : line ?? ""}
                        lineClassNames={lineClassNames}
                        index={index}
                    />
                );
            })}
            <button onClick={resetGame}>Reset</button>
        </div>
    );
}

interface LineProps {
    line: string;
    lineClassNames: string[][];
    index: number;
}

function Line({ line, lineClassNames, index }: LineProps) {
    let tileArray = [];

    for (let i = 0; i < WORD_LENGTH; i++) {
        tileArray.push(
            <div className={lineClassNames[index][i]} key={i}>
                {line[i]}
            </div>
        );
    }

    return <div className="tile_row">{tileArray}</div>;
}
