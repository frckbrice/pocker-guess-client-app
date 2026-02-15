import { Id, toast, ToastOptions } from "react-toastify";

const baseToastOptions: ToastOptions = {
    position: "top-right",
    hideProgressBar: true,
    autoClose: 3000,
};

const shouldSkipToast = (toastId?: Id) => {
    if (!toastId) return false;
    return toast.isActive(toastId);
};

export const notifySuccess = (
    message: string,
    options: ToastOptions = {},
    toastId?: Id
) => {
    if (shouldSkipToast(toastId)) return;

    toast.success(message, {
        ...baseToastOptions,
        ...options,
        toastId,
    });
};

export const notifyError = (
    message: string,
    options: ToastOptions = {},
    toastId?: Id
) => {
    if (shouldSkipToast(toastId)) return;

    toast.error(message, {
        ...baseToastOptions,
        ...options,
        toastId,
    });
};
