import React, { useEffect, useRef, useState } from "react";

import styles from "./HelpPopUp.module.scss";

interface PropTypes {
    isHelpPopUpOpen: boolean;
    toggleIsPopUpOpen: (event: React.MouseEvent, popUpName: string) => void;
}

export default function HelpPopUp({ isHelpPopUpOpen, toggleIsPopUpOpen }: PropTypes) {
    const [isRender, setIsRender] = useState<boolean>(isHelpPopUpOpen);

    useEffect(() => {
        if (isHelpPopUpOpen) setIsRender(true);
    }, [isHelpPopUpOpen]);

    const helpPopupContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkClickToExitHelp = (event: any) => {
            if (isHelpPopUpOpen) {
                if (helpPopupContainerRef.current && !helpPopupContainerRef.current?.contains(event.target)) {
                    toggleIsPopUpOpen(event, "help");
                }
            }
        };

        window.addEventListener("click", checkClickToExitHelp);

        return () => {
            window.removeEventListener("click", checkClickToExitHelp);
        };
    }, [isHelpPopUpOpen, toggleIsPopUpOpen]);

    function handleAnimationEnd() {
        if (!isHelpPopUpOpen) setIsRender(false);
    }

    const exampleStrings: string[] = ["wordle", "but", "better"];

    return isRender ? (
        <div className={styles.help_pop_up_wrapper}>
            <div
                ref={helpPopupContainerRef}
                className={`${styles.help_popup_container} ${isHelpPopUpOpen ? "" : styles.help_popup_container_hide}`}
                onAnimationEnd={handleAnimationEnd}
            >
                <h3 className={styles.help_popup_title}>How to Play</h3>
                <h4 className={styles.help_popup_subtitle}>Guess the Wordle before you run out of tries!</h4>
                <ul className={styles.help_popup_description_list}>
                    <li>Each guess should be a valid word.</li>
                    <li>You can change the word length and number of tries in the game settings.</li>
                    <li>The color of the tiles will change to show how close your guess was to the word.</li>
                </ul>
                <div className={styles.help_popup_examples_container}>
                    <h6>Examples</h6>
                    <div className={styles.help_popup_example_item}>
                        <div className={styles.help_popup_example_tiles}>
                            {exampleStrings[0].split("").map((letter, index) => (
                                <div key={index} className={`${styles.popup_example_tile} ${letter === "w" ? styles.popup_example_tile_green : ""}`}>
                                    <p className={styles.popup_example_letter}>{letter}</p>
                                </div>
                            ))}
                        </div>
                        <p>
                            <span>W</span> is in the word and in the correct spot
                        </p>
                    </div>
                    <div className={styles.help_popup_example_item}>
                        <div className={styles.help_popup_example_tiles}>
                            {exampleStrings[1].split("").map((letter, index) => (
                                <div key={index} className={`${styles.popup_example_tile} ${letter === "u" ? styles.popup_example_tile_yellow : ""}`}>
                                    <p className={styles.popup_example_letter}>{letter}</p>
                                </div>
                            ))}
                        </div>
                        <p>
                            <span>U</span> is in the word but in the wrong spot
                        </p>
                    </div>
                    <div className={styles.help_popup_example_item}>
                        <div className={styles.help_popup_example_tiles}>
                            {exampleStrings[2].split("").map((letter, index) => (
                                <div key={index} className={`${styles.popup_example_tile} ${letter === "r" ? styles.popup_example_tile_grey : ""}`}>
                                    <p className={styles.popup_example_letter}>{letter}</p>
                                </div>
                            ))}
                        </div>
                        <p>
                            <span>R</span> is not in the word in any spot
                        </p>
                    </div>
                </div>

                <button className={styles.help_popup_exit_button} onClick={(e) => toggleIsPopUpOpen(e, "help")}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    ) : (
        <div className={styles.help_pop_up_hidden} />
    );
}
