import {surpriseMePrompts} from "../constants/index.js";
import FileSaver from 'file-saver';

export function getRandomPrompt() {
    //Getting a random prompt from the surpriseMePrompts array
    const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
    const randomPrompt = surpriseMePrompts[randomIndex];
    //If the random prompt is the same as the current prompt, get a new random prompt
    if (randomPrompt === prompt) return getRandomPrompt(prompt)
    return randomPrompt;
}

export async function downloadImage(_id, photo) {
    FileSaver.saveAs(photo, `download-${_id}.jpg`);
}