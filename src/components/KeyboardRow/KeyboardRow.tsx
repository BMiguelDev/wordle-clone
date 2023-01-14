import React from "react";

import { gameDescriptionType } from "../../models/model";
import styles from "./KeyboardRow.module.scss";

interface PropTypes {
    keyboardRowString: string;
    stageWordArray: string[];
    lineClassNames: string[][];
    handleKeyClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => void;
    currentGuess: string;
    gameDescription: gameDescriptionType;
    wordLength: number;
}

export default function KeyboardRow({
    keyboardRowString,
    stageWordArray,
    lineClassNames,
    handleKeyClick,
    currentGuess,
    gameDescription,
    wordLength,
}: PropTypes) {
    return (
        <div className={styles.keyboard_row}>
            {keyboardRowString[0] === "z" && (
                <div
                    className={
                        currentGuess.length === wordLength && gameDescription.attemptedGuesses[gameDescription.attemptedGuesses.length-1]!==currentGuess && !stageWordArray.includes(currentGuess)
                            ? `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_enter} ${styles.keyboard_letter_tile_highlight}`
                            : `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_enter}`
                    }
                    onClick={(e) => handleKeyClick(e, "Enter")}
                >
                    Enter
                </div>
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
                        onClick={(e) => handleKeyClick(e, letter)}
                        key={index}
                        className={letterClassName}
                        style={{ animationDelay: `${wordLength * 0.2}s` }}
                    >
                        <p className={styles.keyboard_letter_text}>{letter}</p>
                    </div>
                );
            })}
            {keyboardRowString[0] === "z" && (
                <div
                    className={
                        currentGuess.length === wordLength && gameDescription.attemptedGuesses[gameDescription.attemptedGuesses.length-1]===currentGuess && !stageWordArray.includes(currentGuess)
                            ? `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_backspace} ${styles.keyboard_letter_tile_highlight}`
                            : `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_backspace}`
                    }
                    onClick={(e) => handleKeyClick(e, "Backspace")}
                >
                    <i className="fa-solid fa-delete-left"></i>
                </div>
            )}
        </div>
    );
}
