'use server';

// figlet bundles hundreds of font files. Importing it lazily inside the action
// keeps it out of the server module graph until an ASCII tool is actually used,
// which speeds up dev-server compilation on slower machines.
async function loadFiglet() {
  const mod = await import('figlet');
  return (mod.default ?? mod) as typeof import('figlet').default;
}

export async function generateAscii(text: string, font: string = 'Standard'): Promise<string> {
  if (!text) return '';
  const figlet = await loadFiglet();
  return new Promise((resolve) => {
    figlet(text, { font } as Parameters<typeof figlet>[1], (err, data) => {
      if (err) {
         console.error('Something went wrong...', err);
         return resolve('Error generating ASCII. Try a different font or text.');
      }
      resolve(data || '');
    });
  });
}

export async function getAsciiFonts(): Promise<string[]> {
    const figlet = await loadFiglet();
    return new Promise((resolve) => {
        figlet.fonts((err, fonts) => {
            if (err) return resolve(['Standard', 'Ghost', 'Graffiti', 'Slant']);
            resolve(fonts || ['Standard']);
        })
    });
}
