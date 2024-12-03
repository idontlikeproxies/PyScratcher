// Conversion rules mapping Python code with named placeholders to Scratchblocks equivalents
const conversionRules = [
    {
        python: "{var:num} += 1",
        scratch: "set ({var} v) to (({var}) + (1))",
        placeholders: {
            var: 'num'
        }
    },
    {
        python: "if {condition:num}:",
        scratch: "if <({condition})> then",
        placeholders: {
            condition: 'num'
        }
    },
    {
        python: "{list:list}.append({item:txt})",
        scratch: "add ({item}) to ({list})",
        placeholders: {
            list: 'list',
            item: 'txt'
        }
    }
];

// Function to convert Python code to Scratchblocks using named placeholders
function convertPythonToScratch(pythonCode) {
    for (let rule of conversionRules) {
        const matchData = matchWithNamedPlaceholders(pythonCode, rule.python, rule.placeholders);
        if (matchData) {
            let scratchCode = rule.scratch;
            // Replace named placeholders in the Scratch template
            for (let [placeholderName, value] of Object.entries(matchData)) {
                scratchCode = scratchCode.replaceAll(`{${placeholderName}}`, value);
            }
            return scratchCode;
        }
    }
    // Default: Return the Python code if no match is found (can be customized)
    return pythonCode;
}

// Helper function to match Python code with named placeholders and extract values
function matchWithNamedPlaceholders(pythonCode, pythonTemplate, placeholders) {
    let regexString = pythonTemplate;
    const regexReplacements = {};

    // Build a regex from the template, replacing placeholders with regex patterns
    for (let [name, type] of Object.entries(placeholders)) {
        const typePattern = getTypePattern(type); // Get regex based on type
        regexReplacements[name] = typePattern;
        regexString = regexString.replace(`{${name}:${type}}`, `(${typePattern})`);
    }

    const regex = new RegExp(regexString);
    const match = pythonCode.match(regex);
    
    if (match) {
        const extractedValues = {};
        let matchIndex = 1; // Match groups start at index 1
        for (let name of Object.keys(regexReplacements)) {
            extractedValues[name] = match[matchIndex];
            matchIndex++;
        }
        return extractedValues; // Return matched placeholder values
    }
    return null;
}

// Helper function to return regex pattern for different types (num, list, txt)
function getTypePattern(type) {
    switch (type) {
        case 'num':
            return '\\w+'; // Simplified pattern for numeric variables (e.g., variable names)
        case 'list':
            return '\\w+'; // Simplified pattern for list variables
        case 'txt':
            return '".+"'; // Pattern for string literals
        default:
            return '\\w+'; // Default pattern for other variable types
    }
}
