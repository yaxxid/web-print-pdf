const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
// You can set the port using an environment variable in production
const port = process.env.PORT || 3000; 

// Middleware to parse JSON bodies from the client request
app.use(express.json());

/**
 * PDF Generation Endpoint
 * Receives a public URL via POST, generates a PDF, and returns the file.
 * Expects the request body to contain { "url": "..." }
 */
app.post('/generate-pdf', async (req, res) => {
    // 1. Get the public URL from the request body
    const { url } = req.body;

    if (!url) {
        return res.status(400).send({ error: 'URL parameter is required in the request body.' });
    }

    let browser;
    try {
        console.log(`[INFO] Starting PDF generation for: ${url}`);
        
        // 2. Launch a Headless Chrome instance
        // 'new' mode is the modern, faster, and more efficient default.
        browser = await puppeteer.launch({ headless: 'new' }); 
        const page = await browser.newPage();

        // 3. Navigate to the URL and wait for the page to be fully loaded
        // 'networkidle0' is a reliable setting to ensure all assets are loaded.
        await page.goto(url, { waitUntil: 'networkidle0' });

        // 4. Generate the PDF file content as a Buffer
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // Ensure background colors/images are included
            margin: { // Recommended margins for a clean print
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in',
            }
        });
        
        console.log(`[INFO] PDF generated successfully. Size: ${pdfBuffer.length} bytes`);

        // 5. Return the PDF file via the API
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="invoice.pdf"', 
            'Content-Length': pdfBuffer.length
        });
        res.send(pdfBuffer);

    } catch (error) {
        console.error(`[ERROR] PDF Generation Failed: ${error.message}`);
        res.status(500).send({ 
            error: 'Failed to generate PDF. Check the URL or server logs.',
            // Include error detail only for debugging; remove for high-security production
            details: error.message 
        });

    } finally {
        // 6. Ensure the browser instance is always closed
        if (browser) {
            await browser.close();
            console.log('[INFO] Browser closed.');
        }
    }
});

app.listen(port, () => {
    console.log(`PDF Worker API listening on http://localhost:${port}`);
});
