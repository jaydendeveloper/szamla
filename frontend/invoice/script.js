import { calculateNetPrice, stornoInvoice } from "../invoiceActions.js";

document.addEventListener("DOMContentLoaded", function () {
	const invoiceTitle = document.getElementById("invoice-title");
	const invoiceCreated = document.getElementById("invoice-created");
	const invoiceChanged = document.getElementById("invoice-changed");
	const issuerName = document.getElementById("invoice-issuer-name");
	const issuerAddress = document.getElementById("invoice-issuer-address");
	const issuerTaxNumber = document.getElementById("invoice-issuer-tax-id");
	const receipentName = document.getElementById("invoice-receipent-name");
	const receipentAddress = document.getElementById("invoice-receipent-address");
	const receipentTaxNumber = document.getElementById("invoice-receipent-tax-id");
	const invoicePayDate = document.getElementById("invoice-pay-date");
	const invoiceNetPrice = document.getElementById("invoice-net-price");
	const invoiceVAT = document.getElementById("invoice-vat");
	const invoiceEndPrice = document.getElementById("invoice-end-price");
/* 	const deleteButton = document.getElementById("delete-button");
 */	const stornoButton = document.getElementById("storno-button");
	const stornoWithNewInvoiceButton = document.getElementById("storno-with-new-invoice-button");
	stornoWithNewInvoiceButton.addEventListener("click", redirectToStorno);
	stornoButton.addEventListener("click", stornoInvoice)
/* 	deleteButton.addEventListener("click", deleteInvoice);
 */
	const url = new URL(window.location.href);
	const invoiceId = url.searchParams.get("id");

	if (!invoiceId) {
		alert("Invoice ID not found in URL.");
		window.location.href = "/frontend";
		return;
	}
	const dateOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		day: "2-digit",
	};

	fetch(`http://localhost:5000/invoice/${invoiceId}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			console.log(data);
			const issueDate = new Date(data.issueDate).toLocaleDateString("hu-HU", dateOptions);
			const changeDate = new Date(data.changeDate).toLocaleDateString("hu-HU", dateOptions);
			const issuerData = JSON.parse(data.issuerData);
			const receipentData = JSON.parse(data.receipentData);			
			invoiceTitle.textContent = "Számla:" + data.id + " " + (data.storno ? "(Sztornózva)" : "");
			invoiceCreated.textContent = "Teljesítés dátuma: " + issueDate;
			issuerName.textContent = issuerData.name;
			issuerAddress.textContent = "Cím: " + issuerData.address;
			issuerTaxNumber.textContent = "Adószám: " +issuerData.taxId;
			receipentName.textContent = receipentData.name;
			receipentAddress.textContent = "Cím: " + receipentData.address;
			receipentTaxNumber.textContent = "Adószám: " + receipentData.taxId;
			invoicePayDate.textContent = "Fizetési határidő: " + new Date(data.payDate).toLocaleDateString("hu-HU", dateOptions);
			invoiceNetPrice.textContent = "Nettó ár: " + calculateNetPrice(data.endPrice, data.VAT);
			invoiceVAT .textContent = "ÁFA: " + data.VAT + "%";
			invoiceEndPrice.textContent = "Végösszeg: " + data.endPrice.toLocaleString("hu-HU", { style: "currency", currency: "HUF" });
			document.title = " Invoicer | Számla: " + data.id;
		})
		.catch((error) => {
			console.error("Error fetching invoice data:", error);
		});
});

function redirectToStorno() {
	const url = new URL(window.location.href);
	const invoiceId = url.searchParams.get("id");
	if (!invoiceId) {
		alert("Invoice ID not found in URL.");
		return;
	}
	window.location.href = `/frontend/storno/index.html?id=${invoiceId}`;
}
