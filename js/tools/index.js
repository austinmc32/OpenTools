// Import all tools
import { markdownPreviewer } from './markdown-previewer.js';
import { syntaxHighlighter } from './syntax-highlighter.js';
import { qrcodeGenerator } from './qrcode-generator.js';
import { caseConverter } from './case-converter.js';
import { characterCounter } from './character-counter.js';
import { textDiff } from './text-diff.js';
import { calculator } from './calculator.js';
import { unitConverter } from './unit-converter.js';
import { percentageCalculator } from './percentage-calculator.js';
import { passwordGenerator } from './password-generator.js';
import { loremIpsum } from './lorem-ipsum.js';
import { uuidGenerator } from './uuid-generator.js';
import { barcodeGenerator } from './barcode-generator.js';
import { pdfConverter } from './pdf-converter.js';
import { ipFinder } from './ip-finder.js';
import { ipLookup } from './ip-lookup.js';
import { cryptoDecoder } from './crypto-decoder.js';
import { imageConverter } from './image-converter.js';
import { textToSpeech } from './text-to-speech.js';
import { textSummarizer } from './text-summarizer.js';
import { csvJsonConverter } from './csv-json-converter.js';
import { timezoneConverter } from './timezone-converter.js';

// Export all tools as a single object
export const toolsImplementation = {
    'markdown-previewer': markdownPreviewer,
    'syntax-highlighter': syntaxHighlighter,
    'qrcode-generator': qrcodeGenerator,
    'case-converter': caseConverter,
    'character-counter': characterCounter,
    'text-diff': textDiff,
    'calculator': calculator,
    'unit-converter': unitConverter,
    'percentage-calculator': percentageCalculator,
    'password-generator': passwordGenerator,
    'lorem-ipsum': loremIpsum,
    'uuid-generator': uuidGenerator,
    'barcode-generator': barcodeGenerator,
    'pdf-converter': pdfConverter,
    'ip-finder': ipFinder,
    'ip-lookup': ipLookup,
    'crypto-decoder': cryptoDecoder,
    'image-converter': imageConverter,
    'text-to-speech': textToSpeech,
    'text-summarizer': textSummarizer,
    'csv-json-converter': csvJsonConverter,
    'timezone-converter': timezoneConverter
};
