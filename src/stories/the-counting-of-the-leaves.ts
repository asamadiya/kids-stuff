import type { Story } from '../types';

export const theCountingOfTheLeaves: Story = {
  slug: 'the-counting-of-the-leaves',
  title: 'The Counting of the Leaves',
  subtitle:
    'A tale of King Rituparna of Ayodhya, who guessed a whole tree from one small branch.',
  domain: 'measurement',
  collection: 'historical',
  repeatedPhrase: 'One small branch gives a clue',
  readAloudMinutes: 9,
  learningTakeaway:
    'You can count the leaves on one small branch, then multiply by how many branches there are, to estimate the whole big tree. This is called sampling: measure one small part, then use it to guess the larger whole without counting every single thing.',
  heartTakeaway:
    'You do not always need a perfect answer. An honest, careful estimate can be enough, and it is kind and wise to say when you are not exactly sure.',
  grownUpFact:
    'This is a gentle retelling from the Mahabharata, an ancient Indian epic. In the Nala episode (Nalopakhyana, in the Vana Parva), King Rituparna of Ayodhya rides with King Nala of Nishadha toward Vidarbha. Passing a Vibhitaka (bahera) tree, Rituparna astonishes Nala by naming, almost instantly, how many leaves and fruit it holds. Amazed, Nala doubts him, so they count to check, and Rituparna proves nearly exact. The two kings then trade secret knowledge: Rituparna teaches Nala the aksha-hridaya, the "heart of the dice" (skill with numbers and chance), while Nala teaches Rituparna the art of horses. The epic tells the wonder but not the method. Estimating a whole tree from one branch, called sampling, is a friendly, historically plausible way to imagine how such a lightning-fast guess could begin, and it is a real technique scientists still use today to count leaves, stars, fish, and even votes.',
  pages: [
    {
      text: 'Long ago in old India, storytellers told of a king named Rituparna of Ayodhya. He loved counting more than gold or jewels. One evening he rode fast with his friend, King Nala, hurrying toward a faraway land called Vidarbha. They needed to arrive before sunrise. As their chariot rushed along, a great, leafy tree flew past. Its branches spread wide against the pink sky. "One small branch gives a clue," Rituparna said softly, glancing up.',
      cue: 'Look up, like the two kings. Can you find one small branch on a big tree near you?',
      scene: {
        id: 'the-counting-of-the-leaves-p1-epic-tree',
        focus: 'King Rituparna and King Nala racing past a vast leafy Vibhitaka tree in a chariot',
        composition:
          'Foreground: one low leafy twig rushing by; midground: Rituparna and Nala in a swift chariot glancing up; background: an old Indian road and soft hills in golden evening light',
        palette: 'leaf green, mango gold, bark brown, and sunset rose',
      },
      alt: 'Two kings in old Indian robes ride a chariot past a great leafy tree while one small twig fills the foreground.',
    },
    {
      text: 'The tree was a Vibhitaka, which people also call bahera. It grew tall beside the road, older than the kings themselves. Rituparna looked at it the way you look at a friend. In one quick breath, he spoke a wonder. "That tree holds many thousands of leaves," he said. "And this many fruit, hanging in the shade." Nala turned his head and stared. How could anyone know such a thing so fast?',
      cue: 'Guess: how many leaves do you think are on a whole big tree? A hundred? A thousand? More?',
      scene: {
        id: 'the-counting-of-the-leaves-p2-vibhitaka-named',
        focus: 'the towering Vibhitaka tree heavy with leaves and small round fruit',
        composition:
          'Foreground: clusters of round bahera fruit among leaves; midground: Rituparna pointing calmly while Nala looks astonished; background: the wide crown of the ancient tree against dusk',
        palette: 'deep green, tawny gold, ripe brown, and soft rose',
      },
      alt: 'A king points calmly at a towering fruit-laden tree while his friend stares in astonishment.',
    },
    {
      text: '"You are teasing me," laughed Nala. "No one can count a whole tree in a heartbeat." Rituparna only smiled and stepped down from the chariot. "Then let us check together," he said kindly. "I did not count every leaf, my friend. I looked closely at one small part." He reached up and chose a single low twig. "One small branch gives a clue," he said again, brushing its leaves.',
      scene: {
        id: 'the-counting-of-the-leaves-p3-the-doubt',
        focus: 'Nala laughing in disbelief as Rituparna steps down to prove his guess',
        composition:
          'Foreground: Rituparna reaching for one low leafy twig; midground: Nala with a doubtful, playful grin; background: the halted chariot and the great trunk rising into twilight',
        palette: 'olive, jade, warm saffron, and sky blue',
      },
      alt: 'One king reaches for a low twig while his doubting friend laughs beside the stopped chariot.',
    },
    {
      text: 'Rituparna counted the leaves on that one twig, slow and sure. He touched only the air beside each leaf, so as not to bruise them. There were about the same number on the twig as you have fingers and toes, twice over. Nala counted the very same twig and nodded. "Yes," he agreed, "that is how many you have." One small twig was easy to measure. The whole tree had seemed impossible.',
      cue: 'Hold up all ten fingers, then imagine ten more toes. Count them slowly, one by one.',
      scene: {
        id: 'the-counting-of-the-leaves-p4-twig-count',
        focus: 'one carefully counted twig held gently between the two kings',
        composition:
          'Foreground: a close twig with fingers counting nearby; midground: Rituparna and Nala leaning in together; background: the larger tree softly blurred behind them',
        palette: 'fresh green, warm brown, saffron, and cream',
      },
      alt: 'A king counts the leaves on one small twig while his friend leans in to watch closely.',
    },
    {
      text: '"Now watch the secret," said Rituparna. "One twig is like its neighbors. Some hold a few more leaves, some a few less. But most are much alike." He waved his hand across the branch. "How many twigs on this one branch? And how many branches on the tree?" Nala began to see it. If you know one twig, and you know how many twigs there are, you can guess the whole.',
      scene: {
        id: 'the-counting-of-the-leaves-p5-the-secret',
        focus: 'Rituparna sweeping his hand across a branch full of similar twigs',
        composition:
          'Foreground: layered leafy twigs at different depths, all alike; midground: Rituparna gesturing while Nala studies the branch; background: the trunk splitting into many branches above',
        palette: 'olive, jade, muted saffron, and violet',
      },
      alt: 'A king sweeps his hand across a branch of similar twigs while his friend studies them.',
    },
    {
      text: 'Together they did the thinking, step by careful step. "One twig has twenty leaves," said Nala. "This branch has many twigs, more than I can quickly say." "So count the twigs, then add twenty for each one," Rituparna answered. "And count the branches, and do it again." Numbers stacked on numbers, small ones building into huge ones. "One small branch gives a clue," Nala whispered, wide-eyed at the mountain of leaves.',
      cue: 'If one twig has ten leaves, how many leaves are on two twigs? On three? Count up together.',
      scene: {
        id: 'the-counting-of-the-leaves-p6-multiplying',
        focus: 'the two kings working out the count branch by branch',
        composition:
          'Foreground: fingers tracing from twig to branch to trunk; midground: Rituparna and Nala counting eagerly; background: the full canopy fanning out above them',
        palette: 'soft green, dusk peach, bark brown, and linen cream',
      },
      alt: 'Two kings trace their fingers from twig to branch, building a big count from small ones.',
    },
    {
      text: 'A soft breeze stirred the canopy. Leaves overlapped, flashed, and hid from view. Nala tried to follow every single one, but his gaze soon tangled among the branches. "I could never count them all exactly," he admitted. Rituparna smiled. "You do not need exact," he said. "You need close and honest." The tree did not have to hold still for their careful guess to be useful. Swish went the restless leaves.',
      scene: {
        id: 'the-counting-of-the-leaves-p7-windy-canopy',
        focus: 'Nala gazing up at leaves moving in the breeze',
        composition:
          'Foreground: Nala’s thoughtful face at the lower edge; midground: overlapping leaves swaying and hiding; background: a soft dusk sky peeking through the canopy',
        palette: 'moving greens, pale gold, cloud white, and soft brown',
      },
      alt: 'A king looks thoughtfully up into a canopy of overlapping leaves moving in the breeze.',
    },
    {
      text: 'To be fair, they checked a second twig, then a third. Their small counts stayed close, just as Rituparna had said. That is the wise part of a good guess: you test your one small part more than once. If the twigs agree, your trust in the whole grows stronger. "Begin with what you can see," Rituparna said gently. Nala let go of needing a perfect answer, and he felt calm and clever.',
      cue: 'Which twigs look most alike? Why does checking more than one make a guess feel surer?',
      scene: {
        id: 'the-counting-of-the-leaves-p8-check-again',
        focus: 'the two kings checking a second and third twig to be sure',
        composition:
          'Foreground: three nearby twigs at different depths; midground: a quiet two-shot of the kings comparing counts; background: dusk settling deeper over the tree',
        palette: 'soft green, dusk peach, bark brown, and moonlit cream',
      },
      alt: 'Two kings compare a second and third twig, making their thoughtful guess surer together.',
    },
    {
      text: 'When their whole guess was done, Rituparna shook the branch, just a little. Down pattered some leaves and round fruit onto the grass. They gathered a handful and counted, then compared with his early word. His guess had been very, very close, almost exactly right. Nala clapped his hands in delight. "You truly can measure a tall tree from one small twig!" he cried. Rituparna bowed his head, honest and glad.',
      scene: {
        id: 'the-counting-of-the-leaves-p9-proof',
        focus: 'fallen leaves and fruit counted on the grass to prove the guess',
        composition:
          'Foreground: a small pile of counted leaves and round bahera fruit; midground: Nala clapping while Rituparna smiles humbly; background: the great tree glowing in last light',
        palette: 'amber, ripe brown, leaf green, and rosy dusk',
      },
      alt: 'The kings count fallen leaves and fruit on the grass, delighted the guess proved nearly exact.',
    },
    {
      text: 'Now here is a true and marvelous thing about Rituparna. The old epic says his gift with numbers was also his gift with dice. He knew the aksha-hridaya, the very "heart of the dice." That night, as thanks, he taught Nala this secret science of counting and chance. In return, Nala, a master of horses, taught the king how to make chariots fly. Two friends, trading their finest knowledge like gifts.',
      cue: 'What is something you know well that you could teach a friend? What could they teach you?',
      scene: {
        id: 'the-counting-of-the-leaves-p10-trade-of-gifts',
        focus: 'the two kings by firelight exchanging their secret knowledge',
        composition:
          'Foreground: small carved dice and a horse rein resting between them; midground: Rituparna and Nala talking warmly by a small fire; background: the dark tree and the first bright stars',
        palette: 'firelight orange, deep indigo, gold, and warm brown',
      },
      alt: 'By firelight two kings trade knowledge, with small dice and a horse rein resting between them.',
    },
    {
      text: 'Rituparna’s trick is older than old, yet people still use it today. When scientists want to count leaves on a forest, or fish in a lake, they do not count every one. They count a small patch closely, then multiply for the whole. They call it sampling, and it works just like one twig on a tree. "One small branch gives a clue," Rituparna would say, nodding at every careful counter across the years.',
      cue: 'Wonder together: how might you guess the blades of grass in a whole yard from one small patch?',
      scene: {
        id: 'the-counting-of-the-leaves-p11-legacy-today',
        focus: 'a dreamy montage of modern counters using the same one-branch idea',
        composition:
          'Foreground: the counted twig glowing softly; midground: faint dreamlike shapes of foresters, a lake with fish, and children counting a patch of grass; background: the ancient tree fading into a starry sky',
        palette: 'twilight violet, soft gold, water blue, and silver',
      },
      alt: 'The small counted twig glows as dreamy shapes show modern people counting forests, fish, and grass.',
    },
    {
      text: 'At last the two kings climbed back to their chariot to ride on. The Vibhitaka tree stood dark and tall behind them, its countless leaves a soft roof against the stars. Nala carried a new idea home in his heart, lighter than gold and worth much more. Tomorrow, wherever you go, look for one small branch, one small patch, one small part. Count it well. It will whisper the size of the whole wide world.',
      scene: {
        id: 'the-counting-of-the-leaves-p12-ride-on',
        focus: 'the kings riding onward beneath a starlit sky, the great tree behind',
        composition:
          'Foreground: the chariot rolling forward on the moonlit road; midground: Rituparna and Nala looking ahead with quiet wonder; background: the vast Vibhitaka tree silhouetted against countless stars',
        palette: 'midnight green, indigo, moon silver, and warm lamp gold',
      },
      alt: 'Two kings ride onward under a starry sky as the great counted tree stands tall behind them.',
    },
  ],
};
