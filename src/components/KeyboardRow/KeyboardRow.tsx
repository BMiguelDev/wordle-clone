import React from "react";

import { gameNotificationType } from "../../models/model";
import styles from "./KeyboardRow.module.scss";

interface PropTypes {
    keyboardRowString: string;
    stageWordArray: string[];
    lineClassNames: string[][];
    //handleLetterClick: (letter: string) => void;
    //handleKeydown: (event: KeyboardEvent | React.MouseEvent<HTMLParagraphElement, MouseEvent>, key?: string) => void;
    handleKeyClick: (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>, key: string) => void;
    currentGuess: string;
    currentStage: number;
    gameNotification: gameNotificationType;
    wordLength: number;
}

export default function KeyboardRow({
    keyboardRowString,
    stageWordArray,
    lineClassNames,
    //handleLetterClick,
    handleKeyClick,
    currentGuess,
    currentStage,
    gameNotification,
    wordLength,
}: PropTypes) {
    return (
        <div className={styles.keyboard_row}>
            {keyboardRowString[0] === "z" && (
                <p
                    className={
                        // TODO: improve highlighting based on previousGuess state variable
                        currentGuess.length === 5 && !gameNotification.isGameNotification
                            ? `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_enter} ${styles.keyboard_letter_tile_highlight}`
                            : `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_enter}`
                    }
                    onClick={(e) => handleKeyClick(e, "Enter") /*handleLetterClick("Enter")*/}
                >
                    Enter
                </p>
            )}
            {keyboardRowString.split("").map((letter, index) => {
                let letterClassName: string = `${styles.keyboard_letter_tile}`;
                stageWordArray.forEach((word, index) => {
                    const letterIndexInStageWord = word.search(letter);
                    if (letterIndexInStageWord !== -1) {
                        if (lineClassNames[index][letterIndexInStageWord].includes("green"))
                            letterClassName = `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_green}`;
                        else if (lineClassNames[index][letterIndexInStageWord].includes("yellow")) {
                            if (!letterClassName.includes("keyboard_letter_tile_green"))
                                letterClassName = `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_yellow}`;
                        } else if (lineClassNames[index][letterIndexInStageWord].includes("grey")) {
                            if (
                                !letterClassName.includes("keyboard_letter_tile_green") &&
                                !letterClassName.includes("keyboard_letter_tile_yellow")
                            )
                                letterClassName = `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_grey}`;
                        }
                    }
                });
                return (
                    <div
                        onClick={(e) => handleKeyClick(e, letter) /*handleLetterClick(letter)*/}
                        key={index}
                        className={letterClassName}
                        style={{ animationDelay: `${wordLength * 0.2}s` }}
                    >
                        <p className={styles.keyboard_letter_text}>{letter}</p>
                    </div>
                );
            })}
            {keyboardRowString[0] === "z" && (
                <p
                    className={
                        // TODO: improve highlighting based on previousGuess state variable
                        currentGuess.length === 5 && gameNotification.isGameNotification //lineClassNames[currentStage][0].includes("shake")
                            ? `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_backspace} ${styles.keyboard_letter_tile_highlight}`
                            : `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_backspace}`
                    }
                    onClick={(e) => handleKeyClick(e, "Backspace") /*handleLetterClick("Backspace")*/}
                >
                    <i className="fa-solid fa-delete-left"></i>
                </p>
            )}
        </div>
    );
}
