/* 일러스트 라이브러리: 모든 그림은 SVG 문자열로 만들어요 (외부 이미지 없음) */
import type { Page } from '../data/types'

const INK='#3B2F2A', SKIN='#FFD9B8';
const eye=(x:number,y:number,r=2.4)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${(x+r*.35).toFixed(1)}" cy="${(y-r*.35).toFixed(1)}" r="${(r*.38).toFixed(1)}" fill="#fff"/>`;
const shut=(x:number,y:number)=>`<path d="M${x-3} ${y} q3 2.6 6 0" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
const cheek=(x:number,y:number)=>`<ellipse cx="${x}" cy="${y}" rx="3.6" ry="2.2" fill="#F59AAE" opacity=".55"/>`;
const smile=(x:number,y:number,w=8)=>`<path d="M${x-w/2} ${y} q${w/2} ${w*.4} ${w} 0" stroke="${INK}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
const star=(cx:number,cy:number,r:number,f:string)=>{let d='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;d+=(i?'L':'M')+(cx+rr*Math.cos(a)).toFixed(1)+' '+(cy+rr*Math.sin(a)).toFixed(1);}return `<path d="${d}Z" fill="${f}"/>`};
function rnd(seed:number){return()=>(seed=(seed*16807)%2147483647)/2147483647}

const pig=(sc:string)=>`
<path d="M74 70 q9 -5 7 3 q-2 6 5 3" fill="none" stroke="#E79AAA" stroke-width="2.6" stroke-linecap="round"/>
<rect x="33" y="80" width="9" height="18" rx="4" fill="#E99DAD"/><rect x="58" y="80" width="9" height="18" rx="4" fill="#E99DAD"/>
<ellipse cx="50" cy="72" rx="26" ry="19" fill="#F7BACA"/><ellipse cx="50" cy="79" rx="15" ry="9" fill="#FBD3DD"/>
<path d="M35 57 Q50 66 65 57 L59 71 L50 64 L41 71Z" fill="${sc}"/>
<path d="M34 30 L29 12 L45 23Z" fill="#EFA2B4"/><path d="M66 30 L71 12 L55 23Z" fill="#EFA2B4"/>
<circle cx="50" cy="42" r="20" fill="#F7BACA"/>
<ellipse cx="50" cy="49" rx="9" ry="6.5" fill="#EE9DB0"/><ellipse cx="46.5" cy="49" rx="1.6" ry="2.3" fill="#B65C72"/><ellipse cx="53.5" cy="49" rx="1.6" ry="2.3" fill="#B65C72"/>
${eye(42,39,2.6)}${eye(58,39,2.6)}${cheek(35,47)}${cheek(65,47)}`;

export const ACT:Record<string,(u:string)=>string>={
pigA:()=>pig('#FFD34E'), pigB:()=>pig('#8CC7E0'), pigC:()=>pig('#E5534B'),
wolf:()=>`
<path d="M30 70 Q8 66 6 46 Q16 58 32 60Z" fill="#7C8798"/><path d="M6 46 Q8 52 13 55" stroke="#CDD4DE" stroke-width="3" fill="none"/>
<rect x="34" y="80" width="9" height="18" rx="4" fill="#717C8D"/><rect x="56" y="80" width="9" height="18" rx="4" fill="#717C8D"/>
<ellipse cx="48" cy="72" rx="22" ry="18" fill="#8D98A8"/><ellipse cx="54" cy="78" rx="11" ry="11" fill="#CDD4DE"/>
<path d="M42 30 L40 8 L54 24Z" fill="#8D98A8"/><path d="M44 26 L43 14 L51 23Z" fill="#E7BFC6"/>
<path d="M62 26 L70 6 L72 30Z" fill="#8D98A8"/><path d="M64 25 L69 13 L70 27Z" fill="#E7BFC6"/>
<circle cx="56" cy="40" r="18" fill="#8D98A8"/><ellipse cx="70" cy="48" rx="13" ry="8" fill="#CDD4DE"/>
<circle cx="82" cy="46" r="3.6" fill="${INK}"/>
<path d="M66 54 q7 4 14 -1" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
${eye(52,36)}${eye(63,35)}<path d="M48 30 l7 3 M60 30 l6 -2" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
straw:()=>`
<rect x="18" y="56" width="64" height="44" fill="#F0D795"/>
${[23,29,35,65,71,77].map(x=>`<line x1="${x}" y1="58" x2="${x}" y2="98" stroke="#D9B865" stroke-width="1.4"/>`).join('')}
<path d="M40 100 V80 Q50 70 60 80 V100Z" fill="#A9763F"/>
<path d="M6 60 Q12 22 50 14 Q88 22 94 60 Q50 52 6 60Z" fill="#E3B755"/>
<path d="M14 50 Q50 40 86 50 M20 38 Q50 28 80 38 M30 26 Q50 20 70 26" stroke="#C99A3A" stroke-width="1.6" fill="none"/>
${Array.from({length:15},(_,i)=>8+i*6).map(x=>`<line x1="${x}" y1="${x<50?60-(x-8)*.05:58}" x2="${x+1}" y2="65" stroke="#D3A646" stroke-width="1.6"/>`).join('')}`,
wood:()=>`
<rect x="18" y="52" width="64" height="48" fill="#CB8E58"/>
${[60,68,76,84,92].map(y=>`<line x1="18" y1="${y}" x2="82" y2="${y}" stroke="#AA703F" stroke-width="1.4"/>`).join('')}
<rect x="24" y="62" width="13" height="13" rx="2" fill="#FFE9A8" stroke="#8A5533" stroke-width="2"/><path d="M30.5 62 V75 M24 68.5 H37" stroke="#8A5533" stroke-width="1.5"/>
<rect x="48" y="72" width="16" height="28" rx="2" fill="#7A4728"/><circle cx="60" cy="87" r="1.6" fill="#F2C14E"/>
<path d="M8 56 L50 18 L92 56Z" fill="#8A5533"/><path d="M50 18 L30 56 M50 18 L70 56 M50 18 V56" stroke="#74462A" stroke-width="1.5"/>
<path d="M8 56 L50 18 L92 56" stroke="#6E4024" stroke-width="3" fill="none" stroke-linejoin="round"/>`,
brick:(u:string)=>`
<defs><pattern id="${u}br" width="16" height="8" patternUnits="userSpaceOnUse"><rect width="16" height="8" fill="#D9714F"/><path d="M0 0H16M0 4H16M8 0V4M0 4V8M16 4V8" stroke="#B9563A" stroke-width="1"/></pattern></defs>
<rect x="66" y="20" width="10" height="24" fill="#B9563A"/><rect x="64" y="18" width="14" height="4" fill="#8E3F2C"/>
<rect x="16" y="50" width="68" height="50" fill="url(#${u}br)"/>
<path d="M6 54 L50 16 L94 54Z" fill="#7E3A2F"/><path d="M18 44 H82 M30 34 H70 M40 26 H60" stroke="#6A2F26" stroke-width="1.5"/>
<rect x="24" y="62" width="14" height="14" rx="7" fill="#FFE9A8" stroke="#5E3424" stroke-width="2"/><path d="M31 62 V76 M24 69 H38" stroke="#5E3424" stroke-width="1.4"/>
<path d="M50 100 V82 Q58 72 66 82 V100Z" fill="#5E3424"/><circle cx="62" cy="91" r="1.6" fill="#F2C14E"/>`,
hut:()=>`
<rect x="16" y="58" width="68" height="42" fill="#EED8AC"/>
<rect x="16" y="58" width="5" height="42" fill="#A0703F"/><rect x="79" y="58" width="5" height="42" fill="#A0703F"/><rect x="48" y="58" width="4" height="42" fill="#A0703F"/>
<rect x="24" y="66" width="18" height="16" fill="#FFF7E0" stroke="#A0703F" stroke-width="1.6"/><path d="M33 66V82M24 74H42" stroke="#C9A879" stroke-width="1"/>
<rect x="56" y="68" width="18" height="32" fill="#B07B47"/><path d="M65 68V100" stroke="#8A5A31" stroke-width="1.5"/>
<path d="M4 62 Q6 26 50 20 Q94 26 96 62 Q50 56 4 62Z" fill="#D9B25A"/>
<path d="M10 50 Q50 40 90 50 M18 36 Q50 26 82 36" stroke="#B38D3C" stroke-width="2" fill="none"/>`,
mom:()=>`
<path d="M28 100 Q30 70 38 60 L62 60 Q70 70 72 100Z" fill="#EE97A6"/>
<path d="M42 66 L38 98 M50 64 V99 M58 66 L62 98" stroke="#D97E8E" stroke-width="1.5"/>
<path d="M37 52 Q30 60 34 68" stroke="#FFE3A8" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="34" cy="69" r="3.4" fill="${SKIN}"/>
<path d="M63 52 Q70 60 66 68" stroke="#FFE3A8" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="66" cy="69" r="3.4" fill="${SKIN}"/>
<path d="M36 62 Q36 46 50 44 Q64 46 64 62Z" fill="#FFE3A8"/>
<path d="M44 46 L50 55 L56 46" stroke="#fff" stroke-width="3" fill="none"/>
<path d="M50 55 l-4 10 M50 55 l4 9" stroke="#D9534F" stroke-width="2.6" stroke-linecap="round"/>
<circle cx="50" cy="31" r="12" fill="${SKIN}"/>
<path d="M38 31 Q38 18 50 18 Q62 18 62 31 Q58 23 50 23 Q42 23 38 31Z" fill="${INK}"/>
<circle cx="50" cy="15" r="6" fill="${INK}"/><path d="M41 15 H59" stroke="#E8B04A" stroke-width="2" stroke-linecap="round"/>
${shut(46,32)}${shut(54,32)}${cheek(43,36)}${cheek(57,36)}${smile(50,38,6)}`,
boy:()=>`
<ellipse cx="44" cy="97" rx="5" ry="3" fill="#5B4636"/><ellipse cx="56" cy="97" rx="5" ry="3" fill="#5B4636"/>
<rect x="39" y="76" width="9" height="20" rx="3" fill="#F4EBD9"/><rect x="52" y="76" width="9" height="20" rx="3" fill="#F4EBD9"/>
<path d="M35 62 Q27 70 31 76" stroke="#7DB7E8" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="31" cy="77" r="3.5" fill="${SKIN}"/>
<path d="M65 62 Q73 70 69 76" stroke="#7DB7E8" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="69" cy="77" r="3.5" fill="${SKIN}"/>
<path d="M33 80 Q33 56 50 54 Q67 56 67 80Z" fill="#7DB7E8"/>
<path d="M44 56 L50 66 L56 56" stroke="#fff" stroke-width="3" fill="none"/>
<path d="M50 66 l-4 9 M50 66 l4 8" stroke="#E5534B" stroke-width="2.6" stroke-linecap="round"/>
<circle cx="50" cy="36" r="17" fill="${SKIN}"/>
<path d="M33 36 Q32 18 50 18 Q68 18 67 36 Q64 26 56 27 Q50 22 44 27 Q36 26 33 36Z" fill="${INK}"/>
${eye(44,38,2.3)}${eye(56,38,2.3)}${cheek(39,44)}${cheek(61,44)}${smile(50,45)}`,
girl:()=>`
<path d="M64 32 Q75 50 70 68" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M70 67 l6 6 M70 67 l-2 8" stroke="#E5534B" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="44" cy="98" rx="5" ry="2.6" fill="#E5534B"/><ellipse cx="56" cy="98" rx="5" ry="2.6" fill="#E5534B"/>
<path d="M32 98 Q34 72 40 64 L60 64 Q66 72 68 98Z" fill="#E86A6A"/>
<path d="M38 60 Q30 66 33 73" stroke="#FFC9D8" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="33" cy="74" r="3.4" fill="${SKIN}"/>
<path d="M62 60 Q70 66 67 73" stroke="#FFC9D8" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="67" cy="74" r="3.4" fill="${SKIN}"/>
<path d="M37 67 Q37 54 50 53 Q63 54 63 67Z" fill="#FFC9D8"/>
<path d="M45 55 L50 62 L55 55" stroke="#fff" stroke-width="2.6" fill="none"/>
<path d="M50 62 l-3 7 M50 62 l3 6" stroke="#9B6BC9" stroke-width="2.4" stroke-linecap="round"/>
<circle cx="50" cy="36" r="17" fill="${SKIN}"/>
<path d="M33 38 Q32 18 50 18 Q68 18 67 38 Q62 27 50 26 Q38 27 33 38Z" fill="${INK}"/>
${eye(44,38,2.3)}${eye(56,38,2.3)}${cheek(39,44)}${cheek(61,44)}${smile(50,45,7)}`,
tiger:()=>`
<path d="M26 72 Q8 70 8 52" stroke="#F2A03D" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M8 60 l7 -1 M8 54 l7 1" stroke="${INK}" stroke-width="2"/>
<rect x="30" y="80" width="10" height="18" rx="4" fill="#E8932F"/><rect x="58" y="80" width="10" height="18" rx="4" fill="#E8932F"/>
<ellipse cx="35" cy="98" rx="6" ry="2.6" fill="#FFF1DC"/><ellipse cx="63" cy="98" rx="6" ry="2.6" fill="#FFF1DC"/>
<ellipse cx="48" cy="72" rx="26" ry="18" fill="#F2A03D"/><ellipse cx="50" cy="80" rx="15" ry="9" fill="#FFF1DC"/>
<path d="M32 58 q3 7 -1 12 M42 55 q3 8 -1 13 M52 56 q3 7 -1 12" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
<circle cx="54" cy="30" r="7" fill="#F2A03D"/><circle cx="54" cy="30" r="3.5" fill="#FFF1DC"/>
<circle cx="80" cy="30" r="7" fill="#F2A03D"/><circle cx="80" cy="30" r="3.5" fill="#FFF1DC"/>
<circle cx="67" cy="46" r="19" fill="#F2A03D"/>
<path d="M61 33 h12 M63 37 h8 M67 30 v8" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
<path d="M49 46 h6 M50 51 h5 M85 46 h-6 M84 51 h-5" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
<ellipse cx="67" cy="54" rx="10" ry="7" fill="#FFF1DC"/><path d="M64 50 h6 l-3 3.4z" fill="${INK}"/>
<path d="M67 53.4 v2 M62 56 q5 3.4 10 0" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
${eye(60,43)}${eye(74,43)}`,
basketFull:()=>`
<circle cx="36" cy="63" r="8" fill="#fff" stroke="#EADFD3"/><circle cx="64" cy="63" r="8" fill="#B5DDA8"/><circle cx="50" cy="61" r="9" fill="#F7B7C6"/>
<circle cx="43" cy="53" r="7" fill="#F8E38F"/><circle cx="57" cy="53" r="7" fill="#fff" stroke="#EADFD3"/>
<path d="M22 70 L78 70 L71 98 L29 98Z" fill="#C89A5B"/><path d="M25 78 H75 M27 86 H73 M28 93 H72" stroke="#A97B42" stroke-width="1.6"/>
<path d="M38 70 L36 98 M50 70 V98 M62 70 L64 98" stroke="#A97B42" stroke-width="1.4"/><ellipse cx="50" cy="70" rx="29" ry="5" fill="#B5864A"/>`,
basketEmpty:()=>`
<path d="M22 70 L78 70 L71 98 L29 98Z" fill="#C89A5B"/><path d="M25 78 H75 M27 86 H73 M28 93 H72" stroke="#A97B42" stroke-width="1.6"/>
<path d="M38 70 L36 98 M50 70 V98 M62 70 L64 98" stroke="#A97B42" stroke-width="1.4"/><ellipse cx="50" cy="70" rx="29" ry="5" fill="#8E6534"/>
<ellipse cx="50" cy="69" rx="25" ry="3.4" fill="#6E4C26"/>`,
tree:()=>`
<path d="M42 100 Q46 76 40 54 L48 56 L50 44 L54 56 L60 54 Q54 76 58 100Z" fill="#8B5E3C"/>
<path d="M44 66 Q34 60 28 52 M56 64 Q66 58 72 52" stroke="#8B5E3C" stroke-width="4" fill="none" stroke-linecap="round"/>
<circle cx="27" cy="42" r="20" fill="#4E9A5B"/><circle cx="73" cy="42" r="20" fill="#4E9A5B"/><circle cx="50" cy="26" r="24" fill="#57A665"/><circle cx="50" cy="50" r="17" fill="#4E9A5B"/>
<circle cx="42" cy="16" r="8" fill="#76BD7F" opacity=".7"/><circle cx="22" cy="34" r="6" fill="#76BD7F" opacity=".7"/><circle cx="70" cy="30" r="5" fill="#76BD7F" opacity=".7"/>`,
rope:()=>`
<path d="M50 -480 C 56 -280 44 -110 50 90" stroke="#C9A36A" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M50 -480 C 56 -280 44 -110 50 90" stroke="#A8834B" stroke-width="6" stroke-dasharray="3 6" fill="none"/>
<circle cx="50" cy="91" r="5" fill="#A8834B"/>`,
sorghum:()=>[[28,30],[50,16],[72,32]].map(([x,t])=>`
<path d="M${x} 100 L${x+1} ${t}" stroke="#7FA65A" stroke-width="3"/>
<path d="M${x} ${t+42} q-12 -4 -16 -14 M${x} ${t+28} q12 -4 16 -14" stroke="#8DBA63" stroke-width="3" fill="none" stroke-linecap="round"/>
<ellipse cx="${x+1}" cy="${t-4}" rx="5.5" ry="10" fill="#C8453A"/><circle cx="${x-2}" cy="${t-8}" r="2" fill="#E0685A"/><circle cx="${x+3}" cy="${t-1}" r="2" fill="#E0685A"/>`).join(''),
dino:()=>dino(false), dinoSleep:()=>dino(true),
brachio:()=>`
<path d="M8 80 Q16 66 30 70 L30 82Z" fill="#8CC7E0"/>
${[30,40,54,64].map(x=>`<rect x="${x}" y="78" width="8" height="20" rx="3" fill="#78B4CF"/>`).join('')}
<ellipse cx="47" cy="72" rx="24" ry="15" fill="#8CC7E0"/><ellipse cx="48" cy="80" rx="14" ry="4.5" fill="#BFE2EF"/>
<path d="M58 66 Q70 42 72 12 L82 12 Q84 44 70 74Z" fill="#8CC7E0"/>
<ellipse cx="82" cy="11" rx="11" ry="7.5" fill="#8CC7E0"/>
<circle cx="40" cy="66" r="3" fill="#78B4CF"/><circle cx="50" cy="62" r="2.4" fill="#78B4CF"/><circle cx="72" cy="40" r="2" fill="#78B4CF"/><circle cx="76" cy="26" r="1.8" fill="#78B4CF"/>
${eye(84,9,1.8)}<path d="M85 14 q4 1.6 7 -1.6" stroke="${INK}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
ptero:()=>`
<path d="M50 50 L6 34 Q16 56 46 64Z" fill="#F3A65A"/><path d="M50 50 L94 34 Q84 56 54 64Z" fill="#F3A65A"/>
<path d="M50 50 L14 38 M50 50 L86 38" stroke="#D9853E" stroke-width="1.6"/>
<ellipse cx="50" cy="62" rx="8" ry="13" fill="#E58B4C"/><ellipse cx="50" cy="66" rx="4.5" ry="8" fill="#F7C99A"/>
<path d="M46 74 l-2 8 M54 74 l2 8" stroke="#C96A33" stroke-width="2.4" stroke-linecap="round"/>
<path d="M45 38 L28 26 L47 33Z" fill="#C96A33"/>
<circle cx="50" cy="40" r="9" fill="#E58B4C"/><path d="M56 38 L80 43 L56 46Z" fill="#F7C46A"/>
${eye(52,38,1.9)}${cheek(53,44)}`,
child:()=>`
<ellipse cx="43" cy="97" rx="5" ry="3" fill="#E5534B"/><ellipse cx="57" cy="97" rx="5" ry="3" fill="#E5534B"/>
<rect x="40" y="80" width="7" height="16" rx="3" fill="${SKIN}"/><rect x="53" y="80" width="7" height="16" rx="3" fill="${SKIN}"/>
<rect x="37" y="73" width="26" height="11" rx="4" fill="#5B8BD9"/>
<path d="M38 60 Q30 66 32 74" stroke="#FFD34E" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="32" cy="75" r="3.4" fill="${SKIN}"/>
<path d="M62 60 Q70 66 68 74" stroke="#FFD34E" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="68" cy="75" r="3.4" fill="${SKIN}"/>
<path d="M36 76 Q35 56 50 55 Q65 56 64 76Z" fill="#FFD34E"/><path d="M36 66 H64" stroke="#F5A44A" stroke-width="3"/>
<circle cx="50" cy="38" r="16" fill="${SKIN}"/>
<path d="M34 38 Q33 22 50 22 Q66 22 66 38 Q60 29 50 30 Q40 29 34 38Z" fill="#6B4A35"/>
<path d="M40 25 L50 2 L60 25Z" fill="#8CC7E0"/><path d="M44 16 L56 16 M46.5 10 L53.5 10" stroke="#fff" stroke-width="2.5"/><circle cx="50" cy="2" r="3.5" fill="#F7A8B8"/>
${eye(44,39,2.2)}${eye(56,39,2.2)}${cheek(39,45)}${cheek(61,45)}<path d="M45 45 q5 5 10 0Z" fill="#C94E5B"/>`,
gift:()=>`
<rect x="22" y="52" width="56" height="46" rx="4" fill="#E8635A"/>
<circle cx="32" cy="64" r="3" fill="#F49A92"/><circle cx="66" cy="80" r="3" fill="#F49A92"/><circle cx="34" cy="88" r="3" fill="#F49A92"/><circle cx="68" cy="62" r="3" fill="#F49A92"/>
<rect x="18" y="44" width="64" height="12" rx="3" fill="#F07C70"/><rect x="46" y="44" width="8" height="54" fill="#FFD34E"/>
<path d="M50 44 Q34 26 32 38 Q34 46 50 44Z M50 44 Q66 26 68 38 Q66 46 50 44Z" fill="#FFD34E"/><circle cx="50" cy="44" r="3.5" fill="#F5B82E"/>`,
cake:()=>`
<ellipse cx="50" cy="97" rx="44" ry="5" fill="#fff" stroke="#E8DCD0" stroke-width="1.5"/>
<rect x="12" y="62" width="76" height="34" rx="7" fill="#FFF1E0"/>
<path d="M12 70 Q12 62 20 62 H80 Q88 62 88 70 Q84 76 80 70 Q76 78 70 70 Q64 78 58 70 Q52 78 46 70 Q40 78 34 70 Q28 78 22 70 Q16 76 12 70Z" fill="#F7A8B8"/>
${[[20,84,'#8CC7E0'],[32,88,'#FFD34E'],[46,83,'#9BD483'],[60,88,'#8CC7E0'],[74,84,'#F3A65A']].map(([x,y,c])=>`<path d="M${x} ${y} l4 -2" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`).join('')}
<rect x="24" y="38" width="52" height="26" rx="6" fill="#FFE3EC"/>
<path d="M24 45 Q24 38 30 38 H70 Q76 38 76 45 Q72 50 68 45 Q63 51 58 45 Q53 51 48 45 Q43 51 38 45 Q33 51 28 45Z" fill="#fff"/>
<circle cx="33" cy="36" r="5" fill="#E5534B"/><circle cx="67" cy="36" r="5" fill="#E5534B"/>
<path d="M31 31 l2 2 l2 -2 M65 31 l2 2 l2 -2" stroke="#4FA36B" stroke-width="2" fill="none"/>`,
candle:()=>`
<rect x="44" y="52" width="12" height="46" rx="3" fill="#8CC7E0"/>
<path d="M44 60 L56 54 M44 70 L56 64 M44 80 L56 74 M44 90 L56 84" stroke="#fff" stroke-width="3"/>
<path d="M50 52 V44" stroke="${INK}" stroke-width="1.6"/>
<g class="flame"><circle cx="50" cy="34" r="15" fill="#FFE38A" opacity=".35"/><path d="M50 18 Q61 33 50 45 Q39 33 50 18Z" fill="#FFAE3B"/><path d="M50 28 Q55 36 50 42 Q45 36 50 28Z" fill="#FFE68A"/></g>
<g class="smoke"><path d="M50 42 q-6 -8 0 -14 q6 -6 0 -14" stroke="#BDBDBD" stroke-width="3" fill="none" stroke-linecap="round"/></g>`,
egg:()=>`
<path d="M24 66 L32 58 L40 66 L48 56 L56 66 L64 58 L72 66 L76 64 Q80 100 50 100 Q20 100 24 66Z" fill="#FFF7E6" stroke="#EADBC0" stroke-width="1.5"/>
<circle cx="38" cy="82" r="4" fill="#F5C98A"/><circle cx="58" cy="88" r="3" fill="#F5C98A"/><circle cx="62" cy="74" r="2.5" fill="#F5C98A"/>
<path d="M80 93 L85 87 L90 93 Q91 99 85 99 Q79 99 80 93Z" fill="#FFF7E6" stroke="#EADBC0"/>`,
zzz:()=>`<g fill="#FFE79A" font-family="Jua,sans-serif"><text x="14" y="88" font-size="24">z</text><text x="36" y="66" font-size="32">z</text><text x="60" y="40" font-size="42">Z</text></g>`
};
function dino(sleep:boolean){return `
<path d="M6 66 Q18 56 34 60 L36 82 Q18 80 6 66Z" fill="#7BC47F"/>
<rect x="34" y="78" width="11" height="20" rx="5" fill="#68B26D"/><rect x="52" y="78" width="11" height="20" rx="5" fill="#68B26D"/>
<path d="M24 59 L28 50 L32 57Z M32 55 L36 46 L40 53Z M40 52 L44 43 L48 50Z" fill="#F5A44A"/>
<ellipse cx="46" cy="68" rx="21" ry="18" fill="#7BC47F"/><ellipse cx="52" cy="73" rx="12" ry="12" fill="#D7F0BE"/>
<circle cx="33" cy="64" r="3" fill="#64AE69"/><circle cx="39" cy="75" r="2.2" fill="#64AE69"/><circle cx="16" cy="66" r="2" fill="#64AE69"/>
<path d="M62 63 q7 1 9 -4" stroke="#68B26D" stroke-width="4.5" fill="none" stroke-linecap="round"/>
<path d="M52 44 Q54 56 60 58 L48 60Z" fill="#7BC47F"/>
<rect x="48" y="22" width="40" height="30" rx="15" fill="#7BC47F"/>
<path d="M64 44 Q75 50 86 42" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M71 46.6 l2 3 l2 -3.2Z" fill="#fff"/>
<circle cx="83" cy="31" r="1.4" fill="#4F8F54"/>
${sleep?shut(64,34):`<circle cx="64" cy="33" r="5" fill="#fff"/><circle cx="65.5" cy="33.5" r="3" fill="${INK}"/><circle cx="66.6" cy="32.3" r="1.1" fill="#fff"/>`}
${cheek(72,40)}`}

export const SKY:Record<string,()=>string>={
sun:()=>`${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<line x1="${(50+31*Math.cos(a)).toFixed(1)}" y1="${(50+31*Math.sin(a)).toFixed(1)}" x2="${(50+41*Math.cos(a)).toFixed(1)}" y2="${(50+41*Math.sin(a)).toFixed(1)}" stroke="#FFC22E" stroke-width="4.5" stroke-linecap="round"/>`}).join('')}
<circle cx="50" cy="50" r="25" fill="#FFD34E"/>${shut(42,47)}${shut(58,47)}${cheek(38,55)}${cheek(62,55)}${smile(50,57,9)}`,
sunset:()=>`<circle cx="50" cy="56" r="44" fill="#FFB36B" opacity=".3"/><circle cx="50" cy="56" r="32" fill="#FF9E5E"/>`,
cloud:()=>`<path d="M18 64 Q8 64 10 54 Q12 44 24 47 Q26 32 42 34 Q50 22 63 31 Q79 27 81 44 Q92 46 89 57 Q87 64 78 64Z" fill="#fff" opacity=".95"/><path d="M18 64 Q30 58 48 62 Q66 58 78 64Z" fill="#E6F0F7"/>`,
moon:()=>`<circle cx="52" cy="50" r="40" fill="#FFE79A" opacity=".15"/><path d="M62 14 A36 36 0 1 0 62 86 A28 28 0 1 1 62 14Z" fill="#FFE79A"/><path d="M33 48 q4 3 8 0" stroke="#C9A54A" stroke-width="2" fill="none" stroke-linecap="round"/>${cheek(36,56)}`,
stars:()=>star(20,30,9,'#FFE79A')+star(64,18,6,'#FFF4C2')+star(82,52,8,'#FFE79A')+star(42,64,5,'#FFF4C2'),
rainbow:()=>['#F28B82','#F7B267','#F9E07F','#A8D98A','#8CC7E0','#B39DDB'].map((c,i)=>`<path d="M${4+i*5} 86 A${46-i*5} ${46-i*5} 0 0 1 ${96-i*5} 86" stroke="${c}" stroke-width="5.4" fill="none"/>`).join('')+`<ellipse cx="12" cy="86" rx="14" ry="8" fill="#fff"/><ellipse cx="88" cy="86" rx="14" ry="8" fill="#fff"/>`,
balloons:()=>([[30,40,'#F28B82'],[52,28,'#FFD34E'],[72,42,'#8CC7E0']] as [number,number,string][]).map(([x,y,c])=>`<path d="M${x} ${y+14} Q${x+4} ${y+34} 52 96" stroke="#B9A9A0" stroke-width="1.2" fill="none"/><ellipse cx="${x}" cy="${y}" rx="11" ry="14" fill="${c}"/><ellipse cx="${x-4}" cy="${y-5}" rx="3" ry="4.5" fill="#fff" opacity=".55"/><path d="M${x-2} ${y+14} l2 3 l2 -3Z" fill="${c}"/>`).join('')
};

/* ---------- 배경 ---------- */
const skyRect=(u:string,a:string,b:string,c?:string)=>`<defs><linearGradient id="${u}s" x1="0" y1="-450" x2="0" y2="330" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${a}"/>${c?`<stop offset=".6" stop-color="${b}"/><stop offset="1" stop-color="${c}"/>`:`<stop offset="1" stop-color="${b}"/>`}</linearGradient></defs><rect x="-1400" y="-1600" width="3600" height="2600" fill="url(#${u}s)"/>`;
const hill=(y:number,amp:number,col:string,seed:number)=>{const r=rnd(seed);let d=`M-1400 ${y}`;for(let x=-1400;x<2200;x+=260){d+=` Q${x+130} ${(y-amp*r()).toFixed(0)} ${x+260} ${(y-amp*.3*r()).toFixed(0)}`}return `<path d="${d} V1200 H-1400Z" fill="${col}"/>`};
const tufts=(col:string,n:number,seed:number,y0=355,y1=440)=>{const r=rnd(seed);let s='';for(let i=0;i<n;i++){const x=(-60+r()*920).toFixed(0),y=(y0+r()*(y1-y0)).toFixed(0);s+=`<path d="M${x} ${y} l3 -9 l2 8 l3 -10 l2 10" stroke="${col}" stroke-width="2" fill="none" stroke-linecap="round"/>`}return s};
const flowers=(seed:number,n=9)=>{const r=rnd(seed);let s='';const cs=['#fff','#FFD1DC','#FFF2A8'];for(let i=0;i<n;i++){const x=(-40+r()*880).toFixed(0),y=(360+r()*80).toFixed(0);s+=`<circle cx="${x}" cy="${y}" r="4" fill="${cs[i%3]}"/><circle cx="${x}" cy="${y}" r="1.6" fill="#F5B82E"/>`}return s};
const pines=(y:number,h:number,col:string,step:number,seed:number)=>{const r=rnd(seed);let s='';for(let x=-1400;x<2200;x+=step){const hh=h*(.75+r()*.5);s+=`<path d="M${x} ${y} L${x+step*.55} ${(y-hh).toFixed(0)} L${x+step*1.1} ${y}Z" fill="${col}"/>`}return s};

export const BG:Record<string,(u:string)=>string>={
meadow:(u:string)=>skyRect(u,'#8FD0F2','#E9F7FF')+hill(290,70,'#BFE5AC',3)+hill(340,40,'#8FCB78',7)+tufts('#6BAE58',22,11)+flowers(5),
forest:(u:string)=>skyRect(u,'#BFE7D2','#F1FAF4')+pines(305,110,'#A7D3AE',70,2)+pines(330,150,'#79B383',95,9)+hill(345,20,'#66A86C',4)
  +`<path d="M250 460 Q380 370 410 340 Q440 370 570 460Z" fill="#D9C29A" opacity=".75"/>`+tufts('#4F8D55',20,13),
night:(u:string)=>{const r=rnd(17);let st='';for(let i=0;i<70;i++)st+=`<circle cx="${(-500+r()*1800).toFixed(0)}" cy="${(-500+r()*760).toFixed(0)}" r="${(.8+r()*1.6).toFixed(1)}" fill="#fff" opacity="${(.45+r()*.55).toFixed(2)}"/>`;
  let ff='';for(let i=0;i<7;i++)ff+=`<circle class="firefly" style="animation-delay:-${(r()*3).toFixed(1)}s" cx="${(40+r()*720).toFixed(0)}" cy="${(330+r()*90).toFixed(0)}" r="2.6" fill="#FFE38A"/>`;
  return skyRect(u,'#151E46','#46558F')+st+hill(295,60,'#2F3D6D',5)+hill(345,30,'#243058',8)+tufts('#1C2648',18,19)+ff},
house:(u:string)=>skyRect(u,'#FFD9A3','#FFF4E2')+hill(285,90,'#EBCDA6',21)+hill(320,50,'#DDB98A',23)+hill(350,15,'#CFA36F',25)
  +Array.from({length:10},(_,i)=>`<rect x="${560+i*24}" y="318" width="6" height="34" rx="2" fill="#A0703F"/>`).join('')+`<path d="M556 328 H800 M556 342 H800" stroke="#A0703F" stroke-width="3"/>`+tufts('#B48552',14,27),
sky:(u:string)=>{const r=rnd(31);let c='';for(let i=0;i<7;i++){const x=(-200+r()*1200).toFixed(0),y=(20+r()*240).toFixed(0),s=(.6+r()*.9).toFixed(2);c+=`<g transform="translate(${x} ${y}) scale(${s})" opacity=".85">${SKY.cloud()}</g>`}
  let d='M-1400 400';for(let x=-1400;x<2200;x+=90)d+=` Q${x+45} ${340+((x/90)%2?10:0)} ${x+90} 392`;
  return skyRect(u,'#FFC488','#F9AFAF','#C9B8F2')+c+`<path d="${d} V1200 H-1400Z" fill="#fff" opacity=".95"/>`},
volcano:(u:string)=>skyRect(u,'#FFCFA6','#FFF2E2')
  +`<circle cx="508" cy="70" r="20" fill="#E9DCD3"/><circle cx="530" cy="44" r="15" fill="#EFE5DD"/><circle cx="512" cy="20" r="11" fill="#F3ECE6"/>`
  +`<path d="M320 305 Q420 205 472 112 L540 112 Q596 205 700 305Z" fill="#A9806E"/><path d="M506 112 L540 112 Q596 205 700 305 L560 305 Q560 200 506 112Z" fill="#93695A"/>`
  +`<path d="M472 112 Q506 126 540 112 L533 134 Q522 122 511 144 Q500 124 482 134Z" fill="#F0703F"/>`
  +hill(305,40,'#C3E0A4',33)+hill(345,25,'#8FC26E',35)
  +`<path d="M40 420 Q50 360 30 330 M40 420 Q60 370 84 350 M40 420 Q30 380 4 372" stroke="#5E9F62" stroke-width="6" fill="none" stroke-linecap="round"/>`
  +`<path d="M770 420 Q760 370 780 340 M770 420 Q750 380 726 366" stroke="#5E9F62" stroke-width="6" fill="none" stroke-linecap="round"/>`+tufts('#6BA556',16,37),
party:(u:string)=>{const cols=['#F7A8B8','#FFD34E','#8CC7E0','#9BD483','#F3A65A'];let b='';for(let i=0;i<=16;i++){const t=i/16,x=(1-t)*(1-t)*-80+2*(1-t)*t*400+t*t*880,y=(1-t)*(1-t)*40+2*(1-t)*t*150+t*t*40,d=2*(1-t)*(400+80)+2*t*(880-400),e=2*(1-t)*(150-40)+2*t*(40-150),l=Math.hypot(d,e),nx=-e/l,ny=d/l;
    b+=`<path d="M${(x-d/l*14).toFixed(0)} ${(y-e/l*14).toFixed(0)} L${(x+d/l*14).toFixed(0)} ${(y+e/l*14).toFixed(0)} L${(x+nx*30).toFixed(0)} ${(y+ny*30).toFixed(0)}Z" fill="${cols[i%5]}"/>`}
  const r=rnd(41);let cf2='';for(let i=0;i<24;i++){const x=(r()*800).toFixed(0),y=(345+r()*95).toFixed(0);cf2+=`<rect x="${x}" y="${y}" width="7" height="3" rx="1" fill="${cols[i%5]}" transform="rotate(${(r()*180).toFixed(0)} ${x} ${y})"/>`}
  return skyRect(u,'#FFD3E0','#FFF6F9')+`<path d="M-80 40 Q400 260 880 40" stroke="#C98FA0" stroke-width="2" fill="none"/>`+b+hill(330,30,'#BFE3A6',43)+hill(355,15,'#A9D78E',45)+cf2}
};

let UID=0;
/** 'em:🐶'처럼 쓰면 기기의 이모지 글꼴로 그려요 (SVG 그림이 없는 단어용) */
const esc=(t:string)=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]!));
export const isActor=(n:string)=>n in ACT||(n.startsWith('em:')&&n.length>3&&n.length<=12);
const drawActor=(n:string,u:string)=>n.startsWith('em:')
  ?`<text x="50" y="86" font-size="84" text-anchor="middle">${esc(n.slice(3))}</text>`
  :(ACT[n]??ACT.dino)(u);
const W:Record<string,number>={straw:100,wood:100,brick:100,hut:100,tree:100,brachio:100,cake:96,rope:40,candle:36,egg:80,gift:72,basketFull:70,basketEmpty:70,sorghum:80,ptero:96,wolf:96,tiger:96,dino:92,dinoSleep:92,zzz:70};
const NOIDLE=new Set(['straw','wood','brick','hut','tree','rope','sorghum','basketFull','basketEmpty','gift','cake','candle','egg']);
const NOSHADOW=new Set(['rope','ptero','zzz']);

export function sceneSVG(pg:Page){
  const u='g'+(++UID);
  let s=`<svg class="art" viewBox="0 0 800 450" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">`+BG[pg.bg](u);
  const sky=pg.sky||[], k=sky.length, xs=k===1?[650]:k===2?[150,650]:[130,400,670];
  sky.forEach((n,i)=>{const sc=n==='stars'?1.4:1.15;s+=`<g transform="translate(${xs[i]-50*sc} ${60-50*sc}) scale(${sc})"><g class="drift" style="animation-delay:-${i*2}s">${SKY[n]()}</g></g>`});
  type Item={n:string,s:number,lift:number,x?:number,cx:number,sc:number};
  const K=1.25, items:Item[]=pg.art.map(a=>({n:a[0],s:(a[1]||1)*K,lift:(a[2]||0)*K,x:a[3],cx:0,sc:1}));
  const auto=items.filter(it=>it.x===undefined);
  const T=auto.reduce((t,it)=>t+(W[it.n]||88)*it.s,0), avail=760, f=T>avail?avail/T:1;
  const gap=(avail-T*f)/(auto.length+1); let cx=20+gap;
  auto.forEach(it=>{const w=(W[it.n]||88)*it.s*f; it.cx=cx+w/2; it.sc=it.s*f; cx+=w+gap;});
  items.forEach(it=>{ if(it.x!==undefined){it.cx=it.x; it.sc=it.s;} });
  items.forEach((it,i)=>{
    const sc=it.sc, tx=it.cx-50*sc, ty=405-100*sc-it.lift;
    if(!NOSHADOW.has(it.n)&&!it.lift) s+=`<ellipse cx="${it.cx.toFixed(0)}" cy="406" rx="${((W[it.n]||88)*sc*.38).toFixed(0)}" ry="6" fill="#000" opacity=".12"/>`;
    s+=`<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${sc.toFixed(3)})"><g class="actor" data-i="${i}"><g class="${NOIDLE.has(it.n)?'':'idle'}" style="animation-delay:-${(i*.7).toFixed(1)}s">${drawActor(it.n,u+'a'+i)}</g></g></g>`;
  });
  return s+'</svg>';
}
export const iconSVG=(name:string)=>`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${ACT[name]('ic'+(++UID))}</svg>`;

