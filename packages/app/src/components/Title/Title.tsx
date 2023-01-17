import cx from "classnames";
import { ComponentProps, FC } from "react";
import { MainMenu, MainMenuProps } from "./MainMenu/MainMenu";
import styles from "./Title.module.css";

const menuItemProps: MainMenuProps["ItemProps"] = {
    className: styles.noDraggable,
};

export const Title = () => {
    return (
        <div className={cx(styles.title, styles.noDraggable, "flex items-center ")}>
            <div className={cx(styles.draggableRegion, styles.draggable, "z-0")} />
            <MainMenu TargetProps={menuItemProps} className={cx("flex-grow z-10")} />
        </div>
    );
};

export const ContentWrapper: FC<ComponentProps<"div">> = ({ className, ...other }) => {
    return <div className={cx(styles.content, className)} {...other} />;
};
