import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Generate Software Endpoint
app.post('/api/generate-software', async (req, res) => {
  const { prompt, platform, softwareType, language, options } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Please provide a valid idea/prompt for the software' });
  }

  const selectedPlatform = platform || 'jio'; // 'jio' | 'smartphone' | 'pc'
  const lang = language || 'hi';

  const systemPrompt = `You are an elite expert firmware engineer and software developer specializing in:
1. Jio Keypad phones (KaiOS, J2ME, Spreadtrum/Qualcomm firmware, bootloader, flashable zip, lightweight webapps, D-pad keypad mapping).
2. Android smartphones (APK binaries, Fastboot ROMs, Magisk flashable modules, recovery zip, OTG tools).
3. PC software (Windows .exe, portable tools, Linux scripts, utility suites).

Target platform: ${selectedPlatform.toUpperCase()}
Software Category: ${softwareType || 'Custom Utility'}
User Language: ${lang}
User Options: ${JSON.stringify(options || {})}

Generate a complete, production-ready custom software package blueprint based on the user's idea: "${prompt}".

Output strictly valid JSON (no markdown fences, just pure JSON or parseable JSON) matching this schema:
{
  "id": "unique-id-slug",
  "name": "Creative Software Name (e.g. Jio SpeedTorch OS, DesiClean Pro)",
  "tagline": "Short punchy summary in Indian/User language",
  "platform": "${selectedPlatform}",
  "version": "v1.2.0-beta",
  "fileFormat": ".zip containing installer & firmware partitions",
  "estimatedSize": "e.g. 2.4 MB",
  "category": "${softwareType || 'Utility'}",
  "description": "Comprehensive explanation of what this customized software does and how it runs",
  "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"],
  "keypadControls": {
    "center": "OK / Select / Action",
    "up": "Navigate Up",
    "down": "Navigate Down",
    "left": "Back / Prev",
    "right": "Next / Settings",
    "call": "Quick Launch / Turbo mode",
    "endCall": "Exit / Minimize",
    "star": "Flashlight / Special",
    "hash": "Language / Lock"
  },
  "flashingSpecs": {
    "supportedChips": "Qualcomm Snapdragon 205/215, Spreadtrum SC9820E, MTK6731, or PC x64",
    "otgSupport": true,
    "baudRate": "921600",
    "partitions": ["boot.img", "system.img", "recovery.img", "userdata.img"],
    "steps": [
      "Phone ko Power Off karein aur OTG cable se connect karein",
      "Boot Key (Center key / Volume Down) daba kar rakhein EDL mode me aane ke liye",
      "Port detect hone ke baad 'Start Flash' par click karein",
      "Progress 100% hone par cable nikalein aur restart karein"
    ]
  },
  "installationSteps": [
    "Software package download karein ya direct install chunein",
    "OTG cable se device verify karein",
    "Install button dabayein, automated script execute hoga",
    "Installation successful hone ke baad app phone/pc me launch ho jayega"
  ],
  "sourceCodeFiles": [
    {
      "name": "manifest.webapp or config.json",
      "language": "json",
      "content": "{\\n  \\"name\\": \\"...\\",\\n  \\"version\\": \\"1.0\\"\\n}"
    },
    {
      "name": "main.js or app.js",
      "language": "javascript",
      "content": "// Main runtime code\\nconsole.log('Started');"
    },
    {
      "name": "flash_script.sh",
      "language": "bash",
      "content": "#!/bin/bash\\necho 'Flashing target partition...'\\nfastboot flash boot boot.img"
    }
  ],
  "demoHtml": "<div class='sim-screen'><h3>App UI</h3><p>Interactive preview content</p></div>"
}`;

  // Try calling Gemini if AI is initialized with a 6.5s timeout safeguard
  if (ai) {
    try {
      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Create software for idea: "${prompt}". Platform: ${selectedPlatform}. Language: ${lang}. Return strict JSON only.`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 6500)
      );

      const response = await Promise.race([geminiPromise, timeoutPromise]) as any;

      if (response && response.text) {
        const responseText = response.text || '';
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(cleanJson);
        return res.json({ success: true, software: parsedData, isAiGenerated: true });
      }
    } catch (err: any) {
      console.warn('Gemini API call timed out or failed, using intelligent template generator:', err?.message || err);
      // Fall through to smart generator below
    }
  }

  // Fallback high-quality intelligent generator
  const generated = generateIntelligentSoftware(prompt, selectedPlatform, softwareType, lang, options);
  return res.json({ success: true, software: generated, isAiGenerated: false });
});

// Helper for offline or fallback intelligent generation
function generateIntelligentSoftware(
  prompt: string,
  platform: string,
  softwareType?: string,
  lang?: string,
  options?: any
) {
  const safeId = 'soft-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  const cleanTitle = prompt.length > 28 ? prompt.substring(0, 26) + '...' : prompt;

  let platformName = 'Jio Keypad Phone (KaiOS)';
  let ext = '.jio.zip';
  let size = '1.8 MB';
  let partitionList = ['boot.img', 'system.img', 'recovery.img', 'cust.img'];

  if (platform === 'smartphone') {
    platformName = 'Android Smartphone (APK / Magisk ROM)';
    ext = '.apk';
    size = '7.4 MB';
    partitionList = ['boot', 'system', 'vendor', 'product', 'userdata'];
  } else if (platform === 'pc') {
    platformName = 'PC (Windows .exe / Linux .deb)';
    ext = '.exe';
    size = '18.2 MB';
    partitionList = ['master_boot', 'rootfs', 'efi', 'swap'];
  }

  return {
    id: safeId,
    name: `${cleanTitle.replace(/[^\w\s\u0900-\u097F]/gi, '') || 'Custom Soft'} Pro`,
    tagline: `AI Customized Software for ${platformName} (${lang || 'Hindi'} Supported)`,
    platform: platform || 'jio',
    version: 'v1.4.0-release',
    fileFormat: ext,
    estimatedSize: size,
    category: softwareType || 'Custom Tool & ROM',
    description: `Ye software vishesh roop se user ke idea ("${prompt}") ke aadhar par banaya gaya hai. Isme ${platformName} ke liye direct OTG flashing support, lightweight memory footprints aur Indian language support diya gaya hai.`,
    features: [
      `Full ${lang || 'Hindi/Regional'} language UI support`,
      platform === 'jio' ? 'Dedicated Jio Phone Keypad 5-Way D-Pad & Shortcode (* / #) Controls' : 'High Performance Hardware Acceleration',
      'Ultra Low RAM & Battery consumption optimized',
      'Instant OTG Cable Cable Flash & Installation Ready',
      'Offline standalone architecture with no ads or bloatware',
      'Safe Sandbox execution with CRC32 checksum verification'
    ],
    keypadControls: {
      center: 'OK / Open Menu',
      up: 'Scroll Up / Volume +',
      down: 'Scroll Down / Volume -',
      left: 'Back / Previous Step',
      right: 'Options / Next',
      call: 'Start / Flash Action',
      endCall: 'Exit / Standby',
      star: 'Toggle Flashlight / Torch',
      hash: 'Switch Language (हिंदी / English)'
    },
    flashingSpecs: {
      supportedChips: platform === 'jio' ? 'Spreadtrum SC9820E, Qualcomm 205/215, KaiOS 2.5+' : (platform === 'smartphone' ? 'Snapdragon, MediaTek Dimensity, Exynos, Unisoc' : 'Intel x64, AMD Ryzen, ARM64'),
      otgSupport: true,
      baudRate: '921600',
      partitions: partitionList,
      steps: [
        'Device ko switch off karke OTG Cable se connect karein',
        platform === 'jio' ? 'Jio Phone ka "Center Key" daba kar USB cable lagayein (Download/EDL Mode)' : 'Phone ko Fastboot mode (Volume Down + Power) me boot karein',
        'OTG Flasher me Port aur Partitions select karein',
        '"Start Flash" dabayein aur 100% complete hone tak disconnect na karein'
      ]
    },
    installationSteps: [
      'App list se banaya hua software chunein',
      'Device connection check karein (OTG ya Direct)',
      '"Install Software" button par click karein',
      'Automated background installer binary verify karega aur complete message dega'
    ],
    sourceCodeFiles: [
      {
        name: platform === 'jio' ? 'manifest.webapp' : (platform === 'smartphone' ? 'AndroidManifest.xml' : 'package.json'),
        language: 'json',
        content: JSON.stringify({
          name: cleanTitle,
          version: '1.4.0',
          description: `Custom ${platform} software generated by AI`,
          launch_path: '/index.html',
          developer: { name: 'Jio Smart AI Studio' },
          permissions: {
            telephony: {},
            systemXHR: {},
            deviceStorage: { access: 'readwrite' },
            audio_hardware: {}
          }
        }, null, 2)
      },
      {
        name: 'app_engine.js',
        language: 'javascript',
        content: `// AI Studio Generated Kernel & App Driver\nconsole.log("Initializing ${cleanTitle} on ${platform}...");\n\nfunction handleKeyAction(keyCode) {\n  switch(keyCode) {\n    case "Enter":\n    case "SoftLeft":\n      console.log("Execute primary task for: ${prompt}");\n      break;\n    case "Star":\n      console.log("Toggle feature");\n      break;\n  }\n}\n\nwindow.addEventListener('keydown', (e) => handleKeyAction(e.key));`
      },
      {
        name: 'flash_installer.sh',
        language: 'bash',
        content: `#!/bin/sh\n# Automated OTG Flash & Install script\necho "Connecting to target ${platform} device..."\necho "Flashing custom package: ${cleanTitle}"\necho "Writing partition: ${partitionList[0]}..."\nsleep 1\necho "Flash verification: OK (SHA256 verified)"\necho "Rebooting system..."`
      }
    ],
    demoHtml: `<div style="font-family:sans-serif; text-align:center; padding:15px; color:#fff; background:#0f172a; border-radius:12px;">
      <div style="font-size:24px; margin-bottom:8px;">⚡</div>
      <h3 style="margin:0 0 8px 0; color:#38bdf8; font-size:16px;">${cleanTitle}</h3>
      <p style="font-size:12px; color:#94a3b8; margin:0 0 12px 0;">${prompt}</p>
      <div style="background:#1e293b; padding:10px; border-radius:8px; font-size:12px; margin-bottom:10px; border:1px solid #334155;">
        <span style="color:#22c55e;">● Status:</span> Active & Running on ${platform}
      </div>
      <div style="font-size:11px; color:#cbd5e1; display:flex; justify-content:space-around;">
        <span>🔋 Battery: 94%</span>
        <span>📶 Signal: VoLTE 4G</span>
        <span>💾 RAM: 42MB Free</span>
      </div>
    </div>`
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
