import GridMotion from './GridMotion';


export default function GridImages ()
 {


// note: you'll need to make sure the parent container of this component is sized properly
const items = [
  'https://i.pinimg.com/736x/c4/12/99/c412990512c2ed25e668999d270b535c.jpg',
  'https://i.pinimg.com/736x/95/2a/55/952a5521f42e0abdb47a1ef0914741ec.jpg',
  'https://i.pinimg.com/736x/d1/8f/7f/d18f7fe81399259c58505f4599a13d9c.jpg',
  'https://i.pinimg.com/736x/c7/ac/36/c7ac3692303ba1bb862a9f8d5094a284.jpg',
  'https://i.pinimg.com/736x/8a/d3/27/8ad327838a827a5319198d49d52389ad.jpg',
  'https://i.pinimg.com/736x/30/41/70/3041709e31c9f8fca311fa00b9a4b25c.jpg',
  'https://i.pinimg.com/736x/63/05/38/630538280c3b4ecbdfe55583ecce8f76.jpg',
  'https://i.pinimg.com/736x/ec/d8/64/ecd8642111ad8b33ba1a1169ee1d4302.jpg',
  'https://i.pinimg.com/736x/e4/6a/e3/e46ae37c500420d5a769e98d791bdea4.jpg',
  'https://i.pinimg.com/736x/d6/43/f7/d643f7e938b410c4e62ffe91b54afe9f.jpg',
  'https://i.pinimg.com/736x/cf/5c/6c/cf5c6c77445881ead407790398d32c2e.jpg',
  'https://i.pinimg.com/736x/1f/6e/6c/1f6e6cb0757df7ea473b2f273401a2a2.jpg',
  'https://i.pinimg.com/736x/c5/b3/82/c5b3828298a2148c1e35093a8d325218.jpg',
  'https://i.pinimg.com/736x/4e/e9/60/4ee960f8bfdbfe52185bdf589b1b3a00.jpg',
  'https://i.pinimg.com/736x/51/a2/c2/51a2c232b9ae0b887552846dbea8bb41.jpg',
  'https://i.pinimg.com/736x/e2/48/05/e24805e01bdc371cf03661ea1e597ca7.jpg',
  'https://i.pinimg.com/736x/50/9c/c3/509cc3c650c9555cd94f945db0280d0f.jpg',
  'https://i.pinimg.com/736x/f8/8f/78/f88f7822e591ea3cf8dbe2e480f1cc61.jpg',
  'https://i.pinimg.com/736x/08/d7/de/08d7decef05769e09b1e53b2a3ae2b8e.jpg',
  'https://i.pinimg.com/736x/98/8d/63/988d6316e018456b668f6048856894ea.jpg',
  'https://i.pinimg.com/736x/18/d9/67/18d9676a690c34f1eb0bda426b194a40.jpg',
  'https://i.pinimg.com/736x/ff/50/2c/ff502cc84b0382929d0b3ffdf693581d.jpg',
  'https://i.pinimg.com/736x/c8/58/32/c858323f2e4a9012fde30150da454e5f.jpg',
  'https://i.pinimg.com/736x/8c/ad/2c/8cad2c25514f062e830104041ed483b8.jpg',
  'https://i.pinimg.com/736x/30/41/70/3041709e31c9f8fca311fa00b9a4b25c.jpg',
  'https://i.pinimg.com/736x/63/05/38/630538280c3b4ecbdfe55583ecce8f76.jpg',
  'https://i.pinimg.com/736x/ec/d8/64/ecd8642111ad8b33ba1a1169ee1d4302.jpg',
  'https://i.pinimg.com/736x/98/8d/63/988d6316e018456b668f6048856894ea.jpg',
  'https://i.pinimg.com/736x/18/d9/67/18d9676a690c34f1eb0bda426b194a40.jpg',
  'https://i.pinimg.com/736x/ff/50/2c/ff502cc84b0382929d0b3ffdf693581d.jpg',
  
  // Add more items as needed
];

return (<GridMotion items={items} />)
} 