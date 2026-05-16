'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

// --- Mappings ---
const NORMAL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const MAPS = {
  bold: '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟗𝟖𝟗',
  italic: '𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍0123456789',
  boldItalic: '𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟗𝟖𝟗',
  sans: '𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫',
  sansBold: '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵',
  sansItalic: '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡0123456789',
  sansBoldItalic: '𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕0123456789',
  cursive: '𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵0123456789',
  cursiveBold: '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩0123456789',
  fraktur: '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅𝔆𝔇𝔈𝔉𝔊𝔋𝔌𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔┋𝔖𝔗𝔘𝔙𝔚𝔛𝔜𝔝0123456789',
  frakturBold: '𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅0123456789',
  doubleStruck: '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟟𝟝𝟞𝟟𝟠𝟡',
  squared: '🄰𝄃🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789',
  circled: 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ⓪①②③④⑤⑥⑦⑧⑨',
  invertedSquare: '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩0123456789',
  widened: 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９',
  upsideDown: 'ɐqɔpǝɟƃɥıɾʞlɯuodbɹsʇnʌʍxʎz∀qƆPƎℲפHIſʞ˥WNOԀQᴚS⊥∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ86',
  superscript: 'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹',
  cherokee: 'ᏗᏋፈᎴᏋᎦᎶᏂᎥᏠᏦᏝᎷᏁᎧᎮᎤᏒᏕᏖᏬᏉᏇጀᎩፚᏗᏋፈᎴᏋᎦᎶᏂᎥᏠᏦᏝᎷᏁᎧᎮᎤᏒᏕᏖᏬᏉᏇጀᎩፚ0123456789',
  cyrillic: 'авсdеfgніјкlмпорqяѕтцѵшхуzАВСDЕFGНІЈКLМПОРQЯЅТЦѴШХУZ0123456789',
  asian: '卂乃匚ᗪ乇千Ꮆ卄丨ﾌҜㄥ爪几ㄖ卩Ɋ尺丂ㄒㄩᐯ山乂ㄚ乙卂乃匚ᗪ乇千Ꮆ卄丨ﾌҜㄥ爪几ㄖ卩Ɋ尺丂ㄒㄩᐯ山乂ㄚ乙0123456789',
  armenian: 'αႦƈԃҽϝɠԋιʝƙʅɱɳσρϙɾʂƚυʋɯxყȥABLDEFGHIKLMNOPQRSTUWXMZ0123456789',
  currency: '₳฿₵Đ€₣₲ⱧłJ₭Ⱡ₥₦Ø₱QⱤ₴₮ɄV₩ӾɎⱫ₳฿₵Đ€₣₲ⱧłJ₭Ⱡ₥₦Ø₱QⱤ₴₮ɄV₩ӾɎⱫ0123456789',
  accented: 'áбćđéfǵhíjklmńópqŕśtúvwxýźÁБĆĐÉFǴHÍJKLMŃÓPQŔŚTÚVWXÝŹ0123456789',
  dotted: 'ạḅcḍẹfghịjkḷmṇọpqṛṣṭụvwxỵzẠḄCḌẸFGHỊJKḶMṆỌPQṚṢṬỤVWXỴZ0123456789'
};

const DECORATORS: Record<string, (text: string) => string> = {
  strike: (text) => text.split('').map(c => c + '\u0336').join(''),
  slash: (text) => text.split('').map(c => c + '\u0337').join(''),
  underline: (text) => text.split('').map(c => c + '\u0332').join(''),
  doubleUnderline: (text) => text.split('').map(c => c + '\u0333').join(''),
  tildeStrike: (text) => text.split('').map(c => c + '\u0334').join(''),
  cross: (text) => text.split('').map(c => c + '\u0338').join(''),
  overline: (text) => text.split('').map(c => c + '\u0305').join(''),
  squiggle1: (text) => text.split('').map(c => c + '\u033B').join(''),
  squiggle2: (text) => text.split('').map(c => c + '\u034E').join(''),
  squiggle3: (text) => text.split('').map(c => c + '\u0353').join(''),
  dotsUnder: (text) => text.split('').map(c => c + '\u0324').join(''),
  starsOver: (text) => text.split('').map(c => c + '\u035B').join(''),
  arrowsOver: (text) => text.split('').map(c => c + '\u0350').join(''),
  bridgeUnder: (text) => text.split('').map(c => c + '\u032A').join(''),
  boxed: (text) => text.split('').map(c => `[̲̅${c}̲̅]`).join(''),
  bracketed1: (text) => text.split('').map(c => `『${c}』`).join(''),
  bracketed2: (text) => text.split('').map(c => `「${c}」`).join(''),
  bracketed3: (text) => text.split('').map(c => `【${c}】`).join(''),
  bracketed4: (text) => text.split('').map(c => `꜍${c}꜉`).join(''),
  bracketed5: (text) => text.split('').map(c => `〖${c}〗`).join(''),
  hearts: (text) => '♥' + text.split('').join('♥') + '♥',
  stars: (text) => '✸' + text.split('').join('✸') + '✸',
  waves: (text) => '≋' + text.split('').join('≋') + '≋',
  dots: (text) => '◦' + text.split('').join('◦') + '◦',
  blocks: (text) => '▒' + text.split('').join('▒') + '▒',
  blocksLight: (text) => '░' + text.split('').join('░') + '░',
  approx: (text) => '≈' + text.split('').join('≈') + '≈',
  mi: (text) => 'ﾐ' + text.split('').join('ﾐ') + 'ﾐ',
  zalgo1: (text) => text.split('').map(c => c + '\u033F\u0347\u0353\u0332').join(''),
  zalgo2: (text) => text.split('').map(c => c + '\u0489\u0359\u0311\u0300').join(''),
  zalgo3: (text) => text.split('').map(c => c + '\u0488').join(''),
  zalgo4: (text) => text.split('').map(c => c + '\u0E5B').join(''),
  leet: (text) => {
    const chars: Record<string, string> = {'a': '4', 'b': '8', 'e': '3', 'g': '9', 'i': '1', 'o': '0', 's': '5', 't': '7', 'z': '2', 'w': 'vv', 'r': '?'};
    return text.toLowerCase().split('').map(c => chars[c] || c).join('');
  }
};

const SYMBOLS = [
  "★·.·´¯`·.·★ Text ★·.·´¯`·.·★",
  "°·..·°¯°·._.· Text ·._.·°¯°·.·°",
  "°º¤ø,¸¸,ø¤º° Text °º¤ø,¸¸,ø¤º°",
  "×º°”˜`”°º× Text ×º°”˜`”°º×",
  "¸,ø¤º°`°º¤ø,¸ Text ¸,ø¤º°`°º¤ø,¸",
  "(¯`*•.¸,°´✿.｡.:* Text *.:｡.✿`°,¸.•*´¯)",
  "-漫~*'¨¯¨'*·舞~ Text ~舞*'¨¯¨'*·~漫-",
  "⋅.˳˳.⋅ॱ˙˙ॱ⋅.˳ Text ˳.⋅ॱ˙˙ॱ⋅.˳˳.⋅",
  "✴.·´¯`·.·★ Text ★·.·`¯´·.✴",
  "•·.·''·.·•• Text ••·.·''·.·•",
  "°•◌★•◌• Text •◌•★•◌•°",
  "｡｡◦◦｡｡◦ Text ◦｡｡◦◦｡。",
  "¸„.-•~¹°”ˆ˜¨ Text ¨˜ˆ”°¹~•-.„¸",
  "▁ ▂ ▄ ▅ ▆ ▇ █ Text █ ▇ ▆ ▅ ▄ ▂ ▁",
  "█▓▒░ Text ░▒▓█",
  "░▒▓█ Text █▓▒░",
  "▌│█║▌║▌║ Text ║▌║▌║█│▌",
  "▀▄▀▄▀▄ Text ▄▀▄▀▄▀",
  "■━■━■━■ Text ■━■━■━■",
  "ıllıllı Text ıllıllı",
  "╰☆☆ Text ☆☆╮",
  "★彡 Text 彡★",
  "◦•●◉✿ Text ✿◉●•◦",
  "•°•.•°• Text •°•.•°•",
  "••°°••.. Text °°••..••",
  "➴➵➶➴Text➶➴➵➶",
  "↤↤↤↤↤ Text ↦↦↦↦↦",
  "↫↫↫↫↫ Text ↬↬↬↬↬",
  ".•♫•♬• Text •♬•♫•.",
  "¸.♮•♫♪ Text ♪♫•♮.¸",
  "♪♫•*¨*•.¸ Text .•*¨*•♫♪",
  "¸¸♫·¯·♪ Text ♪·¯·♬¸¸",
  ".｡.:*⚝.:**:. Text .:**:.⚝*:.｡.",
  "･*:.｡..｡.:*ﾟ Text ﾟ:.｡..｡.:*･",
  "｡·:*·:*:·ﾟ✿ Text ✿ﾟ·:*·:*:·｡",
  "·:✼✿ Text ✿✼:·",
  "‧̍̊·̊‧̥°̩̥˚̩̩̥͙°̩̥‧̥·̊Text·̊‧̥°̩̥˚̩̩̥͙°̩̥‧̥·̊‧̍̊",
  "┬┴┬┴┤ Text ├┬┴┬┴",
  "-ˏˋ Text ˊˎ",
  "ˏˋ ★ˎˊ Text ˏˋ ★ˎˊ",
  "✧☆*｡ Text ｡⋆✩⋆",
  ".·•●♥ Text .··ℒ♡ⓥℯ",
  "(っ◔◡◔)っ ♥ Text ♥",
  "ღ(¯`◕‿◕´¯) Text (¯`◕‿◕´¯)ღ",
  "₍₍(∩´ ᵕ `∩)⁾⁾ Text ₍₍(∩´ ᵕ `∩)⁾⁾",
  "ᕦ(ツ)ᕤ Text",
  ".·:*¨¨* Text *¨¨*:·.",
  "❀⊱ Text ⊰❀",
  "×☓╳Text╳☓×",
  "●▲■ Text ■▲●",
  "ⵔⵠ▢ Text ▢ⵠⵔ",
  "▄︻デ Text ═━一",
  "︻┻┳═─ ҉ Text-",
  "︻▅Text▆▇◤",
  "︻I▅Text▆▇◤",
  "︻蹦▅Text▆▇◤",
  "༒Text༒"
];

const CATEGORIES = ['All', 'Bold/Italic', 'Cursive', 'Gothic', 'Squared', 'Special', 'Zalgo', 'Decorations'];

function transformText(text: string, charset: string, symbolWrapper: string = '') {
  if (!text) return '';
  const converted = text.split('').map(char => {
    const idx = NORMAL.indexOf(char);
    if (idx !== -1 && charset[idx]) {
      return charset[idx];
    }
    return char;
  }).join('');
  
  if (symbolWrapper) {
    if (symbolWrapper.includes('Text')) {
      return symbolWrapper.replace('Text', converted);
    }
    return `${symbolWrapper} ${converted} ${symbolWrapper}`;
  }
  return converted;
}

export default function DifferentLetters() {
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const variations = [
    // Bold/Italic
    { name: 'Bold', text: transformText(text, MAPS.bold, selectedSymbol), category: 'Bold/Italic' },
    { name: 'Italic', text: transformText(text, MAPS.italic, selectedSymbol), category: 'Bold/Italic' },
    { name: 'Bold Italic', text: transformText(text, MAPS.boldItalic, selectedSymbol), category: 'Bold/Italic' },
    { name: 'Sans', text: transformText(text, MAPS.sans, selectedSymbol), category: 'Bold/Italic' },
    { name: 'Sans Bold', text: transformText(text, MAPS.sansBold, selectedSymbol), category: 'Bold/Italic' },
    { name: 'Sans Italic', text: transformText(text, MAPS.sansItalic, selectedSymbol), category: 'Bold/Italic' },
    { name: 'Sans Bold Italic', text: transformText(text, MAPS.sansBoldItalic, selectedSymbol), category: 'Bold/Italic' },
    
    // Cursive
    { name: 'Cursive', text: transformText(text, MAPS.cursive, selectedSymbol), category: 'Cursive' },
    { name: 'Cursive Bold', text: transformText(text, MAPS.cursiveBold, selectedSymbol), category: 'Cursive' },
    
    // Gothic
    { name: 'Fraktur (Gothic)', text: transformText(text, MAPS.fraktur, selectedSymbol), category: 'Gothic' },
    { name: 'Fraktur Bold', text: transformText(text, MAPS.frakturBold, selectedSymbol), category: 'Gothic' },
    
    // Squared
    { name: 'Squared', text: transformText(text, MAPS.squared, selectedSymbol), category: 'Squared' },
    { name: 'Inverted Square', text: transformText(text, MAPS.invertedSquare, selectedSymbol), category: 'Squared' },
    { name: 'Circled', text: transformText(text, MAPS.circled, selectedSymbol), category: 'Squared' },
    
    // Special
    { name: 'Double Struck', text: transformText(text, MAPS.doubleStruck, selectedSymbol), category: 'Special' },
    { name: 'Widened', text: transformText(text, MAPS.widened, selectedSymbol), category: 'Special' },
    { name: 'Superscript', text: transformText(text, MAPS.superscript, selectedSymbol), category: 'Special' },
    { name: 'Upside Down', text: transformText(text, MAPS.upsideDown, selectedSymbol), category: 'Special' },
    { name: 'Cyrillic Look', text: transformText(text, MAPS.cyrillic, selectedSymbol), category: 'Special' },
    { name: 'Asian Look', text: transformText(text, MAPS.asian, selectedSymbol), category: 'Special' },
    { name: 'Cherokee Look', text: transformText(text, MAPS.cherokee, selectedSymbol), category: 'Special' },
    { name: 'Armenian Look', text: transformText(text, MAPS.armenian, selectedSymbol), category: 'Special' },
    { name: 'Currency Look', text: transformText(text, MAPS.currency, selectedSymbol), category: 'Special' },
    { name: 'Accented', text: transformText(text, MAPS.accented, selectedSymbol), category: 'Special' },
    { name: 'Dotted', text: transformText(text, MAPS.dotted, selectedSymbol), category: 'Special' },
    
    // Zalgo
    { name: 'Zalgo Level 1', text: text ? DECORATORS.zalgo1(text) : '', category: 'Zalgo' },
    { name: 'Zalgo Level 2', text: text ? DECORATORS.zalgo2(text) : '', category: 'Zalgo' },
    { name: 'Zalgo Level 3', text: text ? DECORATORS.zalgo3(text) : '', category: 'Zalgo' },
    { name: 'Zalgo Level 4', text: text ? DECORATORS.zalgo4(text) : '', category: 'Zalgo' },
    
    // Decorations
    { name: 'Strikethrough', text: text ? DECORATORS.strike(text) : '', category: 'Decorations' },
    { name: 'Slash', text: text ? DECORATORS.slash(text) : '', category: 'Decorations' },
    { name: 'Underline', text: text ? DECORATORS.underline(text) : '', category: 'Decorations' },
    { name: 'Double Underline', text: text ? DECORATORS.doubleUnderline(text) : '', category: 'Decorations' },
    { name: 'Tilde Strike', text: text ? DECORATORS.tildeStrike(text) : '', category: 'Decorations' },
    { name: 'Cross', text: text ? DECORATORS.cross(text) : '', category: 'Decorations' },
    { name: 'Overline', text: text ? DECORATORS.overline(text) : '', category: 'Decorations' },
    { name: 'Squiggle 1', text: text ? DECORATORS.squiggle1(text) : '', category: 'Decorations' },
    { name: 'Squiggle 2', text: text ? DECORATORS.squiggle2(text) : '', category: 'Decorations' },
    { name: 'Squiggle 3', text: text ? DECORATORS.squiggle3(text) : '', category: 'Decorations' },
    { name: 'Dots Under', text: text ? DECORATORS.dotsUnder(text) : '', category: 'Decorations' },
    { name: 'Stars Over', text: text ? DECORATORS.starsOver(text) : '', category: 'Decorations' },
    { name: 'Arrows Over', text: text ? DECORATORS.arrowsOver(text) : '', category: 'Decorations' },
    { name: 'Bridge Under', text: text ? DECORATORS.bridgeUnder(text) : '', category: 'Decorations' },
    { name: 'Leet Speak', text: text ? DECORATORS.leet(text) : '', category: 'Decorations' },
    { name: 'Boxed', text: text ? DECORATORS.boxed(text) : '', category: 'Decorations' },
    { name: 'Bracketed 1', text: text ? DECORATORS.bracketed1(text) : '', category: 'Decorations' },
    { name: 'Bracketed 2', text: text ? DECORATORS.bracketed2(text) : '', category: 'Decorations' },
    { name: 'Bracketed 3', text: text ? DECORATORS.bracketed3(text) : '', category: 'Decorations' },
    { name: 'Bracketed 4', text: text ? DECORATORS.bracketed4(text) : '', category: 'Decorations' },
    { name: 'Bracketed 5', text: text ? DECORATORS.bracketed5(text) : '', category: 'Decorations' },
    { name: 'Hearts', text: text ? DECORATORS.hearts(text) : '', category: 'Decorations' },
    { name: 'Stars', text: text ? DECORATORS.stars(text) : '', category: 'Decorations' },
    { name: 'Waves', text: text ? DECORATORS.waves(text) : '', category: 'Decorations' },
    { name: 'Dots', text: text ? DECORATORS.dots(text) : '', category: 'Decorations' },
    { name: 'Approx', text: text ? DECORATORS.approx(text) : '', category: 'Decorations' },
    { name: 'Mi', text: text ? DECORATORS.mi(text) : '', category: 'Decorations' },
    { name: 'Blocks', text: text ? DECORATORS.blocks(text) : '', category: 'Decorations' },
    { name: 'Blocks Light', text: text ? DECORATORS.blocksLight(text) : '', category: 'Decorations' },
  ];

  const filteredVariations = variations.filter(v => 
    filter === 'All' || v.category === filter
  );

  const handleCopy = (res: string, idx: number) => {
    if (!res) return;
    navigator.clipboard.writeText(res);
    setCopiedIndex(idx);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-sans">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 transition-colors">Different Letters</h1>

      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Type your nickname or text here" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700/50 rounded-lg p-4 text-base focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white shadow-sm"
        />
      </div>

      <div className="mb-6">
        <div className="flex overflow-x-auto border-b border-slate-700/50 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                filter === cat 
                  ? 'border-blue-500 text-blue-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <label htmlFor="dec" className="text-sm font-medium text-slate-700 dark:text-slate-300">Symbols:</label>
        <select 
          id="dec"
          value={selectedSymbol}
          onChange={e => setSelectedSymbol(e.target.value)}
          className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 rounded-md p-2.5 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto md:max-w-xs shadow-sm cursor-pointer"
        >
          <option value="">None</option>
          {SYMBOLS.map((sym, idx) => (
            <option key={idx} value={sym}>{sym}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
        {filteredVariations.map((v, i) => (
          <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all shadow-sm">
            <div className="text-lg text-slate-800 dark:text-slate-200 overflow-hidden text-ellipsis whitespace-nowrap mr-4 break-words">
              {v.text || <span className="text-slate-400 dark:text-slate-500 italic text-sm">Type to preview {v.name}</span>}
            </div>
            <button 
              onClick={() => handleCopy(v.text, i)}
              disabled={!v.text}
              className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors disabled:opacity-30 flex-shrink-0 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"
              title={`Copy ${v.name}`}
            >
              {copiedIndex === i ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        ))}
        {filteredVariations.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 py-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700/50">
            No variations available in this category.
          </p>
        )}
      </div>
    </div>
  );
}
