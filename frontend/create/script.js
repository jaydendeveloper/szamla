import { createInvoice } from "../invoiceActions.js";

const form = document.querySelector(".form");

form.addEventListener("submit", async (e) => {
	e.preventDefault();
	createInvoice(form);
});
