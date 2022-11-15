import React, { useEffect, useRef, useState } from "react";

import styles from "./ExtraMenu.module.scss";
import FooterDescription from "../FooterDescription/FooterDescription";

interface PropTypes {
    isExtraMenuOpen: boolean;
    toggleIsPopUpOpen: (event: React.MouseEvent, popUpName: string) => void;
}

export default function ExtraMenu({ isExtraMenuOpen, toggleIsPopUpOpen }: PropTypes) {
    const [isRender, setIsRender] = useState<boolean>(isExtraMenuOpen);

    useEffect(() => {
        if (isExtraMenuOpen) setIsRender(true);
    }, [isExtraMenuOpen]);

    const extramenuPopupContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkClickToExitExtramenu = (event: any) => {
            if (isExtraMenuOpen) {
                if (extramenuPopupContainerRef.current && !extramenuPopupContainerRef.current?.contains(event.target)) {
                    toggleIsPopUpOpen(event, "extramenu");
                }
            }
        };

        window.addEventListener("click", checkClickToExitExtramenu);

        return () => {
            window.removeEventListener("click", checkClickToExitExtramenu);
        };
    }, [isExtraMenuOpen, toggleIsPopUpOpen]);

    function handleAnimationEnd() {
        if (!isExtraMenuOpen) setIsRender(false);
    }

    return isRender ? (
        <div className={styles.extramenu_pop_up_wrapper}>
            <div
                ref={extramenuPopupContainerRef}
                className={`${styles.extramenu_popup_container} ${
                    isExtraMenuOpen ? "" : styles.extramenu_popup_container_hide
                }`}
                onAnimationEnd={handleAnimationEnd}
            >
                <div className={styles.extramenu_popup_games}>
                    <div className={styles.extramenu_popup_games_item}>
                        <h6>Check the original game</h6>
                        <div className={styles.games_item_clickable}>
                            <div className={styles.games_item_icon_container}>
                                <i className="fa-solid fa-table-cells"></i>
                            </div>
                            <p>Wordle</p>
                        </div>
                    </div>
                    <div className={styles.extramenu_popup_games_item}>
                        <h6>More from Me</h6>
                        <div className={styles.games_item_clickable}>
                            <div className={styles.games_item_icon_container}>
                                <i className="fa-solid fa-award"></i>
                            </div>
                            <p>Trivia Challenge</p>
                        </div>
                    </div>
                </div>

                <div className={styles.extramenu_popup_footer_content}>
                    <FooterDescription />
                </div>

                <button
                    className={styles.extramenu_popup_exit_button}
                    onClick={(e) => toggleIsPopUpOpen(e, "extramenu")}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    ) : (
        <div className={styles.extramenu_pop_up_hidden} />
    );
}
