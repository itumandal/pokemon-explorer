import '@testing-library/jest-dom';
// Polyfill TextEncoder/TextDecoder for Jest environment
import { TextEncoder, TextDecoder } from 'util';

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder as any;
