import { ApiError } from './api-error';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Prompt template
const SYSTEM_PROMPT = `
You are a laptop specification normalization expert. 
Your task is to take a raw string of laptop specs and normalize it into structured JSON.
Return ONLY the JSON object, no markdown, no comments.
The JSON structure must match this interface:
{
  cpuBrand: "Intel" | "AMD" | "Apple" | "Qualcomm",
  cpuModel: string, (e.g., "Core i7-13700H", "M3 Pro", "Ryzen 7 7840HS"),
  gpuBrand: "NVIDIA" | "AMD" | "Intel" | "Apple" | "None",
  gpuModel: string, (e.g., "RTX 4070", "Radeon 780M"),
  ramGb: number,
  ramType: string, (e.g., "DDR5", "LPDDR5"),
  storageGb: number,
  storageType: "SSD" | "HDD" | "eMMC",
  storageInterface: "NVMe" | "SATA" | null,
  screenSize: number, (decimal, e.g. 14.0, 15.6),
  screenRes: string, (e.g. "2560x1600"),
  displayType: "IPS" | "OLED" | "TN" | "Mini-LED" | "LCD",
  refreshRate: number, (Hz, default 60),
  touchscreen: boolean,
  os: "Windows" | "macOS" | "ChromeOS" | "Linux" | "None"
}
If a field cannot be determined, use null.
`;

export async function normalizeSpecs(rawSpecs: string): Promise<any> {
    if (!GEMINI_API_KEY) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('GEMINI_API_KEY is not set. Skipping spec normalization.');
        }
        return null;
    }

    try {
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: SYSTEM_PROMPT },
                            { text: `Raw Specs: ${rawSpecs}` }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.1, // Low temp for deterministic output
                    responseMimeType: "application/json"
                }
            }),
        });

        if (!response.ok) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Gemini API Error:', await response.text());
            }
            return null;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) return null;

        try {
            return JSON.parse(text);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Failed to parse Gemini JSON:', text);
            }
            return null;
        }

    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Spec normalization failed:', error);
        }
        return null;
    }
}
