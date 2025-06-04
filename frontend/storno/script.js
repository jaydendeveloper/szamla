import { stornoWithNewInvoice } from "../invoiceActions.js";

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
			const issuerData = JSON.parse(data.issuerData);
			const receipentData = JSON.parse(data.receipentData);
			form["issuerName"].value = issuerData.name;
			form["issuerAddress"].value = issuerData.address;
			form["issuerTaxId"].value = issuerData.taxId;
			form["receipentName"].value = receipentData.name;
			form["receipentAddress"].value = receipentData.address;
			form["receipentTaxId"].value = receipentData.taxId;
			form["payDate"].value = data.payDate;
			form["endPrice"].value = data.endPrice;
			form["VAT"].value = data.VAT;
		})
		.catch((error) => {
			console.error("Error fetching invoice data:", error);
		});
});

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	stornoWithNewInvoice();
});
