import type { PlayIdea } from '../types';

/**
 * Throw, Kick and Catch: socks, paper rings and soft balls at targets, indoors or out.
 * Advisor rulings 13-14: soft things only, aimed at stacks and bottles, never at people;
 * Sock-Ball Bowling is a must-include, and Lagori uses cups and a soft ball aimed only at the cups, never stones or people.
 */
export const IDEAS: readonly PlayIdea[] = [
  {
    id: 'sock-ball-bowling',
    group: 'throw',
    title: 'Sock-Ball Bowling',
    hook: 'Roll a sock ball at a group of bottles and count what falls.',
    where: 'either',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to roll socks and stand the bottles',
    players: 'You, him and Mia',
    need: [
      'three or four pairs of socks, each pair rolled into a ball',
      'six empty plastic bottles (or kitchen-roll tubes, or plastic cups)',
      'a strip of tape or a shoe to mark the line',
    ],
    steps: [
      'Stand six empty bottles in a triangle at the end of a hallway or on the patio, with clear floor in front.',
      'Mark a line about three big steps back. He rolls a sock ball along the floor, not through the air, at the bottles.',
      'Count together how many fell and how many still stand, then he sets them up again.',
      'Agree together what changes next: the line a step back, a step closer, or the bottles spread wider.',
    ],
    hisWay:
      'He decides where the bottles stand and where the line goes. He can invent rules, such as rolling with the other hand or off the wall first, and you play by them.',
    mia: {
      way: 'joins',
      text: 'Mia has her turn after each of his rounds, from her own spot a big step in front of his line, and you stand the bottles up for her. If she walks into the bottles during his round, you lift her back and reset them; he does not have to stop her.',
    },
    picture:
      'Arjun crouches at a tape line in the hallway of the California home and rolls a rolled-up sock ball along the floor towards a small group of empty plastic bottles standing a few steps away. Mummy kneels beside him holding another sock ball, and Mia sits to one side, nearer the bottles, holding a sock ball in both hands.',
    cast: ['Arjun', 'Mummy', 'Mia'],
    sources: [
      { label: 'Zero to Three: 5 Ways to Play with Socks (sock balls and a cup tower)', url: 'https://www.zerotothree.org/resource/5-ways-to-play-with-socks/' },
      { label: 'PBS KIDS for Parents: Peg + Cat Indoor Games (plastic bottles as targets; count and compare what landed)', url: 'https://www.pbs.org/parents/thrive/peg-indoor-games-to-keep-kids-learning-in-summer' },
      { label: 'PBS KIDS for Parents (Peg + Cat): How Far Can You Toss a Squishy Sponge Ball? (distance in footsteps)', url: 'https://www.pbs.org/parents/crafts-and-experiments/peg-how-far-can-you-toss-a-squishy-sponge-ball' },
    ],
    tags: ['rainy day', 'socks', 'bottles', 'bowling', 'counting', 'hallway'],
    note: {
      what: 'He rolls a sock ball along the floor at a group of empty bottles, counts what fell and what still stands, and sets them up again. You change the distance together.',
      expect:
        'Early rolls tend to be too hard and wide, or so gentle they stop short. Sock balls wobble and curve. He may want the line right up against the bottles; let him, and see where he moves it next.',
      practising:
        'Aiming, and judging how hard to roll for a distance. Counting a small group, and noticing that the fallen and the standing bottles together still make six.',
      ask: 'After a roll that knocks some down, only if he is counting anyway: "How many fell, and how many are still standing?"',
      next: 'Another day, try other things as the ball: a small cushion, a rolled towel, a light plastic ball. Which one knocks the most over?',
      honest:
        'A big knock-down is often luck: sock balls curve and the bottles fall into each other. The count each round says little about his skill, and there is no need to keep one.',
      easier: 'Move the line close, stand the bottles in a tight bunch, and use a bigger, rounder sock ball.',
      harder: 'Spread the bottles wider, step the line back, or pick one bottle he must knock over while leaving its neighbours standing.',
      safety:
        'Socks, not a hard ball, indoors; keep the lane clear of glass and the television. Take the bottle caps off and put them away, or screw them on tight: a loose cap is small enough for Mia to choke on.',
    },
  },
  {
    id: 'lagori-soft-tower',
    group: 'throw',
    title: 'Knock and Rebuild, Inspired by Lagori',
    hook: 'Knock the tower down, then rebuild it before the ball hits the shoe.',
    where: 'either',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to clear a space and stack the tower',
    players: 'You and him; Mia with another grown-up',
    need: [
      'seven light things of different sizes that stack: plastic stacking cups, plastic tubs with lids, or small cardboard boxes',
      'a soft ball (a sponge ball, or a pair of rolled-up socks)',
      'one shoe, as the target for the ball',
      'chalk outdoors, or a strip of tape indoors, for the line',
    ],
    steps: [
      'Stack the seven pieces into a tower, biggest at the bottom, on a clear patio or floor. Mark a throwing line three big steps away.',
      'He gets three throws from the line to knock the tower down. The ball goes at the tower, never at a person.',
      'Once it falls, he rebuilds while you fetch the ball, go back to the line, and roll it at a shoe set a big step from the tower.',
      'If the tower stands before your ball touches the shoe, he calls "Lagori!". Either way, swap: you knock down and rebuild, he fetches and rolls.',
    ],
    hisWay:
      'He sets how far the line is, how many pieces go in the tower, where the shoe goes, and whether the rebuild has to be in size order. He can add his own rule for the roller, such as counting to five first.',
    mia: {
      way: 'apart',
      text: 'Best while Mia is with Papa or asleep: a toddler next to the tower knocks it over mid-rebuild, which spoils the part he cares about most. Later, she can have three cups of her own to stack and knock.',
    },
    picture:
      'On the patio of the California home, Arjun kneels on the paving on the left, quickly stacking coloured plastic stacking cups back into a tower, biggest at the bottom, with a few cups still scattered beside him. A single sandal stands on the paving a big step to the right of the tower, away from Arjun. On the far right, a few steps back from the sandal, Mummy crouches low and rolls a soft blue sponge ball along the ground straight at the sandal; the ball is on the paving between her hand and the sandal, travelling towards the sandal and not towards Arjun.',
    cast: ['Arjun', 'Mummy'],
    tradition:
      'Seven stones, played across South Asia under many names: Lagori in Karnataka, Pithu or Pitto across much of north India, Sitoliya in Rajasthan, Ezhu Kallu in Tamil Nadu, and Saat Patha. The real game has two teams (D\'Source says at least three a side), a pile of seven or more flat stones, and the hitting team throws the ball at the rebuilders. In D\'Source\'s rules a hit puts the whole team out; in others only that player is out. This version is for two, uses cups or boxes instead of stones, aims a soft ball only at a shoe, never at a player, and nobody is out: the roles just swap.',
    sources: [
      { label: "D'Source (IDC, IIT Bombay), Indian Games: Lagori", url: 'https://www.dsource.in/resource/indian-games/outdoor-games/lagori' },
      { label: 'Wikipedia: Seven stones (Lagori), regional names and rules', url: 'https://en.wikipedia.org/wiki/Lagori' },
      { label: 'Zero to Three: 5 Ways to Play with Socks (sock ball at a cup tower)', url: 'https://www.zerotothree.org/resource/5-ways-to-play-with-socks/' },
    ],
    tags: ['Indian games', 'Lagori', 'Pithu', 'Sitoliya', 'seven stones', 'cups', 'garden', 'patio'],
    note: {
      what: 'A two-person game inspired by Lagori. He knocks a tower of seven pieces down with a soft ball, then rebuilds it while you fetch the ball and try to roll it so it touches a shoe beside the tower.',
      expect:
        'He will probably rebuild in a rush and in any order, and a wobbly tower falls again, which is part of the game. He may want you to fetch very slowly when he builds, and fetch fast himself when it is your turn.',
      practising:
        'Aiming a throw at a target. Putting things in order of size while hurrying a little. Switching between three roles that each have their own rule: thrower, builder, roller.',
      ask: 'Only if the tower keeps toppling while he rebuilds: "Which one has to go at the bottom?"',
      next: 'On the next call to Jaipur, ask Dadi or Dada what they called this game and how they played it; in Rajasthan it is often Sitoliya. With cousins at the park, try it in two small teams, still rolling the ball at a shoe, never at people.',
      honest:
        'With two players and no teams, this keeps the aiming and the rush to rebuild but loses the team play the real game is known for. Whether he beats the ball depends mostly on how fast you fetch and how well you aim.',
      easier: 'Use four or five pieces, bring the throwing line closer, and count slowly to five aloud before you roll.',
      harder: 'Use all seven pieces in strict size order, move the throwing line back, or rebuild with one hand only.',
      safety:
        'Plastic cups, tubs or cardboard boxes only, never stones, bricks or steel tumblers. Roll the soft ball along the ground at the shoe, never at him; if he is between you and the shoe, wait. Clear the patio of pots and garden tools first. If Mia comes out, she stays with a grown-up, out of the throwing lane.',
    },
  },
  {
    id: 'sock-basketball',
    group: 'throw',
    title: 'Sock Basketball in the Laundry Basket',
    hook: 'Three in from the line, then the line moves back a step.',
    where: 'indoors',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to empty the basket and roll the socks',
    players: 'You and him',
    need: [
      'six pairs of socks, each pair rolled into a ball',
      'an empty laundry basket (or a cardboard box, or a bucket)',
      'a strip of tape, a cushion or a shoe to mark the line',
    ],
    steps: [
      'Empty the laundry basket and push it against a wall. Mark a line two big steps away.',
      'Take turns throwing sock balls from the line. Keep the throws soft and underarm to start.',
      'When he gets three in from one line, the line moves back a big step. Your line can start further back than his.',
      'When every sock is used, he fetches them, and the next round starts from wherever he chooses.',
    ],
    hisWay:
      'He chooses the kind of throw for a round: underarm, overarm, with the other hand, off the wall, or standing on one foot. He can move the basket or put it on its side and kick the socks in instead.',
    mia: {
      way: 'alongside',
      text: 'Give Mia her own small basket or a cardboard box and two or three sock balls, set to one side, where she can drop them in from right beside it. His basket and his line stay his.',
    },
    picture:
      'Side view in the living room of the California home: Arjun stands behind a strip of tape on the floor, facing a laundry basket pushed against the wall on the right, and swings one arm forward underarm, letting go of a round rolled-up sock ball that flies in a low arc towards the basket; two round sock balls already sit inside the basket. Papa stands a step behind Arjun on the left, holding a small armful of round rolled-up sock balls against his chest with both arms, and watches the sock ball fly towards the basket.',
    cast: ['Arjun', 'Papa'],
    sources: [
      { label: 'Zero to Three: 5 Ways to Play with Socks (sock balls into a laundry basket)', url: 'https://www.zerotothree.org/resource/5-ways-to-play-with-socks/' },
      { label: 'Zero to Three: 5 Ways to Play with a Laundry Basket', url: 'https://www.zerotothree.org/resource/5-ways-to-play-with-a-laundry-basket/' },
      { label: 'PBS KIDS for Parents (Peg + Cat): How Far Can You Toss a Squishy Sponge Ball?', url: 'https://www.pbs.org/parents/crafts-and-experiments/peg-how-far-can-you-toss-a-squishy-sponge-ball' },
    ],
    tags: ['rainy day', 'socks', 'laundry basket', 'basketball', 'throwing', 'living room'],
    note: {
      what: 'He throws rolled-up socks into an empty laundry basket from a line on the floor. Three in, and the line moves back a step.',
      expect:
        'Close up he will get most in; a step or two further back, many land short or bounce out. He may switch to overarm and throw too hard. Expect him to want to move the line in again after a run of misses, which is fine.',
      practising:
        'Judging how hard to throw for a distance, and adjusting after a miss. Waiting for his turn, and counting to three.',
      ask: 'After a run of throws that land short, only if he looks stuck: "What could you change on the next one?"',
      next: 'At laundry time, he throws the paired socks into the basket from where he sorts them. In the park, a bucket and a soft ball work the same way.',
      honest:
        'Sock balls are light and drift, so this is not how a real ball flies; he may find a heavier ball harder at first. How far back he can get on one day says little about the next.',
      easier: 'Put the basket on its side or move it closer, and use bigger, rounder sock balls.',
      harder: 'Raise the basket on a low, steady stool, throw with the other hand, or call the shot first: "This one goes in off the wall."',
      safety:
        'Soft socks only, nothing with a hard core. Take lamps, glass and anything on the shelves above the basket out of the way. Nobody throws at a face. Mia stays to the side, not between the line and the basket.',
    },
  },
  {
    id: 'ring-toss-on-bottles',
    group: 'throw',
    title: 'Ring Toss on Bottles',
    hook: 'Paper-plate rings, five bottles, and a line you both agree on.',
    where: 'either',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'Five minutes to cut the rings and fill the bottles',
    players: 'You and him',
    need: [
      'five or six paper plates (or the sides of a cereal box)',
      'scissors, for the grown-up',
      'crayons or felt pens, if he wants to colour the rings',
      'five or six empty plastic bottles with their caps',
      'a jug of water, to put a little in each bottle',
      'a strip of tape or a shoe to mark the line',
    ],
    steps: [
      'Cut the middle out of each paper plate, leaving a rim about two fingers wide. He can colour the rims while you cut.',
      'Pour about a cupful of water into each bottle so it stands steady, and screw the caps on tight. Stand them in a triangle on a clear patch of floor.',
      'He tosses five rings from a line two big steps away, then you toss five.',
      'Count where they landed together: on a bottle, leaning on one, or on the floor. Then move the line, or the bottles, as he decides.',
    ],
    hisWay:
      'He decides how the bottles stand, in a row, a triangle or one far behind the rest, and which bottle is the hard one to land on. He can make the rings himself next time from a cereal box.',
    mia: {
      way: 'alongside',
      text: 'Mia gets her own bottle and two rings at a spot of her own, where she can drop the rings over the top from right beside it. She does not need to throw from his line.',
    },
    picture:
      'On the living-room floor of the California home, Arjun stands behind a strip of tape and tosses a flat ring cut from a white paper plate, its rim coloured with crayon, towards a small group of plastic bottles; one paper ring already lies round a bottle and another lies flat on the floor. Mummy kneels to one side holding more paper-plate rings.',
    cast: ['Arjun', 'Mummy'],
    sources: [
      { label: 'PBS KIDS for Parents: Peg + Cat Indoor Games to Keep Kids Learning in Summer (ring toss)', url: 'https://www.pbs.org/parents/thrive/peg-indoor-games-to-keep-kids-learning-in-summer' },
      { label: 'Nemours KidsHealth: Choosing Safe Toys for Toddlers and Preschoolers (small parts and the toilet-roll test)', url: 'https://kidshealth.org/en/parents/safetoys-young.html' },
    ],
    tags: ['rainy day', 'paper plates', 'bottles', 'mela', 'counting', 'position words'],
    note: {
      what: 'You cut rings from paper plates; he tosses them at a group of capped plastic bottles from a line, and together you count where they landed.',
      expect:
        'Most rings will miss at first: paper rings drift and spin and often land flat. One that drops right over a bottle is a real event. He may want to drop them on from right above; let him, then see if he moves back on his own.',
      practising:
        'Aiming a light, spinning object. Counting and comparing two small groups, landed and missed. Words for position: on, next to, behind, between.',
      ask: 'Only after a ring lands somewhere odd: "Where did that one end up?"',
      next: 'At a mela or a school fair he may see a real ring-toss stall. At home, the rings can become steering wheels, crowns or plates for a pretend shop.',
      honest:
        'Light paper rings mostly reward luck, so a good round and a poor round may look very different with nothing changed. Counting where the rings landed is a start on comparing, not a test of it.',
      easier: 'Cut the rings wider, move the line right up close, and stand the bottles touching each other.',
      harder: 'Spread the bottles out, take a step back, or call the bottle he is aiming for before each toss.',
      safety:
        'You do all the cutting and put the scissors away before play starts. Caps on tight, and screw them back on if they come off: a bottle cap passes through a toilet-roll tube, the usual test for what a toddler can choke on. When you finish, pour the bottles out at the sink and put them away.',
    },
  },
  {
    id: 'keep-it-up',
    group: 'throw',
    title: 'Keep It Up',
    hook: 'Tap a beach ball between you and count before it lands.',
    where: 'either',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to blow up the ball and clear a space',
    players: 'You, him and Mia',
    need: ['an inflatable beach ball (or a large, light soft ball)'],
    steps: [
      'Blow up the beach ball yourself and clear the middle of the room, or go out on the grass.',
      'Tap it up gently with open hands, to each other or to yourselves. Everyone counts each tap out loud.',
      'When it lands, say the number, then start again from one and see if you can keep it up longer together.',
      'Once he has it, add one rule he chooses: only elbows, only one hand, or clap once before each tap.',
    ],
    hisWay:
      'He sets the rule for each round and can change it partway through. He can make a "net" from a line of cushions and play over it, or decide that a bounce off the sofa still counts.',
    mia: {
      way: 'joins',
      text: 'Mia stands in the circle and taps whenever it comes near her; any touch of hers counts as a tap. If the ball lands after her touch, pick it up and carry on from the same number, so his count is never lost because of her.',
    },
    picture:
      'On the lawn behind the California home, Arjun jumps with both arms up and taps a big striped beach ball into the air, counting aloud; Papa stands opposite with his hands ready for the next tap, and Mia stands between them reaching up towards the ball with both hands.',
    cast: ['Arjun', 'Papa', 'Mia'],
    sources: [
      { label: 'PBS KIDS for Parents: 9 Family Games for Your Backyard Olympics (beach-ball volleyball)', url: 'https://www.pbs.org/parents/thrive/family-games-for-your-backyard-olympics' },
      { label: 'AAP HealthyChildren: Choking Prevention (balloons a risk up to age 8)', url: 'https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Choking-Prevention.aspx' },
    ],
    tags: ['rainy day', 'beach ball', 'garden', 'counting', 'cooperative', 'no balloons'],
    note: {
      what: 'You keep a beach ball off the ground together by tapping it up, counting every tap out loud. When it lands, you start again and try to go past your own number together.',
      expect:
        'Early rounds often end after two or three taps; he may swipe hard and send it sideways. A slow, high tap works best, and he may need to see you do it a few times. Wind outdoors makes it harder.',
      practising:
        'Tracking a slow ball with his eyes and moving to meet it. Counting on from the last number, and playing on the same side as you rather than against you.',
      ask: 'Only after a long run, if he is pleased: "What did you do differently that time?"',
      next: 'At the park or the beach, play over a towel laid on the sand as the net. When Dadi and Dada visit, make the circle bigger and keep it going with five.',
      honest:
        'The count depends on draughts, the ball and how much you save his taps, so a new number is not a measure of progress. This is not volleyball; it only borrows the idea of keeping the ball off the ground.',
      easier: 'You make every second tap a high, slow one straight to him, and any touch at all counts.',
      harder: 'Only one tap each before it must go to the other person, or only elbows and heads, or no hands at all.',
      safety:
        'A beach ball, never a balloon: balloons are a choking risk until age 8, and a burst one is worse. If the beach ball splits, throw the pieces away at once; torn plastic is a choking risk for Mia. Keep the circle wide so nobody jumping for the ball lands on her. Clear lamps, glass and sharp table corners first.',
    },
  },
  {
    id: 'kick-it-between-the-shoes',
    group: 'throw',
    title: 'Kick It Between the Shoes',
    hook: 'Two shoes make a goal. You guard it on your knees.',
    where: 'either',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to clear a space and set the shoes',
    players: 'You and him',
    need: [
      'two shoes or two cushions, for goalposts',
      'a soft ball (a beach ball, a foam ball, or a pair of rolled-up socks indoors)',
    ],
    steps: [
      'Set two shoes four big steps apart on the lawn, or against the side walls at the end of a clear hallway. He kicks from a few steps out.',
      'After a few goals, you kneel between the shoes as goalie. Stay on your knees and stop the ball with your hands only.',
      'He decides when to make the goal narrower by moving one shoe in a step.',
      'Swap: he guards the goal, and you kick gently along the ground from where he says.',
    ],
    hisWay:
      'He decides where he kicks from, how wide the goal is, and whether you may use one hand or two. He can add a second goal, or call out which side he will aim for and try it.',
    mia: {
      way: 'alongside',
      text: 'Mia has her own soft ball and a cardboard box on its side as her goal, well to one side of his lane, so she can push the ball in with her feet or hands while he plays.',
    },
    picture:
      'On the lawn of the California home, Arjun swings his right foot and kicks a soft foam ball along the grass towards a goal made of two sandals set apart; Papa kneels between the sandals as goalie, leaning to one side with both hands out, the ball heading past his reach.',
    cast: ['Arjun', 'Papa'],
    sources: [
      { label: 'Zero to Three: 5 Ways to Play with a Laundry Basket (kick a ball into a basket on its side)', url: 'https://www.zerotothree.org/resource/5-ways-to-play-with-a-laundry-basket/' },
      { label: 'PBS KIDS for Parents: 9 Family Games for Your Backyard Olympics (a mini football pitch)', url: 'https://www.pbs.org/parents/thrive/family-games-for-your-backyard-olympics' },
      { label: 'AAP HealthyChildren: The Power of Play (outdoor play, balance and movement)', url: 'https://www.healthychildren.org/English/family-life/power-of-play/Pages/the-power-of-play-how-fun-and-games-help-children-thrive.aspx' },
    ],
    tags: ['football', 'soccer', 'kicking', 'garden', 'park', 'shoes', 'goalie'],
    note: {
      what: 'Two shoes make a goal and he kicks a soft ball through it. Then you kneel in goal, and later you swap so he guards it.',
      expect:
        'He will probably toe-poke the ball hard, and it will often go wide or skid off the side of his foot. He may want you to dive every time, or to let everything through. As goalie, he may run out and grab the ball; that is a fine new rule if you both agree.',
      practising:
        'Kicking a ball in the direction he means. Judging a gap, and trying again when the gap gets narrower. Taking turns between kicking and guarding.',
      ask: 'Only if he is aiming at one side on purpose: "Which side are you going for?"',
      next: 'At the park, try a few kicks into a real goal from a spot he chooses. At home, a laundry basket on its side makes a goal for a rainy day.',
      honest:
        'How many goals he scores depends mostly on how hard you try in goal. This is kicking and turn-taking with one grown-up; it does not show how he would get on in a match with other children.',
      easier: 'Widen the goal, use a bigger, slower ball such as a beach ball, and let him kick from close.',
      harder: 'Move one shoe in, kick with the other foot, or kick from a spot further away that he chooses.',
      safety:
        'A soft ball indoors, and only in a clear hallway with nothing breakable at the end. Outdoors, play on grass away from the street or driveway; if the ball rolls out of the garden, a grown-up fetches it. Stay on your knees in goal and stop the ball with your hands, never by lunging at his feet. Nobody kicks at a face.',
    },
  },
];
