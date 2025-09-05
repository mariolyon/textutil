export function assert(condition, message) {
    if (!condition) {
        throw message || "Condition unmet.";
    }
}


export function assertType(value, typ) {
    assert(typeof value === typ, `${value} is not of the expected type ${typ}`)
}

export function linesFrom(doc) {
    assertType(doc, 'string')
    return doc.trim().split('\n')
}

export class Level {
    static headingRegex = new RegExp("^(#+)");
    static listRegex = new RegExp("^( *-)");

    constructor(value) {
        assertType(value, 'string')
        this.level = Level.levelFor(value)
    }

    static levelFor(value) {
        if (this.headingRegex.test(value)) {
            return value.match(this.headingRegex)[0]
        } else if (this.listRegex.test(value)) {
            return value.match(this.listRegex)[0]
        } else {
            return ''
        }
    }

    encloses(that) {
        assert(that instanceof Level)
        if (this.level.startsWith('#')) {
            if (that.level.startsWith('#')) {
                return this.level.length < that.level.length
            }

            return true
        }

        if (this.level.includes('-')) {
            if (that.level.includes('-')) {
                return this.level.length < that.level.length
            }

            if (that.level.includes('#')) {
                return false
            }

            return true
        }

        if (that.level.includes('-')) {
            return that.level.length > 1
        }

        return false;
    }
}


export function blocksFrom(doc, tag) {
    const lines = linesFrom(doc)
    const blocks = []
    let blockLines = []
    let blockLevel = ''


    for (const line of lines) {
        if (blockLines.length > 0) {
            const lineLevel = new Level(line)

            if (blockLevel.encloses(lineLevel)) {
                blockLines.push(line)
            } else {
                if (blockLines.length > 1) {
                    blockLines.splice(0, 1)
                }

                blocks.push(blockLines)
                blockLines = []
            }

            continue
        }

        if (line.includes(`#${tag}`)) {
            blockLevel = new Level(line)
            blockLines = []
            blockLines.push(line)
            continue
        }
    }

    return blocks
}
