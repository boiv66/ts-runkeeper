const sentimentData = [
  { bad: -2 }, 
  { worst: -5 },
  { tired: -2 },
  { tough: -2 },
  { fuck: -2 },
  { cold: -1 },
  { typhoon: -1 },
  { serverly: -2 },
  { inebriated: -2 },
  { congested: -2 },
  { stop: -1 },
  { consecutive: 1 },
  { "in a row": 1 },
  { pb: 4 },
  { nice: 4 },
  { awesome: 5 },
  { good: 3 },
  { burner: 1 },
  { great: 5 },
  { complete: 1 },
  { streak: 1 },
  { challenge: 1 },
  { fast: 1 },
  { warm: 1 },
  { perfect: 4 },
  { love: 4 },
  { better: 4 },
  { best: 4 },
  { glad: 3 },
  { cool: 2 },
  { first: 2 },
  { "1st": 2 },
  { off: -1 },
  { second: 2 },
  { keep: 1 },
  { bien: 1 },
  { right: 1 },
  { super: 1 },
  { pleas: 3 },
  { lost: -2 },
  { beautiful: 3 },
  { done: 2 },
  { straight: 1 },
  { unfortunate: -2 },
  { brtual: -2 },
  { excuse: -1 },
  { stress: -2 },
  { hot: -1 },
  { hurt: -2 },
  { ready: 2 },
  { yea: 3 },
  { qucik: 2 },
  { smooth: 2 },
  { clear: 2 },
  { fun: 2 },
  { relax: 2 },
  { easy: 1 },
  { gloroius: 1 },
  { rejoice: 2 },
  { enjoy: 2 },
  { yes: 2 },
  { strong: 2 },
  { ok: 1 },
  { high: 1 },
  { angrer: -3 },
  { humid: -1 },
  { ruin: -2 },
  { delay: -1 },
  { dark: -1 },
  { slow: -2 },
  { yay: 2 },
  { wow: 3 },
  { gorgeous: 3 },
  { chill: 1 },
  { pray: 2 },
  { like: 1 },
  { fresh: 2 },
  { "morning run": 1 },
  { early: 1 },
  { improve: 1 },
  { fine: 1 },
  { colorfull: 2 },
  { thank: 1 },
  { amazing: 3 },
  { fantastic: 3 },
  { happy: 3 },
  { gentle: 1 },
  { joy: 2 },
  { goal: 2 },
  { sucked: -2 },
  { wet: -1 },
  { blowout: -3 },
  { rain: -1 },
  { bother: -1 },
  { negative: -2 },
];
const sentimentArray = Array(26);
for (let i = 0; i < sentimentArray.length; i++){
  sentimentArray[i] = new Array(); 
}

function getHashKey(first_letter) {
  // console.log((first_letter.charCodeAt(0) - 97) % 26);
  const index = (first_letter.charCodeAt(0) - 97) % 26; 

  if (index < 0){
    return -index;
  }
  return index; 
}
function getSetiment() {
  sentimentData.forEach((sentiment) => {
    const key = Object.keys(sentiment)[0];
    // console.log(key[0]);
    const index = getHashKey(key[0]);
    const obj = {};
    obj[key] = sentiment[key];
    // console.log(key); 
    
    sentimentArray[index].push(obj);
  });
  return sentimentArray;
}
