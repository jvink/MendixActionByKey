import { createElement, useEffect, Fragment, ReactElement } from "react";
import { ActionByKeyContainerProps } from "../../typings/ActionByKeyProps";

const ActionByKeyComponent = ({
    keys,
    focusField,
    focusFieldLast,
    focusNextField,
    onlyRunField,
    onNoNext,
    onPressKey
}: ActionByKeyContainerProps): ReactElement => {
    const keyArray = keys ? (keys.value ? keys.value.split(" ") : []) : [];

    useEffect(() => {
        document.addEventListener("keydown", isKeyCode, false);

        return () => {
            document.removeEventListener("keydown", isKeyCode, false);
        };
    }, [onPressKey && onPressKey.canExecute, onNoNext && onNoNext.canExecute]);

    const doPressKey = (event: KeyboardEvent): void => {
        if (onPressKey && onPressKey.canExecute && !onPressKey.isExecuting) {
            onPressKey.execute();
        }

        if (focusNextField) {
            const triggerElement = document.activeElement as HTMLInputElement;
            const wrappers = document.getElementsByTagName("input");
            const arr = [].slice.call(wrappers);

            arr.forEach((element, index) => {
                if (triggerElement === element) {
                    const nextElement = wrappers[index + 1];

                    if (nextElement) {
                        event.preventDefault();
                        nextElement.focus();
                    } else {
                        event.preventDefault();

                        if (onNoNext && onNoNext.canExecute && !onNoNext.isExecuting) {
                            onNoNext.execute();
                        }
                    }
                }
            });
        } else {
            if (focusField && focusField.value) {
                const wrappers = document.getElementsByClassName(`${focusField && focusField.value}`);
                const wrapperLength = wrappers.length;
                const wrapper = wrappers[focusFieldLast ? wrapperLength - 1 : 0];
                const div = wrapper && wrapper.lastChild;
                const input = div && (div.firstChild as HTMLInputElement);

                if (onlyRunField && onlyRunField.value && input) {
                    const triggerElement = document.activeElement as HTMLInputElement;

                    if (
                        triggerElement.parentElement &&
                        triggerElement.parentElement.parentElement &&
                        triggerElement.parentElement.parentElement.classList.contains(onlyRunField.value)
                    ) {
                        input.focus();
                        event.preventDefault();
                    }
                } else if (onlyRunField && !onlyRunField.value && input) {
                    input.focus();
                    event.preventDefault();
                }
            }
        }
    };

    const isKeyCode = (event: KeyboardEvent): void => {
        keyArray.map(key => event.keyCode === Number(key) && doPressKey(event));
    };

    return <Fragment />;
};

export default ActionByKeyComponent;
