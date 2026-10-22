import type { PlayIdea } from '../types';

/**
 * Outside and Nature: trails, puddles, hunts, bugs, clouds and shadows, in the garden or the park.
 * Advisor rulings 12-13: Follow My Explorer Trail is a must-include; outdoor challenge means he chooses a
 * low log or a route, never an adult-imposed height, speed or bravery test.
 */
export const IDEAS: readonly PlayIdea[] = [
  {
    id: 'follow-my-explorer-trail',
    group: 'outside',
    title: 'Follow My Explorer Trail',
    hook: 'He picks the way: along the line, round the tree, over the log.',
    where: 'outdoors',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'No setup at the park; two minutes to chalk a few arrows at home',
    players: 'You and him; Mia with another grown-up',
    need: [
      'pavement chalk (or sticks and leaves laid down as arrows)',
      'shoes with some grip, not sandals or flip-flops',
    ],
    exception:
      'A fallen log is a park thing. In a garden, a row of bricks or paving stones laid flat on the lawn, or the edge of a flower bed, does the same job.',
    steps: [
      'At the park or in the garden, tell him: "You lead, I follow. You choose the way, and only go where you can get back down by yourself."',
      'Follow his route exactly: along a line, round the tree, over the low log once he is off it. Stay a step or two behind, with your hands off him.',
      'If he stops at a tricky bit, count slowly to thirty in your head before offering help. Offer words, "Where will your foot go next?", rather than a lift.',
      'Swap: you lead a short route and he follows. Keep yours low and easy; he can always choose his own way round.',
    ],
    hisWay:
      'He is the leader and the judge. He picks the route, the obstacles and how to cross each one: walking, crawling, stepping only on the stones, or going round. He can set rules for you, such as "you have to touch every tree", and he decides when a log is too wobbly to use.',
    mia: {
      way: 'apart',
      text: 'This works best as his time alone with you: Mia stays at ground level with the other grown-up, on the grass or in the sandpit. A two-year-old will try to follow him onto the log, and he should not have to wait for her or watch out for her.',
    },
    picture:
      'In a California park, Arjun walks along a low fallen log, no higher than his knees, with his arms out for balance, looking back to check that Papa is copying him; Papa waits at the near end of the log with his arms out the same way, ready to step up after him. Bark chips cover the ground round the log.',
    cast: ['Arjun', 'Papa'],
    sources: [
      {
        label: 'The Conversation (Mariana Brussoni): Why Kids Need Risk, Fear and Excitement in Play',
        url: 'https://theconversation.com/why-kids-need-risk-fear-and-excitement-in-play-81450',
      },
      { label: 'OutsidePlay.ca (Brussoni lab, University of British Columbia): Go Play Outside! Parent Tool', url: 'https://www.outsideplay.org/tool-microsites/parent-tool' },
      {
        label: 'Brussoni et al., Int. J. Environ. Res. Public Health (2015): What Is the Relationship between Risky Outdoor Play and Health in Children? A Systematic Review',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4483710/',
      },
    ],
    tags: ['park', 'garden', 'follow the leader', 'balance', 'climbing', 'outdoor challenge', 'logs'],
    note: {
      what: 'A follow-the-leader walk outdoors. He chooses a route along lines, round trees and over low things like a log or a row of bricks, and you follow it exactly; then you swap.',
      expect:
        'He may pick something very easy at first, or change his mind halfway along a log and step off. Some children test whether you will really follow everything. A wobble and a step down is him judging, not failing.',
      practising:
        'Judging his own balance and what he can manage on a given day, and planning a route someone else can follow. Leading an adult, which he does not often get to do.',
      ask: 'At the end, only if he wants to talk about it: "Which bit was the trickiest to get across?"',
      next: 'Next time, let him draw the route first, on paper or in the dirt with a stick, and then walk it. On a call to Jaipur, he can tell Dadi and Dada about the trail he made.',
      honest:
        'Crossing a park log does not mean he can judge a high wall or a kerb by a road; the challenge here is kept low on purpose. Some days he will choose only easy routes, and that is his judgement too.',
      easier:
        'Use only lines on the ground: chalk lines, bricks laid flat, the edge of the lawn. If he asks, hold out one finger for him to take, not his whole hand.',
      harder:
        'Add stepping from stone to stone, a log with a bend in it, or a route he must remember and walk again from the far end. Or he chalks a trail of arrows while you turn your back and count to fifty, then watches you follow it.',
      safety:
        'Keep it low: only things he can step off, no higher than his knee, with grass, bark or sand below. Never lift him onto anything higher than he can climb himself, and no timing or daring him: the height and the speed are his choice. Check a log is solid and free of ants first. No scarves or cords round his neck. Keep well away from roads, water and car parks.',
    },
  },
  {
    id: 'rain-walk-and-puddles',
    group: 'outside',
    title: 'A Rain Walk and Puddle Jumping',
    hook: 'Small jump, big jump: which splash goes higher? Then float a leaf.',
    where: 'outdoors',
    energy: 'active',
    contact: false,
    minutes: 30,
    setup: 'Five minutes to find raincoats and boots',
    players: 'You, him and Mia',
    need: [
      'raincoats and rubber boots (or old shoes and clothes that can get soaked)',
      'a leaf, a stick and a stone, found outside',
      'an old pot and a big spoon for puddle soup (optional)',
      'a towel and dry clothes left ready by the door',
    ],
    steps: [
      'Put on raincoats and boots and go out in light rain or just after. Pick a shallow puddle on the path or lawn, away from the road and drains.',
      'Jump in with him: a small jump, then a big one. Which splash comes higher up your legs?',
      'Use the puddle as a water table. He guesses first, then drops in a leaf, a stick and a stone. Which float? Which sink?',
      'Stand still under the porch or an umbrella for a minute and listen: rain on your hood, on the roof, into the puddle. Which sound is loudest?',
    ],
    hisWay:
      'He chooses the puddle and the jump: off the bottom step, sideways, on one foot, or two in a row. He finds his own things to float, and he can turn the puddle into a kitchen and serve you a bowl of rain soup, for looking at, not for eating.',
    mia: {
      way: 'joins',
      text: 'Mia holds your hand the whole time and stamps at the edge of the same puddle, or in a small one of her own. He keeps the middle for his jumps and does not have to wait for her or keep her dry.',
    },
    picture:
      'Arjun, in a yellow raincoat and red rubber boots, lands a two-footed jump in the middle of a shallow puddle on the wet paved path of the California back garden in light rain. Both his arms are out to his sides for balance, his hands empty, and water splashes up round his boots. A step away, Mummy in a raincoat stands at the puddle’s edge holding Mia’s right hand in her left hand. Mia, in small rubber boots, is on Mummy’s far side from Arjun and stamps one foot at the very edge of the puddle, her other hand free. A leaf floats on the water.',
    cast: ['Arjun', 'Mummy', 'Mia'],
    sources: [
      { label: 'NAEYC for Families: Play in a Puddle on a Rainy Day', url: 'https://www.naeyc.org/our-work/families/play-in-puddle' },
      {
        label: 'American Academy of Pediatrics (HealthyChildren.org): Drowning Prevention for Curious Toddlers',
        url: 'https://www.healthychildren.org/English/safety-prevention/at-play/Pages/Water-Safety-And-Young-Children.aspx',
      },
    ],
    tags: ['rainy day', 'puddles', 'rain', 'float and sink', 'boots', 'garden', 'winter'],
    note: {
      what: 'A walk in the rain or just after: jumping in shallow puddles, testing what floats, and stopping to listen to the rain on different things.',
      expect:
        'He will get wetter than you planned and want the biggest puddle he can find. The leaf and the stick usually float and the stone sinks, though a soaked leaf can sink later. A big stick floating while a small stone sinks often surprises him.',
      practising:
        'Cause and effect: a harder jump makes a bigger splash. Guessing before testing whether something floats, and listening for the difference between rain on a hood, a roof and water.',
      ask: 'If a big stick floats and a small stone sinks: "Why do you think the big one stayed up?" Any answer is fine.',
      next: 'If the sun comes out, try Where Does a Puddle Go? from Make & Do on the same puddles. On the next call, ask Dadi and Dada about paper boats in the Jaipur monsoon, then fold one together to float on the next rainy day.',
      honest:
        'One leaf floating does not mean every leaf floats, and he will not work out why things float from this. It is mostly a reason to be out in the rain together. Rain in California comes mostly in winter, so this one waits for the weather.',
      easier: 'Stay on the path by the door, one puddle, small jumps only, and leave out the floating.',
      harder:
        'He tests five things he found and sorts them into floaters and sinkers before trying each. Or he makes puddle soup in an old pot, stirring and serving with a big spoon, and tells you the recipe.',
      safety:
        'Stay within arm\'s reach of both children. Shallow puddles on a path, patio or lawn only: never near a road, a drain, a gutter, a ditch or any moving water. Mia holds a grown-up\'s hand the whole time; a toddler can drown in an inch or two of water. Go in at the first thunder or lightning. Nothing from the puddle goes in a mouth; wash hands after, and tip out the soup pot.',
    },
  },
  {
    id: 'find-something-that',
    group: 'outside',
    title: 'Find Something That...',
    hook: 'Something rough. Something that was once alive. Something tiny.',
    where: 'outdoors',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to draw a picture list',
    players: 'You and him',
    need: [
      'a paper bag or an egg box for finds',
      'a scrap of paper and a crayon for the list (or just say the list out loud)',
    ],
    steps: [
      'Draw a quick picture list together: something rough, something smooth, something that was once alive, something smaller than your fingernail, something the wind moves.',
      'Walk the garden or the park slowly. He finds one for each, and tells you why it fits.',
      'Leaves, bark, twigs and stones too big to pass through a toilet-roll tube go in the bag. Tiny things and anything living stay put; he points instead.',
      'At home, tip the finds out and sort them his way: by colour, by size, rough from smooth, or once-alive from never-alive.',
    ],
    hisWay:
      'He adds to the list, or makes the whole list for you to find: something as long as your hand, something that smells, something with holes in it. He decides how the finds get sorted at the end, and you sort by his rule.',
    mia: {
      way: 'alongside',
      text: 'Mia gets her own bag and one easy hunt beside you, such as leaves bigger than her hand, so her finds are not his. You check what goes into her bag; a two-year-old picks up pebbles and berries too.',
    },
    picture:
      'Under a tree in a California park, Arjun crouches and holds up a piece of rough bark to show Mummy, a brown paper bag in his other hand with a pine cone and a big oak leaf poking out. Mummy kneels beside him on the grass, holding a sheet of paper with small crayon drawings on it.',
    cast: ['Arjun', 'Mummy'],
    sources: [
      { label: 'NAEYC for Families: 10 Ideas to Get You and Your Child Exploring Outdoors', url: 'https://www.naeyc.org/our-work/families/ideas-exploring-outdoors' },
      { label: 'UNICEF Parenting: Screen-free Activities for Children (nature walk, ages 5-8)', url: 'https://www.unicef.org/parenting/child-care/screen-free-activities' },
      { label: 'NAEYC for Families: Explore the Great Outdoors with Your Child', url: 'https://www.naeyc.org/our-work/families/explore-great-outdoors' },
    ],
    tags: ['scavenger hunt', 'park', 'garden', 'nature walk', 'sorting', 'leaves'],
    note: {
      what: 'A nature hunt by property rather than by name. He looks for something rough, something once alive, something smaller than a fingernail, and decides for himself whether a find fits.',
      expect:
        'He will argue that some finds count, and often he is right: a fallen leaf was part of a living tree, and a stone can be rough on one side and smooth on the other. "Once alive" is the hardest one; expect him to ask whether wood or a feather counts.',
      practising:
        'Describing things by what they are like, not only by what they are called. Sorting the same pile in more than one way, and giving a reason for where a thing goes.',
      ask: 'When he holds up a find for "once alive": "How can you tell?"',
      next: 'Use the same hunt indoors on a rainy day: something soft, something heavier than a spoon. Or press a few of the leaves inside a heavy book and look at them again next week.',
      honest:
        'Sorting a bag of finds is not the same as knowing what a living thing is; a five-year-old\'s idea of "alive" is still forming, and he may say the wind or a cloud is alive. Let him explain, and leave the correcting for another day.',
      easier: 'Use three easy ones only, such as a leaf, a stick and a stone, and hunt within one patch of lawn.',
      harder:
        'Find two things that are the same in one way and different in another, or something in each colour of the rainbow. Or he makes the list for you, and you have to find everything on it.',
      safety:
        'Nothing found outside goes in a mouth, and he looks without touching mushrooms, berries and plants he does not know. Learn to spot poison oak, common in California, and stay away from it. Feathers, droppings and anything dead: look, do not pick up. Look before reaching into leaves or under things. Wash hands after. Pebbles, seeds and acorns stay on the ground: anything that fits through a toilet-roll tube can choke Mia.',
    },
  },
  {
    id: 'bug-hunt',
    group: 'outside',
    title: 'Bug Hunt with a Magnifying Glass',
    hook: 'Under the log: look close, count the legs, then put it back as it was.',
    where: 'outdoors',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'No setup',
    players: 'You and him; Mia with another grown-up',
    need: [
      'a magnifying glass, plastic if you have the choice (or a phone camera zoomed right in)',
      'a crumb of bread for the ants',
      'paper and a crayon for drawing what he saw (optional)',
    ],
    exception:
      'A magnifying glass is not in every home. A phone camera zoomed in works, and so does lying on your tummies with your noses close to the ground.',
    steps: [
      'Find a log, a flat stone or an old plank lying in the garden or park. You roll it slowly towards yourself while he watches from the side.',
      'Look together without touching. Count a beetle\'s legs, or try a roly-poly\'s. He shows you how it moves, and you both copy it on the grass.',
      'Lower the log slowly back exactly where it was, so nothing is squashed and the creatures keep their home.',
      'Then find ants on a path. He puts a crumb a hand\'s length from their line. Watch: which ant finds it, and which way do they carry it?',
    ],
    hisWay:
      'He chooses where to look and holds the glass. He can give each creature his own name from what it does, "the curler" or "the fast one", and he decides where the crumb goes and whether to try a second one somewhere else.',
    mia: {
      way: 'apart',
      text: 'This is his one-to-one time with you. Mia stays with the other grown-up away from the log: a two-year-old grabs at bugs and stones, and he should not have to guard his roly-poly from her. Later he can show her one from a distance, if he wants to.',
    },
    picture:
      'In the back garden of the California home, Papa crouches and holds one end of a small log tilted up towards himself with both hands, while Arjun kneels at the side holding a plastic magnifying glass over a grey roly-poly curled up on the damp soil where the log lay.',
    cast: ['Arjun', 'Papa'],
    sources: [
      { label: 'NAEYC for Families: Turn Any Walk into a Nature Walk', url: 'https://www.naeyc.org/our-work/families/turn-any-walk-nature-walk' },
      { label: 'NAEYC for Families: Explore the Great Outdoors with Your Child (cautions)', url: 'https://www.naeyc.org/our-work/families/explore-great-outdoors' },
      { label: 'NAEYC for Families: 10 Ideas to Get You and Your Child Exploring Outdoors (ant trail)', url: 'https://www.naeyc.org/our-work/families/ideas-exploring-outdoors' },
    ],
    tags: ['bugs', 'insects', 'ants', 'garden', 'park', 'magnifying glass', 'nature'],
    note: {
      what: 'You lift a log or a stone, he looks at what lives underneath through a magnifying glass, and the log goes back exactly as it was. Then you watch an ant trail find a crumb.',
      expect:
        'Often there are roly-polies, worms, earwigs or beetles, and sometimes nothing at all. A roly-poly has fourteen legs, which is hard to count even with a glass; he may give up and count a beetle\'s six instead. That difference is real: a roly-poly is not an insect but a land cousin of crabs. The ants can take a few minutes to find the crumb.',
      practising:
        'Looking closely and for longer than usual. Noticing that different creatures have different numbers of legs and move in different ways, and that they have homes worth putting back.',
      ask: 'After he has watched a roly-poly for a while: "Why do you think it likes living under there?"',
      next: 'Look under the same log next week: are the same creatures there? He can draw the one he liked best, with the right number of legs if he can remember.',
      honest:
        'One look under a log does not teach him which creatures are safe to touch; that rule stays with you: he looks, and does not touch anything he does not know. Sometimes nothing comes to the crumb, which says more about the ants\' day than about the game.',
      easier: 'Skip the log. Lie on the lawn together and watch whatever walks past, with or without the glass.',
      harder:
        'Look under three different things, a log, a stone and a pot, and talk about which had the most creatures and why. Or he draws one creature from life while it is still there, and then tells you exactly where to lower the log so it fits back in its own dent.',
      safety:
        'You lift, he watches: black widow spiders live under logs, stones and pots in California, and in wild or hilly parks rattlesnakes shelter under logs and rocks too, so keep to gardens and mown parkland. Roll the log towards you, so it stays between you both and whatever is under it. Never touch spiders, bees, wasps or anything that might sting; some ants sting too, so hands stay off the trail. Never focus sunlight through the glass; it can burn skin or set dry grass alight. Wash hands after. Keep the glass and the crumbs out of Mia\'s reach.',
    },
  },
  {
    id: 'cloud-shapes',
    group: 'outside',
    title: 'Lie on the Grass and Find Shapes in the Clouds',
    hook: 'I see an elephant. Where is its trunk? Now it has changed.',
    where: 'outdoors',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'One minute to spread a blanket',
    players: 'You, him and Mia',
    need: [
      'a blanket, a mat or an old bedsheet',
      'pavement chalk, for drawing a cloud afterwards (optional)',
    ],
    steps: [
      'On a day with big, puffy clouds, in the morning or late afternoon, spread a blanket on the grass and lie on your backs with your heads towards the sun.',
      'Take turns: "I see an elephant." The other person has to find it. "Where is its trunk?"',
      'Pick one cloud together and watch it for a minute. Has it changed shape? Which way is it moving: towards the house, or towards the tree?',
      'Before you get up, he can chalk the best shape he saw on the path, or tell you a short story about it.',
    ],
    hisWay:
      'He calls the shapes and you have to find them. He can turn it into a story, where the elephant cloud is chasing the boat cloud, or set a rule: only animals, or only things you would find in Dadi and Dada\'s kitchen.',
    mia: {
      way: 'joins',
      text: 'Mia lies on the blanket next to you and points at clouds; anything she names counts, even "ball" every time. He does not have to find her shapes, and his turns stay his.',
    },
    picture:
      'On a blanket spread on the lawn of the California back garden, Arjun lies on his back pointing up at a big white puffy cloud, Mia lies next to him with her arm up copying him, and Mummy lies on Mia\'s other side, her head turned towards Arjun, smiling. Blue sky with fluffy clouds above.',
    cast: ['Arjun', 'Mummy', 'Mia'],
    sources: [
      { label: 'UNICEF Parenting: Screen-free Activities for Children (Cloud shapes, in the ages 1-4 list)', url: 'https://www.unicef.org/parenting/child-care/screen-free-activities' },
      { label: 'NAEYC for Families: Turn Any Walk into a Nature Walk (chalk the clouds)', url: 'https://www.naeyc.org/our-work/families/turn-any-walk-nature-walk' },
    ],
    tags: ['clouds', 'sky', 'quiet', 'garden', 'park', 'weather', 'calm down'],
    note: {
      what: 'You lie on the grass together, take turns spotting shapes in the clouds, and watch one cloud long enough to see it change and drift.',
      expect:
        'His shapes may make no sense to you at first; ask where the parts are rather than saying you cannot see it. Clouds drift slowly, so the moving may only show against a tree or a roof edge. On a clear day there is nothing to see, and on a grey day it is one sheet.',
      practising:
        'Describing what he sees so someone else can find it: "the trunk is on the left". Noticing slow change, and which way the clouds are drifting.',
      ask: 'After he has watched one cloud for a while: "What happened to it?"',
      next: 'Look at the same patch of sky in the morning and the evening and compare. On the next call, Dadi and Dada can tell him what the sky over Jaipur looks like that day.',
      honest:
        'Seeing an elephant in a cloud is imagination, not science; the shapes are real only to the person seeing them. He will not learn cloud types or how rain forms from this, and he does not need to.',
      easier: 'Just lie and name what you see, with no turns and no watching for movement.',
      harder:
        'Use a tree or the roof edge as a marker and judge which way the clouds are going. Or he describes a shape without pointing, and you have to find it from his words alone.',
      safety:
        'Never look at the sun, even for a moment: go out in the morning or late afternoon when it is low, lie with your heads towards it so it is behind you, or put your heads in the shade of the house. Hats and sunscreen on a bright day. Check the grass first for ants, bees and dog mess. Mia lies within a grown-up\'s reach, and the blanket goes nowhere near a pond or pool.',
    },
  },
  {
    id: 'shadow-tag',
    group: 'outside',
    title: 'Shadow Tag and Chalk Outlines',
    hook: 'Step on my shadow! Then chalk round it and come back in an hour.',
    where: 'outdoors',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'No setup on a sunny day; hats on first',
    players: 'You and him; Mia with another grown-up',
    need: [
      'pavement chalk (or a stick, if you are drawing in dirt or sand)',
      'sun hats',
    ],
    steps: [
      'On a sunny morning, on the lawn, point out your two shadows. You chase first and try to step on his shadow, never on him.',
      'Walk first, then run. When you tread on his shadow, swap: he chases yours. A shady patch under a tree can be a safe place to rest.',
      'Then stand still on the patio while he chalks round your shadow and your feet. You chalk his. Write the time beside each.',
      'Come back an hour later and stand on the same foot marks. Where has the shadow gone now? Is it longer or shorter?',
    ],
    hisWay:
      'He sets the rules: walking only, hopping only, or a tree that counts as home. He can try to hide his shadow in yours or in the shade, and he decides what pose to chalk, a giant with his arms up or a bird with his arms out.',
    mia: {
      way: 'apart',
      text: 'Mia is best in the shade with the other grown-up while you two chase. Afterwards, only if he wants to, he can chalk round her shadow on the patio; she will not stand still for long, and a wobbly outline is fine.',
    },
    picture:
      'On a sunny lawn in the late afternoon, Papa and Arjun each cast a long dark shadow stretching out across the grass. Arjun is mid-leap, both feet landing squarely on the dark head of Papa’s shadow, laughing, while Papa, standing well away from him, turns and points down at his own shadow with mock alarm.',
    cast: ['Arjun', 'Papa'],
    sources: [
      { label: 'NAEYC for Families: Turn Any Walk into a Nature Walk (shadows and the path of the sun)', url: 'https://www.naeyc.org/our-work/families/turn-any-walk-nature-walk' },
      { label: 'Wikipedia: Tag (game), the shadow tag variant', url: 'https://en.wikipedia.org/wiki/Tag_(game)' },
    ],
    tags: ['shadows', 'sun', 'tag', 'chalk', 'garden', 'patio', 'running'],
    note: {
      what: 'A chasing game where you tag a shadow instead of a person, then a still part: you chalk round each other\'s shadows and come back later to see where they have moved.',
      expect:
        'He may notice that his shadow is easier to catch in the early morning, when it is long. When you come back an hour later, the shadow will have turned a little and changed length; he may say the shadow moved by itself.',
      practising:
        'Noticing that a shadow is always on the side away from the sun, and that it changes length and direction through the day. Chasing and dodging with a rule that keeps hands off each other.',
      ask: 'When he stands back on his foot marks an hour later: "Why do you think it moved?"',
      next: 'For a whole day of shadows, try What Time Is It, Stick? in Make & Do: a stick in clay, chalked every hour.',
      honest:
        'He will probably say the sun moved, and that is a fine answer at five; the idea that the earth turns is for later. An outline in the morning and another an hour later shows that shadows change, not why they change. A cloud can spoil the second look.',
      easier: 'Walk-only shadow tag, and stick to the chalking: one outline each, looked at again after lunch.',
      harder:
        'Before you come back, he guesses where the shadow will be and puts a stone there. Or play shadow handshake: make your two shadows shake hands without your real hands touching.',
      safety:
        'Never look at the sun. Sun hats and sunscreen, and play in the morning or late afternoon, not in the midday heat. Run on the lawn, chalk on the patio, never on the driveway or the pavement by the road. Clear the grass of toys, hoses and sprinkler heads before running. Keep the chalk away from Mia\'s mouth.',
    },
  },
];
