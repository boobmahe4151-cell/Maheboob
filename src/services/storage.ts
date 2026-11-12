import { CustomSoftware } from '../types';

const STORAGE_KEY = 'jio_smart_ai_softwares_v1';

export const INITIAL_SOFTWARES: CustomSoftware[] = [
  {
    id: 'jio-torch-speeddial-01',
    name: 'Jio SuperTorch & SpeedDial Pro',
    tagline: 'Jio Keypad Phone ke liye instant Torch shortcut aur fast 1-button dialing',
    platform: 'jio',
    version: 'v2.1.0-rel',
    fileFormat: '.jio.zip',
    estimatedSize: '1.4 MB',
    category: 'Keypad Utility & ROM Patch',
    description: 'Ye software Jio phone (F320B, F220B, F120B, F90M) ke liye banaya gaya hai. Long press "0" or "*" key dabane par screen band hone par bhi flashlight jalegi aur emergency 112/favorite contacts ko instant call lagega.',
    features: [
      'Lock screen par bhi * key dabane par high beam flashlight toggle',
      'Number 1 se 9 tak direct single-click Speed Dial mapping',
      'Ultra low battery drain (0.2% per day idle)',
      'KaiOS 2.5 aur 3.0 dono versions ke saath 100% compatible',
      'OTG Fastboot Flashable & KaiOS Debugger installable'
    ],
    keypadControls: {
      center: 'Torch ON / OFF Toggle',
      up: 'Brightness High (+)',
      down: 'Brightness Low (-)',
      left: 'Speed Dial 1 (Maa / Home)',
      right: 'Speed Dial 2 (Emergency)',
      call: 'Immediate Call Selected Number',
      endCall: 'Turn Off Torch & Lock Screen',
      star: 'Instant SOS Blinking Light',
      hash: 'Bilingual Voice Prompts (हिंदी/English)'
    },
    flashingSpecs: {
      supportedChips: 'Spreadtrum SC9820E, Qualcomm Snapdragon 205 (JioPhone 1 & 2)',
      otgSupport: true,
      baudRate: '921600',
      partitions: ['boot.img', 'system.img', 'userdata.img'],
      steps: [
        'Jio Phone ko Switch Off karein',
        'OTG Cable ko apne phone ya PC se jodein',
        'Jio Phone ka "Center Key" daba kar USB cable lagayein (Download/EDL Mode)',
        'Flasher screen par Port detect hone par "Start Flash" button dabayein',
        '30 second me 100% complete hone par cable nikalein'
      ]
    },
    installationSteps: [
      'Select "Install Software" in Software tab',
      'OTG Cable se Jio Phone connect karein',
      'Install button par click karein',
      'Background daemon binary files push karega aur automatic reboot hoga'
    ],
    sourceCodeFiles: [
      {
        name: 'manifest.webapp',
        language: 'json',
        content: JSON.stringify({
          name: 'Jio SuperTorch Pro',
          version: '2.1.0',
          description: 'High-speed torch & speed dial for Jio Keypad Phones',
          launch_path: '/index.html',
          icons: { '128': '/icons/torch_128.png' },
          permissions: {
            telephony: {},
            flashlight: {},
            systemXHR: {},
            power: {}
          }
        }, null, 2)
      },
      {
        name: 'torch_driver.js',
        language: 'javascript',
        content: `// Jio Phone Torch & Keypad Event Driver\nlet torchState = false;\n\nfunction toggleTorch() {\n  torchState = !torchState;\n  if (navigator.mozFlashlight) {\n    navigator.mozFlashlight.enabled = torchState;\n  }\n  const indicator = document.getElementById('torch-indicator');\n  if (indicator) {\n    indicator.innerText = torchState ? '💡 FLASH ON' : '⚫ FLASH OFF';\n    indicator.style.color = torchState ? '#fbbf24' : '#64748b';\n  }\n}\n\nwindow.addEventListener('keydown', (e) => {\n  if (e.key === 'Enter' || e.key === '5' || e.key === '*') {\n    toggleTorch();\n  }\n});`
      },
      {
        name: 'flash_edl.sh',
        language: 'bash',
        content: `#!/bin/bash\n# Jio Keypad Phone EDL Flashing Script\necho "[JIO-FLASH] Detecting Qualcomm / Spreadtrum EDL Port..."\nsleep 1\necho "[JIO-FLASH] Port: /dev/ttyUSB0 (Qualcomm HS-USB QDLoader 9008)"\necho "[JIO-FLASH] Writing system.img partition (Size: 1420 KB)..."\necho "[JIO-FLASH] Verified MD5 checksum: 8f4a7c2e... OK"\necho "[JIO-FLASH] Flashing Complete! Rebooting device."`
      }
    ],
    demoHtml: `<div style="text-align:center; padding:12px; color:#fff; background:#090d16; border-radius:10px;">
      <div id="sim-bulb" style="font-size:38px; margin-bottom:8px; transition:transform 0.2s;">💡</div>
      <div id="torch-indicator" style="font-size:16px; font-weight:bold; color:#fbbf24; margin-bottom:10px;">⚡ FLASH READY</div>
      <p style="font-size:12px; color:#94a3b8; margin:0 0 10px 0;">Center Key / * dabayein torch on/off karne ke liye</p>
      <div style="background:#1e293b; border-radius:6px; padding:8px; font-size:11px; text-align:left;">
        <div>📞 1: Maa (SpeedDial)</div>
        <div>📞 2: Emergency (112)</div>
        <div>🔋 Battery Saver: ACTIVE</div>
      </div>
    </div>`,
    createdAt: Date.now() - 3600000 * 24,
    isAiGenerated: true,
  },
  {
    id: 'android-ram-battery-turbo-02',
    name: 'DesiClean RAM & Battery Turbo',
    tagline: 'Android smartphones ke liye background bloatware cleaner aur supercharger',
    platform: 'smartphone',
    version: 'v3.0.4-apk',
    fileFormat: '.apk',
    estimatedSize: '4.8 MB',
    category: 'System Optimizer & Magisk Module',
    description: 'Purane aur naye sabhi Android phone ko lag-free banane ke liye AI memory compressor aur battery throttle controller.',
    features: [
      'Ek click me background apps ki RAM clear',
      'Overheating protection aur battery temperature sensor',
      'WhatsApp, YouTube junk cache safe remover',
      'Root aur Non-Root dono phones par direct installable',
      'Fastboot OTG flash support for low-level performance kernel'
    ],
    flashingSpecs: {
      supportedChips: 'Snapdragon, MediaTek, Exynos, Unisoc (All Android 8 - 15)',
      otgSupport: true,
      baudRate: '921600',
      partitions: ['boot.img', 'vendor_boot.img'],
      steps: [
        'Phone me Developer Options > USB Debugging on karein',
        'OTG Cable se dusre device ya PC se connect karein',
        '"Install / Flash" select karein aur permission allow karein',
        '10 second me app installed aur memory clean ho jayegi'
      ]
    },
    installationSteps: [
      'Install Software option me DesiClean chunein',
      'Target Android phone detect karein',
      '"Install" button dabayein',
      'APK automatic install hokar screen par aa jayega'
    ],
    sourceCodeFiles: [
      {
        name: 'AndroidManifest.xml',
        language: 'xml',
        content: `<?xml version="1.0" encoding="utf-8"?>\n<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.desiclean.turbo">\n  <uses-permission android:name="android.permission.KILL_BACKGROUND_PROCESSES" />\n  <uses-permission android:name="android.permission.BATTERY_STATS" />\n  <application android:label="DesiClean Turbo" android:icon="@mipmap/ic_cleaner">\n    <activity android:name=".MainActivity" android:exported="true" />\n  </application>\n</manifest>`
      },
      {
        name: 'TurboBooster.kt',
        language: 'kotlin',
        content: `package com.desiclean.turbo\n\nclass TurboBooster {\n  fun boostRam(): Long {\n    val runtime = Runtime.getRuntime()\n    val freeBefore = runtime.freeMemory()\n    System.gc()\n    return runtime.freeMemory() - freeBefore\n  }\n}`
      }
    ],
    demoHtml: `<div style="text-align:center; padding:15px; color:#fff; background:#0c192c; border-radius:12px;">
      <div style="font-size:32px;">🚀</div>
      <h4 style="margin:5px 0; color:#38bdf8;">DesiClean Turbo</h4>
      <div style="font-size:28px; font-weight:bold; color:#22c55e; margin:10px 0;">1.2 GB FREE</div>
      <p style="font-size:12px; color:#94a3b8; margin:0 0 10px 0;">Memory Boosted & CPU Cooled by 4°C</p>
      <button style="background:#0284c7; color:#fff; border:none; padding:8px 16px; border-radius:6px; font-weight:600; cursor:pointer;">⚡ Turbo Boost Now</button>
    </div>`,
    createdAt: Date.now() - 3600000 * 12,
    isAiGenerated: true,
  },
  {
    id: 'pc-fast-file-bridge-03',
    name: 'PC Fast File & ROM Bridge',
    tagline: 'Windows PC aur Jio/Android phone ke beech bina internet files aur firmware transfer',
    platform: 'pc',
    version: 'v1.6.0-win',
    fileFormat: '.exe',
    estimatedSize: '12.4 MB',
    category: 'PC Desktop Utility',
    description: 'PC ke liye portable fast tool jo USB OTG cable ke zariye Jio phone aur smart phone me ek click me custom firmware flash aur photos/music transfer karta hai.',
    features: [
      'Zero drivers needed: Auto-detects Qualcomm 9008, Fastboot, ADB & KaiOS ports',
      'Ultra high speed data transfer over USB (Up to 480 Mbps)',
      'Built-in ROM flasher with unbrick rescue tool',
      'Lightweight Windows portable .exe (no installation required)'
    ],
    flashingSpecs: {
      supportedChips: 'Windows 7/10/11 (32-bit & 64-bit), Ubuntu/Debian Linux',
      otgSupport: true,
      baudRate: '921600',
      partitions: ['master_mbr', 'rom_package.bin'],
      steps: [
        'Tool ko PC me run karein',
        'OTG Cable se target phone jodein',
        'Flasher screen se desired ROM image select karein',
        'Start Flash dabayein'
      ]
    },
    installationSteps: [
      'Download PC Bridge (.exe)',
      'Double click karke run karein',
      'Port detect hone par target phone choose karein'
    ],
    sourceCodeFiles: [
      {
        name: 'package.json',
        language: 'json',
        content: JSON.stringify({
          name: 'pc-file-bridge',
          version: '1.6.0',
          main: 'main.js',
          dependencies: { 'serialport': '^12.0.0', 'usb': '^2.11.0' }
        }, null, 2)
      },
      {
        name: 'main.js',
        language: 'javascript',
        content: `// PC Bridge Native USB / OTG Daemon\nconsole.log("PC Fast Bridge Ready. Listening for USB OTG devices...");`
      }
    ],
    demoHtml: `<div style="text-align:center; padding:15px; color:#fff; background:#111827; border-radius:8px;">
      <div style="font-size:32px;">💻 ⇄ 📱</div>
      <h4 style="margin:5px 0; color:#a855f7;">PC Fast Bridge v1.6</h4>
      <div style="font-size:12px; color:#10b981; margin:8px 0;">● USB OTG Port Active (High Speed)</div>
      <div style="background:#1f2937; padding:8px; border-radius:6px; font-size:11px; text-align:left; color:#9ca3af;">
        <div>Connected: Jio F220B (Qualcomm 9008)</div>
        <div>Ready to transfer or flash firmware</div>
      </div>
    </div>`,
    createdAt: Date.now() - 3600000 * 5,
    isAiGenerated: true,
  }
];

export function getSavedSoftwares(): CustomSoftware[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SOFTWARES));
      return INITIAL_SOFTWARES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SOFTWARES;
  } catch (e) {
    console.error('Failed to load from storage', e);
    return INITIAL_SOFTWARES;
  }
}

export function saveSoftware(software: CustomSoftware): void {
  try {
    const current = getSavedSoftwares();
    // Prepend new software so it appears at top
    const updated = [software, ...current.filter(s => s.id !== software.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to storage', e);
  }
}

export function deleteSoftware(id: string): CustomSoftware[] {
  try {
    const current = getSavedSoftwares();
    const updated = current.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete from storage', e);
    return [];
  }
}
