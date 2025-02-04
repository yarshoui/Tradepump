import express from "express";
import fetch from "node-fetch";
import crypto from "crypto";
import cors from "cors";
const app = express();
const port = 3006;
const api_key = "";
const passphrase = "";
const secret = "";

app.use(cors());

app.get("/kucoinapifutures", async (req, res) => {
    try {
        const now = Date.now().toString();
        const method = "GET";
        const endpoint = "/api/v1/allTickers";
        const baseUrl = "https://api-futures.kucoin.com";
        
        const prehash = now + method + endpoint;
        const signature = crypto.createHmac("sha256", secret).update(prehash).digest("base64");
        
        const headers = {
            "KC-API-KEY-VERSION": "2",
            "KC-API-SIGN": signature,
            "KC-API-TIMESTAMP": now,
            "KC-API-KEY": api_key,
            "KC-API-PASSPHRASE": passphrase,
            "Content-Type": "application/json"
        };
        
        const response = await fetch(`${baseUrl}${endpoint}`, { headers });
        const data = await response.json();
        
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        
        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
