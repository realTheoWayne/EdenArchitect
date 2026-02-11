
import { Crop } from './types';

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const INITIAL_CROPS: Crop[] = [
  {
    id: 'c1',
    name: 'Tomato',
    botanicalName: 'Solanum lycopersicum',
    type: 'vegetable',
    daysToMaturity: 75,
    sowIndoorsStart: 2, // March
    sowIndoorsEnd: 3,
    transplantStart: 4, // May
    transplantEnd: 5,
    harvestStart: 6, // July
    harvestEnd: 9,
    color: 'bg-red-400',
    icon: '🍅',
    spacing: 24, // inches
    description: 'Warm-season crop requiring full sun and support.',
    companions: ['Basil', 'Carrot', 'Onion', 'Parsley', 'Marigold', 'Nasturtium'],
    antagonists: ['Potato', 'Fennel', 'Cabbage', 'Corn', 'Walnut'],
    pests: ['Aphids', 'Hornworms', 'Whiteflies', 'Cutworms'],
    resistance: ['Verticillium Wilt', 'Fusarium Wilt'],
    coldHardy: false,
    varieties: [
      { name: 'Better Boy', botanicalName: 'S. lycopersicum (Hybrid)', daysToMaturity: 75, description: 'Classic disease-resistant hybrid with large fruit.', spacing: 24 },
      { name: 'Cherokee Purple', botanicalName: 'S. lycopersicum (Heirloom)', daysToMaturity: 80, description: 'Famous heirloom with rich, smoky flavor and dark color.', spacing: 30 },
      { name: 'Roma', botanicalName: 'S. lycopersicum (Paste)', daysToMaturity: 75, description: 'Determinate paste tomato, great for sauces.', spacing: 18 },
      { name: 'Sun Gold', botanicalName: 'S. lycopersicum (Cherry)', daysToMaturity: 57, description: 'Very sweet, tangerine-orange cherry tomatoes.', spacing: 24 },
      { name: 'Beefsteak', botanicalName: 'S. lycopersicum (Beefsteak)', daysToMaturity: 85, description: 'Large, meaty fruits perfect for slicing.', spacing: 30 },
      { name: 'Brandywine', botanicalName: 'S. lycopersicum (Heirloom)', daysToMaturity: 90, description: 'Famous heirloom with potato-leaves and rich flavor.', spacing: 30 },
      { name: 'Green Zebra', botanicalName: 'S. lycopersicum', daysToMaturity: 75, description: 'Unique green and yellow striped fruit, tangy flavor.', spacing: 24 },
      { name: 'San Marzano', botanicalName: 'S. lycopersicum (Paste)', daysToMaturity: 80, description: 'The gold standard for Italian tomato sauce.', spacing: 18 }
    ]
  },
  {
    id: 'c2',
    name: 'Carrot',
    botanicalName: 'Daucus carota',
    type: 'vegetable',
    daysToMaturity: 70,
    sowOutdoorsStart: 2,
    sowOutdoorsEnd: 6,
    harvestStart: 5,
    harvestEnd: 10,
    color: 'bg-orange-400',
    icon: '🥕',
    spacing: 3, // inches
    description: 'Root vegetable best grown in loose, sandy soil.',
    companions: ['Tomato', 'Leek', 'Rosemary', 'Sage', 'Chives'],
    antagonists: ['Dill', 'Parsnip', 'Fennel'],
    pests: ['Carrot Fly', 'Wireworms', 'Aphids'],
    resistance: ['Cavity Spot'],
    coldHardy: true,
    varieties: [
      { name: 'Nantes Scarlet', botanicalName: 'D. carota (Nantes)', daysToMaturity: 65, description: 'Cylindrical, sweet, and crisp. Good for storage.', spacing: 3 },
      { name: 'Imperator 58', botanicalName: 'D. carota (Imperator)', daysToMaturity: 75, description: 'Long, tapered roots. Needs deep, loose soil.', spacing: 3 },
      { name: 'Danvers 126', botanicalName: 'D. carota (Danvers)', daysToMaturity: 75, description: 'Blocky tops, good for heavy soil.', spacing: 3 },
      { name: 'Purple Haze', botanicalName: 'D. carota', daysToMaturity: 70, description: 'Purple exterior with bright orange core.', spacing: 3 },
      { name: 'Paris Market', botanicalName: 'D. carota (Round)', daysToMaturity: 55, description: 'Small round roots, perfect for containers or clay soil.', spacing: 3 }
    ]
  },
  {
    id: 'c3',
    name: 'Lettuce',
    botanicalName: 'Lactuca sativa',
    type: 'vegetable',
    daysToMaturity: 45,
    sowOutdoorsStart: 2,
    sowOutdoorsEnd: 8,
    harvestStart: 3,
    harvestEnd: 10,
    color: 'bg-green-300',
    icon: '🥬',
    spacing: 8, // inches
    description: 'Cool-weather crop, great for succession planting.',
    companions: ['Carrot', 'Radish', 'Strawberry', 'Cucumber', 'Onion'],
    antagonists: ['Broccoli', 'Beans', 'Parsley'],
    pests: ['Slugs', 'Aphids', 'Cutworms'],
    resistance: ['Downy Mildew'],
    coldHardy: true,
    varieties: [
      { name: 'Buttercrunch', botanicalName: 'L. sativa (Butterhead)', daysToMaturity: 55, description: 'Soft, buttery leaves forming loose heads.', spacing: 8 },
      { name: 'Parris Island Cos', botanicalName: 'L. sativa (Romaine)', daysToMaturity: 70, description: 'Tall heads with crunchy ribs. Heat tolerant.', spacing: 10 },
      { name: 'Iceberg', botanicalName: 'L. sativa (Crisphead)', daysToMaturity: 85, description: 'Classic crisphead lettuce, watery and crunchy.', spacing: 12 },
      { name: 'Black Seeded Simpson', botanicalName: 'L. sativa (Leaf)', daysToMaturity: 45, description: 'Fast growing loose leaf variety.', spacing: 6 },
      { name: 'Arugula', botanicalName: 'Eruca vesicaria', daysToMaturity: 40, description: 'Peppery salad green (Rocket).', spacing: 6 }
    ]
  },
  {
    id: 'c4',
    name: 'Pepper',
    botanicalName: 'Capsicum annuum',
    type: 'vegetable',
    daysToMaturity: 80,
    sowIndoorsStart: 1,
    sowIndoorsEnd: 2,
    transplantStart: 4,
    transplantEnd: 5,
    harvestStart: 7,
    harvestEnd: 9,
    color: 'bg-red-500',
    icon: '🫑',
    spacing: 18, // inches
    description: 'Heat-loving plants available in sweet and hot varieties.',
    companions: ['Basil', 'Tomato', 'Spinach', 'Onion', 'Coriander'],
    antagonists: ['Fennel', 'Kohlrabi', 'Beans'],
    pests: ['Aphids', 'Flea Beetles', 'Pepper Maggot'],
    resistance: ['Tobacco Mosaic Virus'],
    coldHardy: false,
    varieties: [
      { name: 'California Wonder', botanicalName: 'C. annuum (Bell)', daysToMaturity: 75, description: 'Standard sweet blocky bell pepper.', spacing: 18 },
      { name: 'Jalapeño M', botanicalName: 'C. annuum (Hot)', daysToMaturity: 75, description: 'Medium heat, productive. Great for salsa.', spacing: 15 },
      { name: 'Habanero Orange', botanicalName: 'Capsicum chinense', daysToMaturity: 100, description: 'Very hot, fruity flavor. Needs long warm season.', spacing: 18 },
      { name: 'Cayenne Long Thin', botanicalName: 'C. annuum (Hot)', daysToMaturity: 70, description: 'Long, thin, hot peppers for drying.', spacing: 12 },
      { name: 'Serrano', botanicalName: 'C. annuum (Hot)', daysToMaturity: 80, description: 'Hotter than Jalapeño, great for pickling.', spacing: 15 }
    ]
  },
  {
    id: 'c5',
    name: 'Basil',
    botanicalName: 'Ocimum basilicum',
    type: 'herb',
    daysToMaturity: 60,
    sowIndoorsStart: 2,
    sowIndoorsEnd: 3,
    transplantStart: 4,
    transplantEnd: 6,
    harvestStart: 5,
    harvestEnd: 9,
    color: 'bg-emerald-500',
    icon: '🌿',
    spacing: 10, // inches
    description: 'Aromatic herb essential for pest control and cooking.',
    companions: ['Tomato', 'Pepper', 'Oregano', 'Asparagus'],
    antagonists: ['Sage', 'Rue'],
    pests: ['Japanese Beetles', 'Aphids', 'Slugs'],
    resistance: ['Fusarium Wilt'],
    coldHardy: false,
    varieties: [
        { name: 'Genovese', botanicalName: 'O. basilicum', daysToMaturity: 60, description: 'Classic sweet basil for pesto.', spacing: 10 },
        { name: 'Thai Holy Basil', botanicalName: 'O. tenuiflorum', daysToMaturity: 70, description: 'Spicy, clove-like scent. Medicinal.', spacing: 12 },
        { name: 'Lemon Basil', botanicalName: 'O. x citriodorum', daysToMaturity: 60, description: 'Citrus scent, great for fish and tea.', spacing: 10 },
        { name: 'Purple Ruffles', botanicalName: 'O. basilicum', daysToMaturity: 75, description: 'Dark purple, ornamental and edible.', spacing: 12 }
    ]
  },
  {
    id: 'c6',
    name: 'Sunflower',
    botanicalName: 'Helianthus annuus',
    type: 'flower',
    daysToMaturity: 90,
    sowOutdoorsStart: 4,
    sowOutdoorsEnd: 5,
    harvestStart: 7,
    harvestEnd: 9,
    color: 'bg-yellow-300',
    icon: '🌻',
    spacing: 24, // inches
    description: 'Tall, bright flowers that attract pollinators.',
    companions: ['Corn', 'Cucumber', 'Squash', 'Pumpkins'],
    antagonists: ['Potato', 'Beans'],
    pests: ['Sunflower Moth', 'Aphids', 'Birds'],
    resistance: ['Rust'],
    coldHardy: false,
    varieties: [
        { name: 'Mammoth Grey Stripe', botanicalName: 'H. annuus', daysToMaturity: 100, description: 'Giant 10ft tall stalks with huge heads.', spacing: 24 },
        { name: 'Autumn Beauty', botanicalName: 'H. annuus', daysToMaturity: 90, description: 'Multi-branching with bronze/red/yellow blooms.', spacing: 20 },
        { name: 'Teddy Bear', botanicalName: 'H. annuus', daysToMaturity: 65, description: 'Dwarf variety with fluffy double blooms.', spacing: 12 }
    ]
  },
  {
    id: 'c7',
    name: 'Apple Tree',
    botanicalName: 'Malus domestica',
    type: 'tree',
    daysToMaturity: 1000, // Years
    transplantStart: 2,
    transplantEnd: 4,
    harvestStart: 8,
    harvestEnd: 10,
    color: 'bg-red-700',
    icon: '🍎',
    spacing: 180, // 15ft
    description: 'Perennial fruit tree. Requires chilling hours.',
    companions: ['Chives', 'Nasturtium', 'Garlic', 'Comfrey', 'Lavender'],
    antagonists: ['Potato', 'Cedar', 'Walnut'],
    pests: ['Codling Moth', 'Apple Scab', 'Aphids'],
    resistance: ['Fire Blight'],
    coldHardy: true,
    varieties: [
        { name: 'Gala', botanicalName: 'M. domestica', daysToMaturity: 1000, description: 'Sweet, aromatic. Early harvest.', spacing: 180 },
        { name: 'Fuji', botanicalName: 'M. domestica', daysToMaturity: 1000, description: 'Super sweet, crisp. Late harvest.', spacing: 180 },
        { name: 'Granny Smith', botanicalName: 'M. domestica', daysToMaturity: 1000, description: 'Tart, green. Good for baking.', spacing: 180 },
        { name: 'Honeycrisp', botanicalName: 'M. domestica', daysToMaturity: 1000, description: 'Very crisp and sweet. Cold hardy.', spacing: 180 },
        { name: 'Golden Delicious', botanicalName: 'M. domestica', daysToMaturity: 1000, description: 'Sweet, versatile, good pollinator.', spacing: 180 }
    ]
  },
  {
    id: 'c8',
    name: 'Blueberry',
    botanicalName: 'Vaccinium',
    type: 'fruit',
    daysToMaturity: 365,
    transplantStart: 3,
    transplantEnd: 5,
    harvestStart: 6,
    harvestEnd: 8,
    color: 'bg-blue-700',
    icon: '🫐',
    spacing: 48, // 4ft
    description: 'Acid-loving shrub. Requires peat or sulfur amendments.',
    companions: ['Strawberry', 'Thyme', 'Pine', 'Azalea'],
    antagonists: ['Tomato', 'Melon', 'Lime', 'Cabbage'],
    pests: ['Birds', 'Fruitworms', 'Japanese Beetles'],
    resistance: ['Root Rot'],
    coldHardy: true,
    varieties: [
        { name: 'Bluecrop', botanicalName: 'V. corymbosum', daysToMaturity: 365, description: 'Mid-season, high yield, disease resistant.', spacing: 48 },
        { name: 'Duke', botanicalName: 'V. corymbosum', daysToMaturity: 365, description: 'Early season, blooms late (avoids frost).', spacing: 48 },
        { name: 'Top Hat', botanicalName: 'V. angustifolium x', daysToMaturity: 365, description: 'Dwarf variety perfect for pots.', spacing: 24 }
    ]
  },
  {
    id: 'c9',
    name: 'Potato',
    botanicalName: 'Solanum tuberosum',
    type: 'vegetable',
    daysToMaturity: 90,
    sowOutdoorsStart: 2, // Mar
    sowOutdoorsEnd: 4, // May
    harvestStart: 6, // Jul
    harvestEnd: 9, // Oct
    color: 'bg-amber-200',
    icon: '🥔',
    spacing: 12, // inches
    description: 'Starchy tuber that needs hilling. Store in cool dark place.',
    companions: ['Beans', 'Corn', 'Cabbage', 'Horseradish', 'Marigold'],
    antagonists: ['Pumpkin', 'Tomato', 'Cucumber', 'Sunflower', 'Squash'],
    pests: ['Colorado Potato Beetle', 'Wireworms', 'Blight'],
    resistance: ['Scab'],
    coldHardy: false,
    varieties: [
        { name: 'Russet Burbank', botanicalName: 'S. tuberosum', daysToMaturity: 110, description: 'Classic baking potato. Long storage.', spacing: 12 },
        { name: 'Yukon Gold', botanicalName: 'S. tuberosum', daysToMaturity: 90, description: 'Buttery, yellow flesh. Good all-purpose.', spacing: 12 },
        { name: 'Red Pontiac', botanicalName: 'S. tuberosum', daysToMaturity: 80, description: 'Red skin, white flesh. Good for boiling.', spacing: 12 },
        { name: 'Fingerling', botanicalName: 'S. tuberosum', daysToMaturity: 100, description: 'Small, elongated, nutty flavor.', spacing: 10 }
    ]
  },
  {
    id: 'c10',
    name: 'Onion',
    botanicalName: 'Allium cepa',
    type: 'vegetable',
    daysToMaturity: 100,
    sowOutdoorsStart: 2,
    sowOutdoorsEnd: 3,
    harvestStart: 6,
    harvestEnd: 8,
    color: 'bg-yellow-100',
    icon: '🧅',
    spacing: 6, // inches
    description: 'Biennial bulb usually grown as annual. Repels many pests.',
    companions: ['Carrot', 'Beet', 'Lettuce', 'Cabbage', 'Strawberry', 'Tomato'],
    antagonists: ['Beans', 'Peas', 'Sage', 'Asparagus'],
    pests: ['Thrips', 'Onion Maggot'],
    resistance: ['Pink Root'],
    coldHardy: true,
    varieties: [
        { name: 'Walla Walla', botanicalName: 'A. cepa (Sweet)', daysToMaturity: 115, description: 'Famous sweet onion, poor storage.', spacing: 6 },
        { name: 'Red Creole', botanicalName: 'A. cepa (Red)', daysToMaturity: 110, description: 'Spicy, good for storage.', spacing: 6 },
        { name: 'Texas Grano', botanicalName: 'A. cepa (Short day)', daysToMaturity: 110, description: 'Mild, sweet, Vidalia type.', spacing: 6 },
        { name: 'Scallion', botanicalName: 'A. fistulosum', daysToMaturity: 60, description: 'Bunching onion, does not form bulb.', spacing: 2 }
    ]
  },
  {
    id: 'c11',
    name: 'Cucumber',
    botanicalName: 'Cucumis sativus',
    type: 'vegetable',
    daysToMaturity: 60,
    sowIndoorsStart: 3,
    sowIndoorsEnd: 4,
    transplantStart: 5,
    transplantEnd: 6,
    harvestStart: 6,
    harvestEnd: 9,
    color: 'bg-green-400',
    icon: '🥒',
    spacing: 12, // inches
    description: 'Vining warm-season crop. Needs trellis or space to sprawl.',
    companions: ['Beans', 'Corn', 'Peas', 'Radish', 'Sunflower'],
    antagonists: ['Potato', 'Sage', 'Melon', 'Aromatic Herbs'],
    pests: ['Cucumber Beetle', 'Squash Bug', 'Aphids'],
    resistance: ['Powdery Mildew'],
    coldHardy: false,
    varieties: [
        { name: 'Marketmore 76', botanicalName: 'C. sativus', daysToMaturity: 65, description: 'Standard dark green slicer. Disease resistant.', spacing: 12 },
        { name: 'Boston Pickling', botanicalName: 'C. sativus', daysToMaturity: 55, description: 'Short, bumpy skin. High yield for pickling.', spacing: 12 },
        { name: 'Lemon', botanicalName: 'C. sativus', daysToMaturity: 65, description: 'Round, yellow, sweet. Digestible.', spacing: 12 },
        { name: 'English Telegraph', botanicalName: 'C. sativus', daysToMaturity: 60, description: 'Long, seedless, thin skin.', spacing: 12 }
    ]
  },
  {
    id: 'c12',
    name: 'Zucchini',
    botanicalName: 'Cucurbita pepo',
    type: 'vegetable',
    daysToMaturity: 55,
    sowOutdoorsStart: 4,
    sowOutdoorsEnd: 6,
    harvestStart: 6,
    harvestEnd: 9,
    color: 'bg-green-600',
    icon: '🥗',
    spacing: 24, // inches
    description: 'Prolific summer squash. Harvest often to encourage production.',
    companions: ['Corn', 'Beans', 'Nasturtium', 'Borage'],
    antagonists: ['Potato', 'Pumpkin'],
    pests: ['Squash Bug', 'Vine Borer', 'Powdery Mildew'],
    resistance: ['Mosaic Virus'],
    coldHardy: false,
    varieties: [
        { name: 'Black Beauty', botanicalName: 'C. pepo', daysToMaturity: 50, description: 'Standard dark green zucchini.', spacing: 24 },
        { name: 'Golden Zucchini', botanicalName: 'C. pepo', daysToMaturity: 55, description: 'Bright yellow fruit, easy to find in leaves.', spacing: 24 },
        { name: 'Costata Romanesco', botanicalName: 'C. pepo', daysToMaturity: 60, description: 'Ribbed Italian variety, nutty flavor.', spacing: 24 }
    ]
  },
  {
    id: 'c13',
    name: 'Spinach',
    botanicalName: 'Spinacia oleracea',
    type: 'vegetable',
    daysToMaturity: 40,
    sowOutdoorsStart: 2,
    sowOutdoorsEnd: 4,
    harvestStart: 3,
    harvestEnd: 5,
    color: 'bg-emerald-700',
    icon: '🍃',
    spacing: 4, // inches
    description: 'Hardy leafy green. Bolts in hot weather.',
    companions: ['Strawberry', 'Cauliflower', 'Eggplant', 'Peas'],
    antagonists: ['Potato'],
    pests: ['Leaf Miners', 'Aphids'],
    resistance: ['Downy Mildew'],
    coldHardy: true,
    varieties: [
        { name: 'Bloomsdale', botanicalName: 'S. oleracea', daysToMaturity: 45, description: 'Crinkled (savoy) leaves, cold hardy.', spacing: 4 },
        { name: 'Baby Leaf', botanicalName: 'S. oleracea', daysToMaturity: 30, description: 'Smooth leaf, fast growing.', spacing: 2 },
        { name: 'Malabar', botanicalName: 'Basella alba', daysToMaturity: 70, description: 'Heat tolerant climbing spinach (different species).', spacing: 12 }
    ]
  },
  {
    id: 'c14',
    name: 'Broccoli',
    botanicalName: 'Brassica oleracea',
    type: 'vegetable',
    daysToMaturity: 80,
    sowIndoorsStart: 1,
    sowIndoorsEnd: 2,
    transplantStart: 3,
    transplantEnd: 4,
    harvestStart: 5,
    harvestEnd: 6,
    color: 'bg-green-500',
    icon: '🥦',
    spacing: 18, // inches
    description: 'Cool season crop. Heavy feeder requiring nitrogen.',
    companions: ['Dill', 'Rosemary', 'Celery', 'Onion', 'Potato'],
    antagonists: ['Mustard', 'Tomato', 'Strawberry', 'Peppers'],
    pests: ['Cabbage Worms', 'Aphids', 'Root Maggots'],
    resistance: ['Black Rot'],
    coldHardy: true,
    varieties: [
        { name: 'Calabrese', botanicalName: 'B. oleracea', daysToMaturity: 80, description: 'Standard green heading broccoli.', spacing: 18 },
        { name: 'Waltham 29', botanicalName: 'B. oleracea', daysToMaturity: 85, description: 'Cold hardy, developed for fall harvest.', spacing: 18 },
        { name: 'Purple Sprouting', botanicalName: 'B. oleracea', daysToMaturity: 90, description: 'Small purple heads, long harvest period.', spacing: 24 }
    ]
  },
  {
    id: 'c15',
    name: 'Peas',
    botanicalName: 'Pisum sativum',
    type: 'vegetable',
    daysToMaturity: 60,
    sowOutdoorsStart: 2,
    sowOutdoorsEnd: 4,
    harvestStart: 5,
    harvestEnd: 6,
    color: 'bg-lime-400',
    icon: '🫛',
    spacing: 3, // inches
    description: 'Climbing legume that fixes nitrogen. Needs cool weather.',
    companions: ['Beans', 'Carrots', 'Corn', 'Cucumber', 'Radish'],
    antagonists: ['Onion', 'Garlic', 'Shallots'],
    pests: ['Aphids', 'Pea Weevil'],
    resistance: ['Powdery Mildew'],
    coldHardy: true,
    varieties: [
        { name: 'Sugar Snap', botanicalName: 'P. sativus var. macrocarpon', daysToMaturity: 60, description: 'Plump edible pods, very sweet.', spacing: 3 },
        { name: 'Snow Pea', botanicalName: 'P. sativus var. macrocarpon', daysToMaturity: 60, description: 'Flat edible pods, used in stir-fries.', spacing: 3 },
        { name: 'Lincoln', botanicalName: 'P. sativus var. sativus', daysToMaturity: 65, description: 'Shelling pea, heat tolerant.', spacing: 3 }
    ]
  },
  {
    id: 'c16',
    name: 'Bush Beans',
    botanicalName: 'Phaseolus vulgaris',
    type: 'vegetable',
    daysToMaturity: 50,
    sowOutdoorsStart: 4,
    sowOutdoorsEnd: 6,
    harvestStart: 6,
    harvestEnd: 9,
    color: 'bg-green-500',
    icon: '🥘',
    spacing: 4, // inches
    description: 'Easy to grow nitrogen fixer. Do not transplant well.',
    companions: ['Corn', 'Squash', 'Cucumber', 'Strawberry', 'Potato'],
    antagonists: ['Onion', 'Garlic', 'Fennel', 'Sunflowers'],
    pests: ['Bean Beetle', 'Aphids'],
    resistance: ['Mosaic Virus'],
    coldHardy: false,
    varieties: [
        { name: 'Blue Lake 274', botanicalName: 'P. vulgaris', daysToMaturity: 55, description: 'Classic green bush bean. Heavy yielder.', spacing: 4 },
        { name: 'Contender', botanicalName: 'P. vulgaris', daysToMaturity: 50, description: 'Early producer, heat tolerant.', spacing: 4 },
        { name: 'Dragon Tongue', botanicalName: 'P. vulgaris', daysToMaturity: 60, description: 'Yellow pods with purple streaks. Tasty.', spacing: 4 }
    ]
  },
  {
    id: 'c17',
    name: 'Radish',
    botanicalName: 'Raphanus sativus',
    type: 'vegetable',
    daysToMaturity: 25,
    sowOutdoorsStart: 2,
    sowOutdoorsEnd: 9,
    harvestStart: 3,
    harvestEnd: 10,
    color: 'bg-rose-400',
    icon: '🧂',
    spacing: 2, // inches
    description: 'Fastest maturing crop. Good for breaking up soil.',
    companions: ['Lettuce', 'Spinach', 'Carrot', 'Cucumber', 'Peas'],
    antagonists: ['Hyssop', 'Cabbage', 'Brussels Sprouts'],
    pests: ['Flea Beetles', 'Root Maggots'],
    resistance: ['Clubroot'],
    coldHardy: true,
    varieties: [
        { name: 'Cherry Belle', botanicalName: 'R. sativus', daysToMaturity: 22, description: 'Round red radish, classic variety.', spacing: 2 },
        { name: 'French Breakfast', botanicalName: 'R. sativus', daysToMaturity: 25, description: 'Elongated, mild flavor with white tip.', spacing: 2 },
        { name: 'Daikon', botanicalName: 'R. sativus var. longipinnatus', daysToMaturity: 60, description: 'Long white Asian radish, good for tillage.', spacing: 4 }
    ]
  },
  {
    id: 'c18',
    name: 'Sweet Corn',
    botanicalName: 'Zea mays',
    type: 'vegetable',
    daysToMaturity: 80,
    sowOutdoorsStart: 4,
    sowOutdoorsEnd: 6,
    harvestStart: 7,
    harvestEnd: 9,
    color: 'bg-yellow-400',
    icon: '🌽',
    spacing: 12, // inches
    description: 'Heavy feeder. Plant in blocks for wind pollination.',
    companions: ['Beans', 'Squash', 'Pumpkin', 'Melon', 'Zucchini'],
    antagonists: ['Tomato', 'Celery'],
    pests: ['Corn Earworm', 'Borer', 'Raccoons'],
    resistance: ['Rust', 'Stewart’s Wilt'],
    coldHardy: false,
    varieties: [
        { name: 'Golden Bantam', botanicalName: 'Z. mays', daysToMaturity: 80, description: 'Old-fashioned sweet corn flavor.', spacing: 12 },
        { name: 'Silver Queen', botanicalName: 'Z. mays', daysToMaturity: 90, description: 'White kernels, very sweet late season.', spacing: 12 },
        { name: 'Peaches and Cream', botanicalName: 'Z. mays', daysToMaturity: 83, description: 'Bi-color kernels, sugar enhanced.', spacing: 12 }
    ]
  },
  {
    id: 'c19',
    name: 'Eggplant',
    botanicalName: 'Solanum melongena',
    type: 'vegetable',
    daysToMaturity: 100,
    sowIndoorsStart: 1,
    sowIndoorsEnd: 2,
    transplantStart: 5,
    transplantEnd: 6,
    harvestStart: 7,
    harvestEnd: 9,
    color: 'bg-purple-600',
    icon: '🍆',
    spacing: 18, // inches
    description: 'Heat loving plant. Keep soil evenly moist.',
    companions: ['Beans', 'Spinach', 'Pepper', 'Amaranth'],
    antagonists: ['Fennel'],
    pests: ['Flea Beetles', 'Potato Beetle', 'Spider Mites'],
    resistance: ['Verticillium Wilt'],
    coldHardy: false,
    varieties: [
        { name: 'Black Beauty', botanicalName: 'S. melongena', daysToMaturity: 80, description: 'Classic large, dark purple fruit.', spacing: 18 },
        { name: 'Ping Tung Long', botanicalName: 'S. melongena', daysToMaturity: 70, description: 'Long, slender purple Asian variety.', spacing: 18 },
        { name: 'Rosa Bianca', botanicalName: 'S. melongena', daysToMaturity: 80, description: 'Round, white and violet Italian heirloom.', spacing: 24 }
    ]
  },
  {
    id: 'c20',
    name: 'Strawberry',
    botanicalName: 'Fragaria x ananassa',
    type: 'fruit',
    daysToMaturity: 365,
    transplantStart: 3,
    transplantEnd: 4,
    harvestStart: 5,
    harvestEnd: 6,
    color: 'bg-rose-500',
    icon: '🍓',
    spacing: 12, // inches
    description: 'Perennial groundcover. Produce runners.',
    companions: ['Spinach', 'Borage', 'Lettuce', 'Onion', 'Thyme'],
    antagonists: ['Cabbage', 'Broccoli', 'Cauliflower'],
    pests: ['Slugs', 'Birds', 'Weevils'],
    resistance: ['Red Stele'],
    coldHardy: true,
    varieties: [
        { name: 'Ozark Beauty', botanicalName: 'F. x ananassa (Everbearing)', daysToMaturity: 365, description: 'Produces two crops (spring/fall). Hardy.', spacing: 12 },
        { name: 'Chandler', botanicalName: 'F. x ananassa (June-bearing)', daysToMaturity: 365, description: 'High yield in early summer. Large berries.', spacing: 12 },
        { name: 'Alpine', botanicalName: 'F. vesca', daysToMaturity: 100, description: 'Small wild strawberries, intense flavor, no runners.', spacing: 8 }
    ]
  },
  {
    id: 'c21',
    name: 'Pumpkin',
    botanicalName: 'Cucurbita pepo',
    type: 'vegetable',
    daysToMaturity: 100,
    sowOutdoorsStart: 4,
    sowOutdoorsEnd: 5,
    harvestStart: 9,
    harvestEnd: 10,
    color: 'bg-orange-500',
    icon: '🎃',
    spacing: 48, // 4ft
    description: 'Large vining plant. Needs lots of space and water.',
    companions: ['Corn', 'Beans', 'Radish', 'Nasturtium'],
    antagonists: ['Potato'],
    pests: ['Squash Bug', 'Vine Borer', 'Mildew'],
    resistance: ['Powdery Mildew'],
    coldHardy: false,
    varieties: [
        { name: 'Sugar Pie', botanicalName: 'C. pepo', daysToMaturity: 100, description: 'Small, sweet, best for baking.', spacing: 36 },
        { name: 'Connecticut Field', botanicalName: 'C. pepo', daysToMaturity: 110, description: 'Classic Jack-o-lantern pumpkin.', spacing: 48 },
        { name: 'Atlantic Giant', botanicalName: 'C. maxima', daysToMaturity: 120, description: 'Competition sized giant pumpkins.', spacing: 96 }
    ]
  },
  {
    id: 'c22',
    name: 'Garlic',
    botanicalName: 'Allium sativum',
    type: 'vegetable',
    daysToMaturity: 240,
    sowOutdoorsStart: 9, // Oct
    sowOutdoorsEnd: 10, // Nov
    harvestStart: 6, // July (next year)
    harvestEnd: 7,
    color: 'bg-stone-200',
    icon: '🧄',
    spacing: 6, // inches
    description: 'Plant cloves in fall for summer harvest.',
    companions: ['Rose', 'Fruit Trees', 'Tomato', 'Spinach'],
    antagonists: ['Peas', 'Beans', 'Sage'],
    pests: ['Nematodes', 'Thrips'],
    resistance: ['White Rot'],
    coldHardy: true,
    varieties: [
        { name: 'California Early', botanicalName: 'A. sativum (Softneck)', daysToMaturity: 240, description: 'Easy to braid, stores well.', spacing: 6 },
        { name: 'Music', botanicalName: 'A. sativum (Hardneck)', daysToMaturity: 240, description: 'Large cloves, rich flavor, produces scapes.', spacing: 6 },
        { name: 'Elephant', botanicalName: 'Allium ampeloprasum', daysToMaturity: 240, description: 'Huge mild cloves (actually a leek).', spacing: 8 }
    ]
  },
  {
    id: 'c23',
    name: 'Kale',
    botanicalName: 'Brassica oleracea',
    type: 'vegetable',
    daysToMaturity: 60,
    sowOutdoorsStart: 2,
    sowOutdoorsEnd: 6,
    harvestStart: 5,
    harvestEnd: 11,
    color: 'bg-emerald-800',
    icon: '🥬',
    spacing: 12, // inches
    description: 'Very hardy. Taste improves after frost.',
    companions: ['Beet', 'Celery', 'Onion', 'Potato', 'Herbs'],
    antagonists: ['Beans', 'Strawberry', 'Tomato'],
    pests: ['Cabbage Worms', 'Aphids'],
    resistance: ['Black Rot'],
    coldHardy: true,
    varieties: [
        { name: 'Lacinato (Dino)', botanicalName: 'B. oleracea', daysToMaturity: 60, description: 'Dark, bumpy leaves (Tuscan Kale).', spacing: 12 },
        { name: 'Red Russian', botanicalName: 'B. napus', daysToMaturity: 50, description: 'Tender leaves with purple stems.', spacing: 12 },
        { name: 'Curly Kale', botanicalName: 'B. oleracea', daysToMaturity: 55, description: 'Standard ruffled green kale.', spacing: 12 }
    ]
  },
  {
    id: 'c24',
    name: 'Watermelon',
    botanicalName: 'Citrullus lanatus',
    type: 'fruit',
    daysToMaturity: 80,
    sowOutdoorsStart: 4,
    sowOutdoorsEnd: 5,
    harvestStart: 7,
    harvestEnd: 9,
    color: 'bg-rose-300',
    icon: '🍉',
    spacing: 48, // 4ft
    description: 'Heat lover. Needs long season and warm soil.',
    companions: ['Corn', 'Okra', 'Sunflower'],
    antagonists: ['Potato', 'Zucchini'],
    pests: ['Cucumber Beetle', 'Aphids'],
    resistance: ['Anthracnose'],
    coldHardy: false,
    varieties: [
        { name: 'Sugar Baby', botanicalName: 'C. lanatus', daysToMaturity: 75, description: 'Small, round, fridge-friendly.', spacing: 36 },
        { name: 'Crimson Sweet', botanicalName: 'C. lanatus', daysToMaturity: 85, description: 'Large, striped, disease resistant.', spacing: 48 },
        { name: 'Charleston Gray', botanicalName: 'C. lanatus', daysToMaturity: 85, description: 'Elongated, light green skin.', spacing: 48 }
    ]
  },
  {
    id: 'c25',
    name: 'Beetroot',
    botanicalName: 'Beta vulgaris',
    type: 'vegetable',
    daysToMaturity: 60,
    sowOutdoorsStart: 3,
    sowOutdoorsEnd: 7,
    harvestStart: 5,
    harvestEnd: 10,
    color: 'bg-pink-800',
    icon: '🔴',
    spacing: 4, // inches
    description: 'Edible root and greens. Tolerates some shade.',
    companions: ['Onion', 'Lettuce', 'Cabbage', 'Kohlrabi'],
    antagonists: ['Beans', 'Mustard'],
    pests: ['Leaf Miners', 'Flea Beetles'],
    resistance: ['Cercospora'],
    coldHardy: true,
    varieties: [
        { name: 'Detroit Dark Red', botanicalName: 'B. vulgaris', daysToMaturity: 55, description: 'Standard deep red beet.', spacing: 4 },
        { name: 'Chioggia', botanicalName: 'B. vulgaris', daysToMaturity: 55, description: 'Candy cane striped interior.', spacing: 4 },
        { name: 'Golden Beet', botanicalName: 'B. vulgaris', daysToMaturity: 60, description: 'Yellow flesh, milder flavor.', spacing: 4 }
    ]
  },
  {
    id: 'c26',
    name: 'Asparagus',
    botanicalName: 'Asparagus officinalis',
    type: 'vegetable',
    daysToMaturity: 730, // 2 years to establish
    transplantStart: 3,
    transplantEnd: 4,
    harvestStart: 4,
    harvestEnd: 6,
    color: 'bg-emerald-400',
    icon: '🎋',
    spacing: 18, // inches
    description: 'Perennial vegetable. Harvest spears in spring after establishment.',
    companions: ['Tomato', 'Parsley', 'Basil', 'Dill'],
    antagonists: ['Onion', 'Garlic', 'Potato'],
    pests: ['Asparagus Beetle'],
    resistance: ['Rust'],
    coldHardy: true,
    varieties: [
        { name: 'Mary Washington', botanicalName: 'A. officinalis', daysToMaturity: 730, description: 'Heirloom, rust resistant.', spacing: 18 },
        { name: 'Jersey Knight', botanicalName: 'A. officinalis', daysToMaturity: 730, description: 'All-male hybrid, higher yield.', spacing: 18 },
        { name: 'Purple Passion', botanicalName: 'A. officinalis', daysToMaturity: 730, description: 'Purple spears, sweeter flavor.', spacing: 18 }
    ]
  },
  {
    id: 'c27',
    name: 'Raspberry',
    botanicalName: 'Rubus idaeus',
    type: 'fruit',
    daysToMaturity: 365,
    transplantStart: 3,
    transplantEnd: 4,
    harvestStart: 6,
    harvestEnd: 9,
    color: 'bg-pink-600',
    icon: '🍇',
    spacing: 24, // inches
    description: 'Perennial cane fruit. Needs support/trellis.',
    companions: ['Garlic', 'Tansy', 'Turnip'],
    antagonists: ['Potato', 'Tomato', 'Eggplant'],
    pests: ['Birds', 'Japanese Beetles'],
    resistance: ['Root Rot'],
    coldHardy: true,
    varieties: [
        { name: 'Heritage', botanicalName: 'R. idaeus', daysToMaturity: 365, description: 'Everbearing, produces fall crop.', spacing: 24 },
        { name: 'Tulameen', botanicalName: 'R. idaeus', daysToMaturity: 365, description: 'Summer bearing, large sweet fruit.', spacing: 24 },
        { name: 'Caroline', botanicalName: 'R. idaeus', daysToMaturity: 365, description: 'Very productive red raspberry.', spacing: 24 }
    ]
  },
  {
    id: 'c28',
    name: 'Blackberry',
    botanicalName: 'Rubus fruticosus',
    type: 'fruit',
    daysToMaturity: 365,
    transplantStart: 3,
    transplantEnd: 4,
    harvestStart: 7,
    harvestEnd: 8,
    color: 'bg-indigo-900',
    icon: '🫐',
    spacing: 48, // 4ft
    description: 'Vigorous cane fruit. Thorny or thornless varieties.',
    companions: ['Tansy', 'Mint', 'Beans'],
    antagonists: ['Raspberry', 'Nightshades'],
    pests: ['Birds', 'Stink Bugs'],
    resistance: ['Rust'],
    coldHardy: true,
    varieties: [
        { name: 'Triple Crown', botanicalName: 'R. fruticosus', daysToMaturity: 365, description: 'Thornless, semi-erect, huge berries.', spacing: 60 },
        { name: 'Chester', botanicalName: 'R. fruticosus', daysToMaturity: 365, description: 'Thornless, very cold hardy.', spacing: 60 }
    ]
  },
  {
    id: 'c29',
    name: 'Grape',
    botanicalName: 'Vitis vinifera',
    type: 'fruit',
    daysToMaturity: 365,
    transplantStart: 3,
    transplantEnd: 4,
    harvestStart: 8,
    harvestEnd: 10,
    color: 'bg-purple-500',
    icon: '🍇',
    spacing: 72, // 6ft
    description: 'Vining fruit requiring sturdy trellis and pruning.',
    companions: ['Hyssop', 'Basil', 'Geranium', 'Clover'],
    antagonists: ['Cabbage', 'Radish'],
    pests: ['Birds', 'Japanese Beetles', 'Wasps'],
    resistance: ['Black Rot'],
    coldHardy: true,
    varieties: [
        { name: 'Concord', botanicalName: 'V. labrusca', daysToMaturity: 365, description: 'Classic jelly/juice grape. Cold hardy.', spacing: 72 },
        { name: 'Thompson Seedless', botanicalName: 'V. vinifera', daysToMaturity: 365, description: 'Green table grape, needs heat.', spacing: 72 },
        { name: 'Cabernet Sauvignon', botanicalName: 'V. vinifera', daysToMaturity: 365, description: 'Wine grape, small berries.', spacing: 72 }
    ]
  },
  {
    id: 'c30',
    name: 'Peach Tree',
    botanicalName: 'Prunus persica',
    type: 'tree',
    daysToMaturity: 1000,
    transplantStart: 2,
    transplantEnd: 4,
    harvestStart: 7,
    harvestEnd: 8,
    color: 'bg-orange-300',
    icon: '🍑',
    spacing: 180, // 15ft
    description: 'Stone fruit requiring good drainage and pruning.',
    companions: ['Garlic', 'Onion', 'Asparagus', 'Basil'],
    antagonists: ['Tomato', 'Potato', 'Raspberry'],
    pests: ['Borers', 'Aphids', 'Curculio'],
    resistance: ['Leaf Curl'],
    coldHardy: true,
    varieties: [
        { name: 'Elberta', botanicalName: 'P. persica', daysToMaturity: 1000, description: 'Classic yellow peach, good for canning.', spacing: 180 },
        { name: 'Redhaven', botanicalName: 'P. persica', daysToMaturity: 1000, description: 'Top variety, freestone, disease resistant.', spacing: 180 },
        { name: 'Saturn (Donut)', botanicalName: 'P. persica', daysToMaturity: 1000, description: 'Flat, sweet, white flesh.', spacing: 180 }
    ]
  },
  {
    id: 'c31',
    name: 'Pear Tree',
    botanicalName: 'Pyrus communis',
    type: 'tree',
    daysToMaturity: 1000,
    transplantStart: 2,
    transplantEnd: 4,
    harvestStart: 8,
    harvestEnd: 10,
    color: 'bg-lime-200',
    icon: '🍐',
    spacing: 180, // 15ft
    description: 'Long-lived fruit tree. Harvest before fully ripe.',
    companions: ['Clover', 'Chives', 'Nasturtium'],
    antagonists: ['Potato', 'Cedar'],
    pests: ['Psylla', 'Codling Moth'],
    resistance: ['Fire Blight'],
    coldHardy: true,
    varieties: [
        { name: 'Bartlett', botanicalName: 'P. communis', daysToMaturity: 1000, description: 'Standard yellow pear, juicy.', spacing: 180 },
        { name: 'Bosc', botanicalName: 'P. communis', daysToMaturity: 1000, description: 'Brown skin, crisp flesh.', spacing: 180 },
        { name: 'Anjou', botanicalName: 'P. communis', daysToMaturity: 1000, description: 'Green or red, keeps well.', spacing: 180 }
    ]
  },
  {
    id: 'c32',
    name: 'Cherry Tree',
    botanicalName: 'Prunus avium',
    type: 'tree',
    daysToMaturity: 1000,
    transplantStart: 2,
    transplantEnd: 4,
    harvestStart: 6,
    harvestEnd: 7,
    color: 'bg-red-800',
    icon: '🍒',
    spacing: 180, // 15ft
    description: 'Sweet or tart stone fruit. Birds love them.',
    companions: ['Garlic', 'Chives', 'Marigold'],
    antagonists: ['Potato', 'Wheat'],
    pests: ['Birds', 'Aphids', 'Fruit Fly'],
    resistance: ['Canker'],
    coldHardy: true,
    varieties: [
        { name: 'Bing', botanicalName: 'P. avium', daysToMaturity: 1000, description: 'Classic dark red sweet cherry.', spacing: 180 },
        { name: 'Rainier', botanicalName: 'P. avium', daysToMaturity: 1000, description: 'Yellow/red blush, very sweet.', spacing: 180 },
        { name: 'Montmorency', botanicalName: 'P. cerasus', daysToMaturity: 1000, description: 'Tart cherry, standard for pies.', spacing: 180 }
    ]
  },
  {
    id: 'c33',
    name: 'Plum Tree',
    botanicalName: 'Prunus domestica',
    type: 'tree',
    daysToMaturity: 1000,
    transplantStart: 2,
    transplantEnd: 4,
    harvestStart: 7,
    harvestEnd: 9,
    color: 'bg-purple-800',
    icon: '🟣',
    spacing: 180, // 15ft
    description: 'Hardy stone fruit. European and Japanese types.',
    companions: ['Garlic', 'Comfrey', 'Dill'],
    antagonists: ['Potato'],
    pests: ['Curculio', 'Aphids'],
    resistance: ['Black Knot'],
    coldHardy: true,
    varieties: [
        { name: 'Santa Rosa', botanicalName: 'P. salicina', daysToMaturity: 1000, description: 'Japanese plum, sweet/tart.', spacing: 180 },
        { name: 'Stanley', botanicalName: 'P. domestica', daysToMaturity: 1000, description: 'European prune plum, sweet.', spacing: 180 },
        { name: 'Methley', botanicalName: 'P. salicina', daysToMaturity: 1000, description: 'Early, red flesh, mild.', spacing: 180 }
    ]
  },
  {
    id: 'c34',
    name: 'Fig Tree',
    botanicalName: 'Ficus carica',
    type: 'tree',
    daysToMaturity: 1000,
    transplantStart: 3,
    transplantEnd: 5,
    harvestStart: 8,
    harvestEnd: 10,
    color: 'bg-amber-700',
    icon: '🏺',
    spacing: 120, // 10ft
    description: 'Ancient fruit, warm climate or pots. Roots can be invasive.',
    companions: ['Strawberry', 'Rue', 'Mint'],
    antagonists: [],
    pests: ['Birds', 'Ants', 'Nematodes'],
    resistance: ['Heat'],
    coldHardy: false,
    varieties: [
        { name: 'Brown Turkey', botanicalName: 'F. carica', daysToMaturity: 1000, description: 'Hardy, productive, brownish-purple.', spacing: 120 },
        { name: 'Celeste', botanicalName: 'F. carica', daysToMaturity: 1000, description: 'Sugar fig, small and sweet.', spacing: 120 },
        { name: 'Black Mission', botanicalName: 'F. carica', daysToMaturity: 1000, description: 'Dark purple, rich flavor.', spacing: 120 }
    ]
  },
  {
    id: 'c35',
    name: 'Lemon Tree',
    botanicalName: 'Citrus limon',
    type: 'tree',
    daysToMaturity: 1000,
    transplantStart: 3,
    transplantEnd: 5,
    harvestStart: 11,
    harvestEnd: 4, // Winter harvest often
    color: 'bg-yellow-300',
    icon: '🍋',
    spacing: 120, // 10ft
    description: 'Evergreen citrus. Needs warmth or indoor wintering.',
    companions: ['Dill', 'Yarrow', 'Fennel'],
    antagonists: [],
    pests: ['Scale', 'Aphids', 'Mites'],
    resistance: ['Canker'],
    coldHardy: false,
    varieties: [
        { name: 'Meyer', botanicalName: 'C. x meyeri', daysToMaturity: 1000, description: 'Sweeter, thinner skin, cold tolerant.', spacing: 120 },
        { name: 'Eureka', botanicalName: 'C. limon', daysToMaturity: 1000, description: 'Standard grocery store lemon.', spacing: 120 }
    ]
  },
  {
    id: 'c36',
    name: 'Okra',
    botanicalName: 'Abelmoschus esculentus',
    type: 'vegetable',
    daysToMaturity: 60,
    sowOutdoorsStart: 5,
    sowOutdoorsEnd: 6,
    harvestStart: 7,
    harvestEnd: 9,
    color: 'bg-green-200',
    icon: '🥬',
    spacing: 12, // inches
    description: 'Heat lover with beautiful hibiscus-like flowers.',
    companions: ['Pepper', 'Eggplant', 'Melon'],
    antagonists: [],
    pests: ['Aphids', 'Ants'],
    resistance: ['Heat'],
    coldHardy: false,
    varieties: [
        { name: 'Clemson Spineless', botanicalName: 'A. esculentus', daysToMaturity: 55, description: 'Classic variety, less prickly.', spacing: 12 },
        { name: 'Burgundy', botanicalName: 'A. esculentus', daysToMaturity: 60, description: 'Red pods, ornamental.', spacing: 12 }
    ]
  },
  {
    id: 'c37',
    name: 'Sweet Potato',
    botanicalName: 'Ipomoea batatas',
    type: 'vegetable',
    daysToMaturity: 100,
    transplantStart: 5,
    transplantEnd: 6,
    harvestStart: 9,
    harvestEnd: 10,
    color: 'bg-orange-600',
    icon: '🍠',
    spacing: 12, // inches
    description: 'Vining tropical tuber. Needs hot summer.',
    companions: ['Dill', 'Thyme', 'Beet'],
    antagonists: ['Squash', 'Tomato'],
    pests: ['Weevils', 'Wireworms'],
    resistance: ['Heat'],
    coldHardy: false,
    varieties: [
        { name: 'Beauregard', botanicalName: 'I. batatas', daysToMaturity: 100, description: 'Standard orange flesh, reliable.', spacing: 12 },
        { name: 'Vardaman', botanicalName: 'I. batatas', daysToMaturity: 110, description: 'Bush type, ideal for small spaces.', spacing: 12 }
    ]
  },
  {
    id: 'c38',
    name: 'Aloe Vera',
    botanicalName: 'Aloe vera',
    type: 'herb',
    daysToMaturity: 365,
    transplantStart: 4,
    transplantEnd: 8,
    harvestStart: 1,
    harvestEnd: 12,
    color: 'bg-emerald-300',
    icon: '🪴',
    spacing: 18, // inches
    description: 'Succulent medicinal plant. Gel soothes burns.',
    companions: ['Onion', 'Borage'],
    antagonists: [],
    pests: ['Mealybugs', 'Scale'],
    resistance: ['Drought'],
    coldHardy: false,
    varieties: [
        { name: 'Barbadensis Miller', botanicalName: 'Aloe vera', daysToMaturity: 365, description: 'True medicinal aloe.', spacing: 18 }
    ]
  },
  {
    id: 'c39',
    name: 'Lavender',
    botanicalName: 'Lavandula',
    type: 'herb',
    daysToMaturity: 365,
    transplantStart: 4,
    transplantEnd: 5,
    harvestStart: 6,
    harvestEnd: 8,
    color: 'bg-purple-300',
    icon: '🪻',
    spacing: 18, // inches
    description: 'Aromatic perennial. Attracts bees, repels pests.',
    companions: ['Rose', 'Cabbage', 'Fruit Trees'],
    antagonists: [],
    pests: ['Spittlebugs'],
    resistance: ['Drought', 'Deer'],
    coldHardy: true,
    varieties: [
        { name: 'Munstead', botanicalName: 'L. angustifolia', daysToMaturity: 365, description: 'English lavender, cold hardy.', spacing: 18 },
        { name: 'Hidcote', botanicalName: 'L. angustifolia', daysToMaturity: 365, description: 'Deep purple flowers, compact.', spacing: 12 },
        { name: 'Provence', botanicalName: 'L. x intermedia', daysToMaturity: 365, description: 'French lavender, tall, fragrant.', spacing: 24 }
    ]
  },
  {
    id: 'c40',
    name: 'Chamomile',
    botanicalName: 'Matricaria chamomilla',
    type: 'herb',
    daysToMaturity: 60,
    sowOutdoorsStart: 3,
    sowOutdoorsEnd: 4,
    harvestStart: 5,
    harvestEnd: 7,
    color: 'bg-yellow-100',
    icon: '🌼',
    spacing: 8, // inches
    description: 'Medicinal tea herb. Small daisy-like flowers.',
    companions: ['Cabbage', 'Onion', 'Cucumber'],
    antagonists: [],
    pests: ['Aphids'],
    resistance: [],
    coldHardy: false,
    varieties: [
        { name: 'German', botanicalName: 'M. chamomilla', daysToMaturity: 60, description: 'Annual, upright, high yield.', spacing: 8 },
        { name: 'Roman', botanicalName: 'Chamaemelum nobile', daysToMaturity: 65, description: 'Perennial groundcover.', spacing: 8 }
    ]
  },
  {
    id: 'c41',
    name: 'Mint',
    botanicalName: 'Mentha',
    type: 'herb',
    daysToMaturity: 60,
    transplantStart: 4,
    transplantEnd: 6,
    harvestStart: 5,
    harvestEnd: 10,
    color: 'bg-green-400',
    icon: '🌿',
    spacing: 12, // inches
    description: 'Invasive perennial. Plant in pots! Great for tea.',
    companions: ['Cabbage', 'Tomato', 'Peas'],
    antagonists: ['Parsley', 'Chamomile'],
    pests: ['Aphids', 'Spider Mites'],
    resistance: ['Deer'],
    coldHardy: true,
    varieties: [
        { name: 'Peppermint', botanicalName: 'M. x piperita', daysToMaturity: 60, description: 'Strong menthol flavor.', spacing: 12 },
        { name: 'Spearmint', botanicalName: 'M. spicata', daysToMaturity: 60, description: 'Sweeter, classic mint flavor.', spacing: 12 },
        { name: 'Chocolate Mint', botanicalName: 'M. x piperita', daysToMaturity: 60, description: 'Dark leaves, chocolate aroma.', spacing: 12 }
    ]
  }
];

export const GRID_SIZE = 40; // pixels per foot
