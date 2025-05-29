import { editInvoice } from "../invoiceActions.js";

const form = document.querySelector(".form");

document.addEventListener("DOMContentLoaded", function () {
	const url = new URL(window.location.href);
	const invoiceId = url.searchParams.get("id");

	if (!invoiceId) {
		alert("Invoice ID not found in URL.");
		window.location.href = "/frontend";
		return;
	}

	fetch(`http://localhost:5000/invoice/${invoiceId}`)
		.then((response) => {
			if (!response.ok) {
				alert("Ez a számla nem található.");
				window.location.href = "/frontend";
			}
			return response.json();
		})
		.then((data) => {
			form["title"].value = data.title;
			form["author"].value = data.author;
			form["content"].value = data.content;
			form["category"].value = data.category;
		})
		.catch((error) => {
			console.error("Error fetching invoice data:", error);
		});
});

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	editBlog();
});
