import React from "react";

import styles from "./KeyboardRow.module.scss";

interface PropTypes {
    keyboardRowString: string;
    stageWordArray: string[];
    lineClassNames: string[][];
    //handleLetterClick: (letter: string) => void;
    handleKeydown: (event: KeyboardEvent | React.MouseEvent<HTMLParagraphElement, MouseEvent>, key?: string) => void;
    currentGuess: string;
    currentStage: number;
}

export default function KeyboardRow({
    keyboardRowString,
    stageWordArray,
    lineClassNames,
    //handleLetterClick,
    handleKeydown,
    currentGuess,
    currentStage,
}: PropTypes) {
    return (
        <div className={styles.keyboard_row}>
            {keyboardRowString[0] === "z" && (
                <p
                    className={
                        currentGuess.length === 5 && !lineClassNames[currentStage][0].includes("shake")
                            ? `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_enter} ${styles.keyboard_letter_tile_highlight}`
                            : `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_enter}`
                    }
                    onClick={(e) => handleKeydown(e, "Enter") /*handleLetterClick("Enter")*/}
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
                    <div onClick={(e) => handleKeydown(e, letter) /*handleLetterClick(letter)*/} key={index} className={letterClassName}>
                        <p className={styles.keyboard_letter_text}>{letter}</p>
                    </div>
                );
            })}
            {keyboardRowString[0] === "z" && (
                <p
                    className={
                        currentGuess.length === 5 && lineClassNames[currentStage][0].includes("shake")
                            ? `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_backspace} ${styles.keyboard_letter_tile_highlight}`
                            : `${styles.keyboard_letter_tile} ${styles.keyboard_letter_tile_backspace}`
                    }
                    onClick={(e) => handleKeydown(e, "Backspace")/*handleLetterClick("Backspace")*/}
                >
                    <i className="fa-solid fa-delete-left"></i>
                </p>
            )}
        </div>
    );
}
