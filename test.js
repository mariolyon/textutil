import test from 'ava';
import { linesFrom, blocksFrom, Level } from './main.js';

const doc = `
- ideas: #ideas
    - great idea #idea
    - cool idea #idea
    - iffy suggestion #suggestion
- gratitude

## Poem #poem
Verse1
Verse2

### Subpoem
SubVerse1
SubVerse2

# Article
`

const smallDoc = `
a
b
`


test('lines should return an array', t => {
    t.deepEqual(linesFrom(''), ['']);
    t.deepEqual(linesFrom(smallDoc), ['a', 'b']);
    //t.is(lines('A\nB'))
})


test('return tagged line', t => {
    t.pass();
});


test('Level.levelFor', t => {
    t.is('##', Level.levelFor("##"))
    t.is('', Level.levelFor("xyz"))
    t.is('-', Level.levelFor("- abc"))
    t.is('  -', Level.levelFor("  - nop"))
})

test('Level.encloses', t => {
    t.true((new Level("##")).encloses(new Level('###')))
    t.false((new Level("###")).encloses(new Level('###')))
    t.false((new Level("####")).encloses(new Level('###')))
    t.true((new Level("##")).encloses(new Level('- abc')))

    t.true((new Level("- ")).encloses(new Level('  -')))
    t.false((new Level("- ")).encloses(new Level('# title')))
    t.true((new Level("- ")).encloses(new Level('some data')))

    t.false((new Level("xyz")).encloses(new Level('some data')))
    t.false((new Level("xyz")).encloses(new Level('#')))
    t.false((new Level("xyz")).encloses(new Level('- ')))
    t.true((new Level("xyz")).encloses(new Level(' -')))
})

test('blocksFrom', t => {
    t.deepEqual([], blocksFrom("##"))
    t.deepEqual([
        ['    - iffy suggestion #suggestion']
    ], blocksFrom(doc, "suggestion"))
    t.deepEqual([
        [
            '    - great idea #idea',
            '    - cool idea #idea',
            '    - iffy suggestion #suggestion',
        ]
    ], blocksFrom(doc, "ideas"))
})
