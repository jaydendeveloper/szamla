function renderInvoice(invoice) {
	const date = new Date(invoice.issueDate);
	const options = { year: "numeric", month: "long", day: "numeric" };
	invoice.issueDate = date.toLocaleDateString("hu-HU", options);

	return `
     <div class="invoice">
            <div class="title-container">
                <h1>Számla: ${invoice.id} - ${invoice.issueDate}</h1>
                <div>${invoice.createdAt}</div>
            </div>

            <div class="card-footer">
                <a href="./invoice/index.html?id=${invoice.id}"><button>Megtekintés</button></a>
            </div>
     </div>
    `;
}

async function getInvoices() {
	const res = await fetch("http://localhost:5000/invoices");

	if (!res.ok) {
		const error = await res.json();
		console.error(error);
		return;
	}

	const invoices = await res.json();
	console.log(invoices);
	return invoices.reverse();
}

async function renderInvoices(invoices) {
	const blogContainer = document.querySelector(".invoices");
	blogContainer.innerHTML = "";

	invoices.forEach((invoice) => {
		const invoiceHTML = renderInvoice(invoice);
		blogContainer.innerHTML += invoiceHTML;
	});
}

(async function initialize() {
	const invoices = await getInvoices();
	renderInvoices(invoices);
})();
