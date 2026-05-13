'use server';

import figlet from 'figlet';

export async function generateAscii(text: string, font: string = 'Standard'): Promise<string> {
  if (!text) return '';
  return new Promise((resolve, reject) => {
    figlet(text, { font: font as figlet.Fonts }, (err, data) => {
      if (err) {
         console.error('Something went wrong...', err);
         return resolve('Error generating ASCII. Try a different font or text.');
      }
      resolve(data || '');
    });
  });
}

export async function getAsciiFonts(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        figlet.fonts((err, fonts) => {
            if (err) return resolve(['Standard', 'Ghost', 'Graffiti', 'Slant']);
            resolve(fonts || ['Standard']);
        })
    });
}
