const express = require('express');
// CHANGE 1: Use puppeteer-core instead of puppeteer
const puppeteer = require('puppeteer-core'); 
const app = express();
const port = process.env.PORT || 3000; 

// Middleware to parse JSON bodies
app.use(express.json());

// Set up executable path based on environment
const IS_PROD = process.env.NODE_ENV === 'production' || process.env.RENDER;

// CHANGE 2: Define a fallback path for the Chromium executable
const EXECUTABLE_PATH = IS_PROD
    // Common path on Linux environments configured with a buildpack
    ? '/usr/bin/chromium-browser' 
    // Fallback for local testing (uses the default path found by puppeteer-core)
    : puppeteer.executablePath(); 

/**
 * PDF Generation Endpoint
 * Receives a public URL via POST, generates a PDF, and returns the file.
 */
app.post('/generate-pdf', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send({ error: 'URL parameter is required in the request body.' });
    }

    let browser;
    try {
        console.log(`[INFO] Starting PDF generation for: ${url}`);
        
        // CHANGE 3: Apply production-specific launch arguments
        const launchOptions = {
            headless: 'new',
            executablePath: EXECUTABLE_PATH,
            // These arguments are CRITICAL for running in a serverless/container environment
            args: IS_PROD ? [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--single-process', // Important for memory constrained environments
                '--no-zygote'
            ] : []
        };
        
        browser = await puppeteer.launch(launchOptions); 
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, 
            margin: { 
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in',
            }
        });
        
        console.log(`[INFO] PDF generated successfully. Size: ${pdfBuffer.length} bytes`);

        // Return the PDF file via the API
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
            details: error.message 
        });

    } finally {
        if (browser) {
            await browser.close();
            console.log('[INFO] Browser closed.');
        }
    }
});

app.listen(port, () => {
    console.log(`PDF Worker API listening on http://localhost:${port}`);
});
