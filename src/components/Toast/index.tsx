import { Bounce, toast } from "react-toastify";

export const Toast = (
    type: 'success' | 'error',
    message: string,
    onCloseCallback?: () => void // Optional callback function
): void => {
    const toastType = type === 'success' ? toast.success : toast.error;

    toastType(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        onClose: () => {
            if (onCloseCallback) {
                onCloseCallback();
            }
        },
    });
};