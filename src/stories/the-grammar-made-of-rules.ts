import type { Story } from '../types';

export const theGrammarMadeOfRules: Story = {
  slug: 'the-grammar-made-of-rules',
  title: 'The Grammar Made of Rules',
  subtitle: 'Long ago in Gandhara, a scholar named Panini builds every word rule by rule.',
  domain: 'patterns',
  collection: 'historical',
  repeatedPhrase: 'One small rule, then the next',
  readAloudMinutes: 9,
  learningTakeaway:
    'A correct word can be built by following one clear rule at a time. When you add small pieces in the right order, the shape comes out right, and you can always check each step. Whole systems of language can be described by a small set of tidy patterns.',
  heartTakeaway:
    'Being careful does not mean never slipping. It means you can pause, look again, and mend one small mistake without feeling ashamed.',
  grownUpFact:
    'Panini was a real scholar traditionally placed in the town of Shalatura in Gandhara, in the northwest of the Indian subcontinent near the Indus river, often dated to around the 5th to 4th century BCE. He composed the Ashtadhyayi, or "Eight Chapters," a grammar of Sanskrit built from just under 4,000 short rules called sutras. His system derives each word from a root by applying ordered rules that add endings and make changes in a fixed sequence. It opens with the Shiva Sutras, a compact arrangement of sounds that lets him name whole groups of sounds at once using markers, a device called pratyahara; the legend that these sounds came from a god’s drum is a tale, while the sound-list itself is a real feature. Scholars often compare his precise, generative, rule-based method to modern ideas in linguistics and computer science, such as formal grammars and Backus–Naur form, though that is an analogy across many centuries, not a direct historical link.',
  pages: [
    {
      text: 'Long ago, near the wide Indus river, stood a town called Shalatura. There lived a scholar named Panini, and he loved words more than anything. Most people used words without a thought. Panini wanted to know how each word was truly made. He believed every word grew from a small root, like a plant from a seed. To grow it correctly, you followed rules, in order, without skipping. "One small rule, then the next," he liked to say. That, he was sure, was the secret shape of language.',
      cue: 'Point to the little word-root. Can you find where a word begins before it grows?',
      scene: {
        id: 'the-grammar-made-of-rules-p1-invitation',
        focus: 'Panini as a scholar beside small clay tokens for word-roots and endings',
        composition:
          'Foreground: small clay tokens for word-roots and endings laid in a neat row; midground: Panini kneeling, studying the tokens with quiet delight; background: a shaded courtyard in Shalatura near the Indus at golden hour',
        palette: 'saffron, indigo, leaf green and warm river stone',
      },
      alt: 'A scholar kneels beside a row of small clay tokens in a courtyard near a wide river at golden hour.',
    },
    {
      text: 'Panini picked up one little root token. A root is the tiny heart of a word, before it grows. By itself it meant almost nothing at all. But add the right endings, in the right order, and it woke up. He set two ending tokens beside it in a clear row. One ending meant a single thing. The other ending meant many things. The very same root could become one, or become many, just by its ending.',
      cue: 'Say a word for one bird, then for many birds. Can you hear how the ending changes?',
      scene: {
        id: 'the-grammar-made-of-rules-p2-root',
        focus: 'Panini placing one root token beside two ending tokens',
        composition:
          'Foreground: one root token and two ending tokens in two clear columns, one marked single and one marked many; midground: Panini pointing thoughtfully; background: courtyard pillars and a low warm sun',
        palette: 'cobalt, marigold and sandstone',
      },
      alt: 'A scholar points to two ending tokens beside a single root token, courtyard pillars behind them.',
    },
    {
      text: 'Panini chose the single ending and set it after the root. Tap. Now the word meant one. He lifted it away and chose the many ending instead. Tap. Now the very same root meant many. He smiled at the neat little trick of it. A small piece added at the end changed the whole meaning. He did not guess; he followed the rule and then checked. Say the word, hear its pattern, and see if it fits.',
      scene: {
        id: 'the-grammar-made-of-rules-p3-endings',
        focus: 'Panini swapping the single ending for the many ending after a root',
        composition:
          'Foreground: a root token with an ending being lifted away and a second ending set in its place; midground: Panini watching the change with care; background: warm afternoon courtyard light',
        palette: 'turquoise, gold and rose dusk',
      },
      alt: 'A scholar swaps one small ending token for another beside a root token as afternoon light warms the courtyard.',
    },
    {
      text: 'Next Panini wanted an action inside the word. The word was for singing, so he added the singing piece in its own place. Root, then ending, then action: a tidy row, each piece in order. "One small rule, then the next," he whispered. He never jumped ahead, and he never skipped a step. Each rule waited its turn, like children lining up. The finished word matched the exact pattern he had spoken aloud. Order was everything, he thought.',
      scene: {
        id: 'the-grammar-made-of-rules-p4-order',
        focus: 'a short ordered row of tokens forming one correct word',
        composition:
          'Foreground: three aligned tokens for root, ending and action in a fixed left-to-right order; midground: Panini straightening the row with care; background: long soft courtyard shadows',
        palette: 'amber, gold and rose dusk',
      },
      alt: 'Three tokens sit aligned in a fixed order as a scholar straightens them, long shadows across the courtyard.',
    },
    {
      text: 'Panini had a bolder idea, one that made his heart race. Sanskrit has many, many sounds, and rules keep naming them. Writing out long lists of sounds every time was slow and clumsy. So he lined up all the sounds in one clever secret order. Then, with a single marker, he could point at a whole group at once. One tiny label stood for many sounds together, like a nickname for a crowd. It was the neatest shortcut he had ever built.',
      cue: 'Line up your toys, then give the whole line one team name. How much shorter is that to say?',
      scene: {
        id: 'the-grammar-made-of-rules-p5-shortcut',
        focus: 'Panini arranging sound tokens in a special order with one marker at the end of a group',
        composition:
          'Foreground: a long careful line of sound tokens with a single bright marker token capping one group; midground: Panini smiling at his clever ordering; background: a scholar’s courtyard with palm leaves and low sun',
        palette: 'marigold, deep teal and warm stone',
      },
      alt: 'A scholar arranges a long ordered line of sound tokens with one bright marker capping a group.',
    },
    {
      text: 'People told a happy old tale about those sounds. They said a great dancing god beat a drum, and the sounds tumbled out in order. That is only a story, spun long after, warm as a fireside. What is truly real is Panini’s careful list, arranged by his own patient mind. Real or legend, the little tale helped children remember the order. Panini did not mind a good story, so long as the rules underneath stayed exactly right.',
      scene: {
        id: 'the-grammar-made-of-rules-p6-legend',
        focus: 'a storyteller gesturing while Panini keeps his ordered sound tokens tidy',
        composition:
          'Foreground: the neat line of sound tokens glowing softly; midground: an elder telling a lively tale with a small drum while Panini listens; background: evening courtyard with a few gathered listeners',
        palette: 'lamp amber, plum and quiet blue',
      },
      alt: 'An elder mimes a drum tale while a scholar keeps his ordered line of sound tokens neatly in place.',
    },
    {
      text: 'Now Panini tested himself with a harder word: many, and sleeping. He hurried, because he felt so clever and quick. He chose the many ending well, but grabbed the singing piece by mistake. The row looked almost right. But almost was not quite right, and he knew it. His cheeks grew warm and pink. He wanted to sweep the tokens away and pretend it never happened. Nobody had scolded him, yet he still felt small.',
      cue: 'Look at the little row. Which piece does not belong with the sleeping word?',
      scene: {
        id: 'the-grammar-made-of-rules-p7-slip',
        focus: 'Panini noticing one wrong piece in an almost-correct word',
        composition:
          'Foreground: a row with the many ending, the wrong singing piece, and the root, one piece clearly out of place; midground: Panini pausing with warm cheeks; background: quiet courtyard as evening deepens',
        palette: 'gloaming violet, soft gold and muted teal',
      },
      alt: 'A scholar pauses at a nearly finished row of tokens where one piece is out of place, evening deepening behind him.',
    },
    {
      text: 'Panini took one slow breath and checked from the very start. Many: yes, the many ending was right. Sleeping: no, that was the singing piece, not the sleeping one. He swapped just one token. Flip. Now every piece followed its own rule, in the right pattern. "One small rule, then the next." He felt his shoulders soften. Careful work did not mean never slipping. It meant knowing how to find one small mistake and gently mend it.',
      scene: {
        id: 'the-grammar-made-of-rules-p8-mend',
        focus: 'Panini replacing the singing piece with the sleeping piece',
        composition:
          'Foreground: the correct sleeping token lifted above the gap in the row; midground: Panini calmly fixing one spot; background: first oil lamps glowing under the eaves',
        palette: 'lamp amber, plum and quiet blue',
      },
      alt: 'A scholar lifts one correct token above a gap in his row as lamps begin to glow under the eaves.',
    },
    {
      text: 'From that day, Panini gathered his rules into eight great chapters. Nearly four thousand short rules filled them, each one tiny and exact. He named them sutras, which means threads, because they sewed the whole language together. Every word in Sanskrit could be built by these threads, in order. Root, ending, sound, and change, each rule handing the word to the next. It was a machine made of nothing but rules, and it truly worked. He called the whole book the Ashtadhyayi.',
      scene: {
        id: 'the-grammar-made-of-rules-p9-book',
        focus: 'Panini arranging many small rule-threads into eight ordered groups',
        composition:
          'Foreground: eight neat bundles of thin thread-like strips, each holding rows of tiny marks; midground: Panini laying them in careful order; background: a lamplit study with palm-leaf sheets and quiet shelves',
        palette: 'moon blue, ochre and calm cream',
      },
      alt: 'A scholar arranges eight neat bundles of thin rule-threads in careful order in a lamplit study.',
    },
    {
      text: 'Think how amazing that truly is. With one small set of rules, you can build countless words. You never memorize every word one by one, like a giant pile. Instead you learn the patterns, and the patterns make the words for you. A short list of rules holds a whole ocean of language inside it. Panini had found how a few clear steps could hold so very much. "One small rule, then the next," he said, wonder in his voice.',
      cue: 'Wonder together: with just a few blocks, how many different towers could you build?',
      scene: {
        id: 'the-grammar-made-of-rules-p10-wonder',
        focus: 'a few rule-threads on one side and a wide fan of many built words on the other',
        composition:
          'Foreground: a small cluster of rule tokens; midground: a wide spreading fan of many finished word-rows blooming from them; background: a warm study glowing at night',
        palette: 'saffron, indigo and warm cream',
      },
      alt: 'A small cluster of rule tokens fans out into many finished word-rows across a warm, glowing study.',
    },
    {
      text: 'Panini could not know how far his threads would travel. Long after him, scholars still study the Ashtadhyayi, marveling at its neat design. Even builders of computers found something familiar in his method. They too write short rules that a machine follows in order, step by step. They too build big things from small, exact pieces, checking each one. Panini’s patient patterns, spun near the Indus, still whisper to thinkers today. A good idea, it seems, never really grows old.',
      scene: {
        id: 'the-grammar-made-of-rules-p11-legacy',
        focus: 'Panini’s ordered rules echoed in later scholars and simple rule-following machines',
        composition:
          'Foreground: Panini’s row of tokens; midground: soft dreamlike shapes of later scholars and a simple gridded rule-machine echoing the same order; background: a wide night sky over the Indus with first stars',
        palette: 'twilight violet, warm lamp-gold and river blue',
      },
      alt: 'A scholar’s ordered tokens echo softly into later thinkers and a simple gridded rule-machine under a starry sky.',
    },
    {
      text: 'The tokens went back into their soft cloth bag at last. No words needed building now, and the courtyard was calm. Panini rested near the open window while leaves made soft shadows on the wall. In his mind, one rule settled, then the next, then all were still. His careful thoughts could rest after careful work. Somewhere out in the world, tonight, someone is speaking a word he built. And Panini smiled, for a rule made with care lasts a very long time.',
      scene: {
        id: 'the-grammar-made-of-rules-p12-rest',
        focus: 'Panini resting peacefully while the token bag sits below the window',
        composition:
          'Foreground: a closed cloth token bag and a crescent leaf shadow; midground: Panini seated in calm rest with eyes soft and closed; background: moonlit courtyard trees in Shalatura near the Indus',
        palette: 'deep indigo, muted saffron and silver green',
      },
      alt: 'A scholar rests peacefully as a closed cloth bag sits below the window and a crescent leaf shadow falls on the wall.',
    },
  ],
};
