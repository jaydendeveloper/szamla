export async function createInvoice(form) {
	const formData = new FormData(form);
	const data = Object.fromEntries(formData.entries());

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

export async function editInvoice() {
	const url = new URL(window.location.href);
	const id = url.searchParams.get("id");

	if (!id) {
		alert("Invoice ID not found");
		return;
	}

	const form = document.querySelector(".form");
	const formData = new FormData(form);
	const data = Object.fromEntries(formData.entries());

	const res = await fetch("http://localhost:5000/invoice/" + id, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const error = await res.json();
		console.error(error);
		alert("Hiba történt a számla frissítésekor: " + error.message);
		return;
	}

	window.location.href = "/frontend/invoice/index.html?id=" + id;
}
