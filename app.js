import cors from "cors";
import express, { json } from "express";
import { db } from "./db.js";

const app = express();
app.use(cors());

app.use(json());

const PORT = 5000;

app.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
});

app.get("/invoices", async (req, res) => {
	const invoices = db.prepare("SELECT * FROM invoices").all();

	console.log(invoices);

	res.send(invoices || []);
});

app.get("/invoice/:id", async (req, res) => {
	const { id } = req.params;

	const invoices = db.prepare("SELECT * FROM invoices WHERE id = ?").get(id);

	if (!invoices) {
		return res.status(404).json({ error: "Invoice not found" });
	}

	res.send(invoices);
});

app.post("/invoice", async (req, res) => {
	const { 
		issuerName, issuerAddress, issuerTaxId,
		receipentName, receipentAddress, receipentTaxId, 
		payDate, endPrice, VAT 
	} = req.body;

	console.log(req.body);

	if (!issuerName || !issuerAddress || !issuerTaxId || !receipentName || !receipentAddress || !receipentTaxId || !payDate || !endPrice || !VAT) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	const date = new Date();

	const issuerData = JSON.stringify({
		name: issuerName,
		address: issuerAddress,
		taxId: issuerTaxId
	})
	const receipentData = JSON.stringify({
		name: receipentName,
		address: receipentAddress,
		taxId: receipentTaxId
	})

	db.prepare(
		"INSERT INTO invoices (issuerData, receipentData, issueDate, changeDate, payDate, endPrice, VAT, storno) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
	).run(
		issuerData,
		receipentData,
		date.toISOString(),
		date.toISOString(),
		payDate,
		endPrice,
		VAT,
		0
	);
});

app.delete("/invoice/:id", async (req, res) => {
	const { id } = req.params;

	const invoice = db.prepare("SELECT * FROM invoices WHERE id = ?").get(id);

	if (!invoice) {
		return res.status(404).json({ error: "Invoice not found" });
	}

	db.prepare("DELETE FROM invoices WHERE id = ?").run(id);

	res.status(204).send();
});

app.put("/invoice/:id", async (req, res) => {
	const { id } = req.params;
	const { storno } = req.body;

	const invoice = db.prepare("SELECT * FROM invoices WHERE id = ?").get(id);

	if (!invoice) {
		return res.status(404).json({ error: "Invoice not found" });
	}

	const date = new Date();

	db.prepare(
		"UPDATE invoices SET storno = ? WHERE id = ?"
	).run(storno, id);

	res.status(204).send();
});
