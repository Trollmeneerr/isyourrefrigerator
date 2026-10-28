/* =========================================================================
   Checklist contents. Edit this file to change what shows up on the page.
   Item names only need to be unique inside their own list.
   ========================================================================= */

// Turns a pasted block of text (one name per line) into an array.
const lines = text => text.split('\n').map(s => s.trim()).filter(Boolean);

// Build 42: 24 skills x 5 volumes = 120 skill books.
const BOOK_SKILLS = [
    'Agriculture', 'Aiming', 'Animal Care', 'Blacksmithing', 'Butchering', 'Carpentry',
    'Carving', 'Cooking', 'Electrical', 'First Aid', 'Fishing', 'Foraging',
    'Glassmaking', 'Knapping', 'Long Blade', 'Maintenance', 'Masonry', 'Mechanics',
    'Pottery', 'Reloading', 'Tailoring', 'Tracking', 'Trapping', 'Welding'
];
const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

window.ZOMBOID_LISTS = {
    books: {
        title: 'Skill books',
        note: 'All 120 Build 42 skill books, five volumes per skill.',
        // Books are grouped by skill so 120 checkboxes stay easy to scan.
        groups: BOOK_SKILLS.map(skill => ({
            name: skill,
            items: ROMAN.map(n => `${skill} ${n}`)
        }))
    },

    vhs: {
        title: 'VHS tapes',
        note: 'Home and retail tapes.',
        // Paste one tape name per line between the backticks.
        items: lines(`
        `)
    },

    magazines: {
        title: 'Skill magazines',
        note: 'Recipe magazines that unlock crafting recipes.',
        // Paste one magazine name per line between the backticks.
        items: lines(`
        `)
    }
};