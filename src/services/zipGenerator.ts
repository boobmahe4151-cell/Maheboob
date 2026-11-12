import JSZip from 'jszip';
import { CustomSoftware } from '../types';

export async function downloadSoftwareZip(software: CustomSoftware): Promise<void> {
  const zip = new JSZip();

  // Root folder
  const folderName = `${software.name.replace(/[^a-zA-Z0-9_\-\u0900-\u097F]/g, '_')}_${software.version}`;
  const root = zip.folder(folderName) || zip;

  // Add source code files
  if (software.sourceCodeFiles && software.sourceCodeFiles.length > 0) {
    software.sourceCodeFiles.forEach(file => {
      root.file(file.name, file.content);
    });
  }

  // Add metadata info
  root.file('software_blueprint.json', JSON.stringify(software, null, 2));

  // Add comprehensive OTG Flash Guide & Install manual
  const guideContent = `======================================================
  ${software.name} (${software.version})
  Platform: ${software.platform.toUpperCase()}
  Format: ${software.fileFormat} | Size: ${software.estimatedSize}
======================================================

TAGLINE:
${software.tagline}

DESCRIPTION:
${software.description}

FEATURES:
${software.features.map((f, i) => `${i + 1}. ${f}`).join('\n')}

======================================================
OTG CABLE FLASHING GUIDE (हिंदी व ENGLISH)
======================================================
Supported Chips: ${software.flashingSpecs?.supportedChips || 'Qualcomm / Spreadtrum / MTK'}
Baud Rate: ${software.flashingSpecs?.baudRate || '921600'}
Partitions: ${(software.flashingSpecs?.partitions || []).join(', ')}

STEPS TO FLASH VIA OTG CABLE:
${(software.flashingSpecs?.steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}

======================================================
INSTALLATION STEPS:
======================================================
${(software.installationSteps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}

======================================================
KEYPAD SHORTCUT MAPPINGS (FOR JIO PHONE):
======================================================
Center Key: ${software.keypadControls?.center || 'OK / Select'}
Up: ${software.keypadControls?.up || 'Up'}
Down: ${software.keypadControls?.down || 'Down'}
Left: ${software.keypadControls?.left || 'Left'}
Right: ${software.keypadControls?.right || 'Right'}
* Key: ${software.keypadControls?.star || 'Flashlight / Special'}
# Key: ${software.keypadControls?.hash || 'Language / Lock'}
Call Key: ${software.keypadControls?.call || 'Quick Action'}
End Call: ${software.keypadControls?.endCall || 'Exit'}

Generated with ❤️ by Jio & Smart AI OS Studio
`;
  root.file('README_OTG_FLASH_GUIDE.txt', guideContent);

  // Generate binary flash payload dummy if applicable
  root.file('firmware_payload.bin', new Uint8Array([0x50, 0x4B, 0x03, 0x04, 0x4A, 0x49, 0x4F, 0x5F, 0x52, 0x4F, 0x4D]));

  // Generate zip Blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
