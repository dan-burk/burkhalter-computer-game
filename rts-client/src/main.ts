import './style.css';
import { createGame } from './game';

const container = document.querySelector<HTMLDivElement>('#app');

if (!container) {
    throw new Error('Root container element "#app" was not found.');
}

createGame('app');
