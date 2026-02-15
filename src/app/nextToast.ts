"use client";
import { createElement } from "react";
import { ToastContainer as ReactToastContainer } from "react-toastify";

export const ToastContainer = () =>
	createElement(ReactToastContainer, {
		newestOnTop: true,
		closeOnClick: true,
		pauseOnFocusLoss: false,
		pauseOnHover: true,
		limit: 3,
	});
