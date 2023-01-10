import cx from "classnames";
import { ComponentProps, FC } from "react";
import { AppMenu } from "./Menu/AppMenu";
import styles from "./Title.module.css";

export const Title = () => {
    return (
        <div className={cx(styles.title, styles.draggable, "flex justify-start items-center ")}>
            <AppMenu className={styles.nonDraggable} />
        </div>
    );
};

export const ContentWrapper: FC<ComponentProps<"div">> = ({ className, ...other }) => {
    return <div className={cx(styles.content, className)} {...other} />;
};
