import React, { useEffect, useRef, useState } from 'react'

import styles from "./HelpPopUp.module.scss";


interface PropTypes {
  isHelpPopUpOpen: boolean;
  toggleIsPopUpOpen: (event: React.MouseEvent, popUpName: string) => void;
}


export default function HelpPopUp({ isHelpPopUpOpen, toggleIsPopUpOpen }: PropTypes) {
  const [isRender, setIsRender] = useState<boolean>(isHelpPopUpOpen);

    useEffect(() => {
        if(isHelpPopUpOpen) setIsRender(true);
    }, [isHelpPopUpOpen])

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
        if(!isHelpPopUpOpen) setIsRender(false);
    }

    return (
        isRender ? (
        <div className={styles.help_pop_up_wrapper}>
            <div
                ref={helpPopupContainerRef}
                className={`${styles.help_popup_container} ${
                  isHelpPopUpOpen ? '' : styles.help_popup_container_hide
                }`}
                onAnimationEnd={handleAnimationEnd}
            >
                <div className={styles.help_popup_title}>How to Play</div>
                <div className={styles.help_popup_settings}>
                    <div className={styles.singular_setting_container}>
                        <div className={styles.singular_setting_text}>
                            <h4>Word Length</h4>
                            <p>Explanation of word Length (if necessary)</p>
                        </div>
                        <div
                            // className={`${styles.singular_setting_toggler} ${
                            //     isApiAvailable.isWordApiAvailable ? "" : styles.singular_setting_toggler_disabled
                            // }`}
                        >
                            {/* Toggler */}
                            <button >+</button>
                          
                            <button>-</button>
                        </div>
                    </div>
                    <div className={styles.singular_setting_container}>
                        <div className={styles.singular_setting_text}>
                            <h4>Stage Number</h4>
                            <p>Explanation of Stage Number (if necessary)</p>
                        </div>
                        <div className={styles.singular_setting_toggler}>
                            {/* Toggler */}
                            <button>+</button>
                            
                            <button>-</button>
                        </div>
                    </div>
                    <div className={styles.singular_setting_container}>
                        <div className={styles.singular_setting_text}>
                            <h4>Hard Mode</h4>
                            <p>Any revealed hint letters must be used in subsequent guesses</p>
                        </div>
                        <div className={styles.singular_setting_toggler}>
                            {/* Toggler */}
                            <button >Toggle</button>
                        </div>
                    </div>
                </div>
                <div className={styles.settings_popup_reset_button_container}>
                    <button >
                        Restart Game
                    </button>
                </div>

                <button className={styles.help_popup_exit_button} onClick={(e) => toggleIsPopUpOpen(e, "help")}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                {/* TODO: Maybe add an area of notification to the right of the restart button when a gameSetting is different from the currentGameSetting (being used in the current game).
            This notification area should say "Restart game to apply New Settings" */}
            </div>
        </div>
        ) : 
        <div className={styles.help_pop_up_hidden}/>
    );  
}