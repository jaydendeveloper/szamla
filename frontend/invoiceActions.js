export function calculateNetPrice(price, VAT){
	return ((price * 100) / (100 + VAT)).toLocaleString("hu-HU", { style: "currency", currency: "HUF" });
}

export async function createInvoice(form) {
	const formData = new FormData(form);
	const data = Object.fromEntries(formData.entries());
	const date = new Date();
	const payDate = new Date(data.payDate);

	if (payDate - date > 30 * 24 * 60 * 60 * 1000) {
		alert("A fizetési határidő nem lehet több mint 30 nap!");
		return;
	}

	const res = await fetch("http://localhost:5000/invoice", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const error = await res.json();
		console.error(error);
		return;
	}
	window.location.href = "/frontend";
}

export async function deleteInvoice() {
	const url = new URL(window.location.href);
	const id = url.searchParams.get("id");

	if (
		!confirm(
			"Biztos benne, hogy törölni szeretné a számlát? Ez a művelet nem visszavonható!"
		)
	) {
		return;
	}

	if (!id) {
		alert("Invoice ID not found");
		return;
	}

	const res = await fetch(`http://localhost:5000/invoice/${id}`, {
		method: "DELETE",
	});

	if (!res.ok) {
		const error = await res.json();
		console.error(error);
		return;
	}

	window.location.href = "/frontend";
}

export async function stornoWithNewInvoice() 
{
	const url = new URL(window.location.href);
	const id = url.searchParams.get("id");

	if (!id) {
		alert("Invoice ID not found");
		return;
	}

	const form = document.querySelector(".form");
	
	const res = await fetch("http://localhost:5000/invoice/" + id, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			storno: 1,
		}),
	});

	if (!res.ok) {
		const error = await res.json();
		console.error(error);
		alert("Hiba történt a számla frissítésekor: " + error.message);
		return;
	}

	createInvoice(form);
};

export async function stornoInvoice() {
	const url = new URL(window.location.href);
	const id = url.searchParams.get("id");

	if (!id) {
		alert("Invoice ID not found");
		return;
	}

	const res = await fetch("http://localhost:5000/invoice/" + id, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			storno: 1,
		}),
	});

	if (!res.ok) {
		const error = await res.json();
		console.error(error);
		alert("Hiba történt a számla frissítésekor: " + error.message);
		return;
	}

	window.location.href = "/frontend/invoice/index.html?id=" + id;
}
