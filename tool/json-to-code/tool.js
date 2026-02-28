const JSONToCodeConverter = {
    init() {
        this.jsonInput = document.getElementById('json-input');
        this.languageSelect = document.getElementById('language-select');
        this.variableNameInput = document.getElementById('variable-name');
        this.outputText = document.getElementById('output-text');
        
        document.getElementById('generate-btn').addEventListener('click', () => this.generate());
        document.getElementById('format-json-btn').addEventListener('click', () => this.formatJson());
        document.getElementById('minify-json-btn').addEventListener('click', () => this.minify());
        document.getElementById('validate-json-btn').addEventListener('click', () => this.validate());
        document.getElementById('copy-btn').addEventListener('click', () => this.copy());
        document.getElementById('download-btn').addEventListener('click', () => this.download());
        document.getElementById('clear-btn').addEventListener('click', () => this.clear());
    },
    
    generate() {
        try {
            const json = this.jsonInput.value;
            const lang = this.languageSelect.value;
            const varName = this.variableNameInput.value || 'data';
            const indent = document.getElementById('indent-check').checked;
            let code = '';
            
            switch (lang) {
                case 'javascript':
                    code = this.jsToJS(json, varName, indent);
                    break;
                case 'javascript-class':
                    code = this.jsToJSClass(json, varName, indent);
                    break;
                case 'typescript':
                    code = this.jsToTS(json, varName, indent);
                    break;
                case 'typescript-interface':
                    code = this.jsToTSInterface(json, varName, indent);
                    break;
                case 'python':
                    code = this.jsToPython(json, varName);
                    break;
                case 'python-dataclass':
                    code = this.jsToPythonDataclass(json, varName);
                    break;
                case 'python-pydantic':
                    code = this.jsToPythonPydantic(json, varName);
                    break;
                case 'go':
                    code = this.jsToGo(json, varName, indent);
                    break;
                case 'go-struct':
                    code = this.jsToGoStruct(json, varName);
                    break;
                case 'java':
                    code = this.jsToJava(json, varName, indent);
                    break;
                case 'java-class':
                    code = this.jsToJavaClass(json, varName, indent);
                    break;
                case 'rust':
                    code = this.jsToRust(json, varName, indent);
                    break;
                case 'rust-struct':
                    code = this.jsToRustStruct(json, varName, indent);
                    break;
                case 'cpp':
                    code = this.jsToCpp(json, varName, indent);
                    break;
                case 'c':
                    code = this.jsToC(json, varName, indent);
                    break;
                case 'csharp':
                    code = this.jsToCSharp(json, varName, indent);
                    break;
                case 'csharp-class':
                    code = this.jsToCSharpClass(json, varName, indent);
                    break;
                case 'kotlin':
                    code = this.jsToKotlin(json, varName, indent);
                    break;
                case 'swift':
                    code = this.jsToSwift(json, varName, indent);
                    break;
                case 'php':
                    code = this.jsToPHP(json, varName, indent);
                    break;
                case 'lua':
                    code = this.jsToLua(json, varName, indent);
                    break;
                case 'ruby':
                    code = this.jsToRuby(json, varName, indent);
                    break;
                case 'json-schema':
                    code = this.jsToJSONSchema(json, varName, indent);
                    break;
                case 'xml':
                    code = this.jsToXML(json, varName, indent);
                    break;
                case 'sql-create-table':
                    code = this.jsToSQL(json, varName);
                    break;
                case 'yaml':
                    code = this.jsToYAML(json, varName, indent);
                    break;
                case 'toml':
                    code = this.jsToTOML(json, varName, indent);
                    break;
                case 'ini':
                    code = this.jsToINI(json, varName, indent);
                    break;
                default:
                    code = json;
            }
            
            this.outputText.value = code;
        } catch (e) {
            this.outputText.value = 'Error: ' + e.message;
        }
    },
    
    formatJson() {
        try {
            const json = this.jsonInput.value;
            this.jsonInput.value = JSON.stringify(JSON.parse(json), null, 2);
        } catch (e) {
            this.outputText.value = 'Error: ' + e.message;
        }
    },
    
    minify() {
        try {
            const json = this.jsonInput.value;
            this.jsonInput.value = JSON.stringify(JSON.parse(json));
        } catch (e) {
            this.outputText.value = 'Error: ' + e.message;
        }
    },
    
    validate() {
        try {
            const json = this.jsonInput.value;
            JSON.parse(json);
            this.outputText.value = 'Valid JSON';
        } catch (e) {
            this.outputText.value = 'Invalid JSON: ' + e.message;
        }
    },
    
    copy() {
        const text = this.outputText.value;
        if (!text) return;
        
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-btn');
            btn.textContent = '已复制!';
            setTimeout(() => btn.textContent = '复制结果', 1500);
        });
    },
    
    download() {
        const text = this.outputText.value;
        const lang = this.languageSelect.value;
        if (!text) return;
        
        let ext = 'txt';
        if (['javascript', 'javascript-class'].includes(lang)) ext = 'js';
        else if (['typescript', 'typescript-interface'].includes(lang)) ext = 'ts';
        else if (['python', 'python-dataclass', 'python-pydantic'].includes(lang)) ext = 'py';
        else if (['go', 'go-struct'].includes(lang)) ext = 'go';
        else if (['java', 'java-class'].includes(lang)) ext = 'java';
        else if (['rust', 'rust-struct'].includes(lang)) ext = 'rs';
        else if (['c', 'csharp', 'csharp-class'].includes(lang)) ext = 'cpp';
        else if (['swift'].includes(lang)) ext = 'swift';
        else if (['kotlin'].includes(lang)) ext = 'kt';
        else if (['lua'].includes(lang)) ext = 'lua';
        else if (['php'].includes(lang)) ext = 'php';
        else if (['csharp'].includes(lang)) ext = 'cs';
        else if (['yaml'].includes(lang)) ext = 'yml';
        else if (['toml'].includes(lang)) ext = 'toml';
        else if (['xml'].includes(lang)) ext = 'xml';
        else if (['json-schema'].includes(lang)) ext = 'json';
        else if (['sql-create-table'].includes(lang)) ext = 'sql';
        else if (['ini'].includes(lang)) ext = 'ini';
        else if (['ruby'].includes(lang)) ext = 'rb';
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.' + ext;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    clear() {
        this.jsonInput.value = '';
        this.outputText.value = '';
        this.variableNameInput.value = 'data';
        this.languageSelect.value = 'javascript';
        document.getElementById('indent-check').checked = true;
        document.getElementById('camelcase-check').checked = true;
        document.getElementById('snakecase-check').checked = false;
        this.outputText.value = '输出结果将显示在这里...';
    },
    
    jsToJS(json, varName, indent = 2) {
        try {
            const data = JSON.parse(json);
            return `${varName} = ` + JSON.stringify(data, null, indent);
        } catch (e) {
            return 'Error: ' + e.message;
        }
    },
    
    jsToJSClass(json, varName, indent = 2) {
        try {
            const data = JSON.parse(json);
            const keys = Object.keys(data);
            return `class ${varName} {\n` + keys.map(key => `    ${key}: string | number;\n`).join('') + `}`;
        } catch (e) {
            return 'Error: ' + e.message;
        }
    },
    
    jsToTS(json, varName, indent = 2) {
        try {
            const data = JSON.parse(json);
            return `const ${varName}: any = ${JSON.stringify(data, null, indent)}`;
        } catch (e) {
            return 'Error: ' + e.error;
        }
    },
    
    jsToTSInterface(json, varName, indent = 2) {
        try {
            const data = JSON.parse(json);
            const keys = Object.keys(data);
            return `interface ${varName} {\n` + keys.map(key => `    ${key}: string | number;\n`).join('') + `}`;
        } catch (e) {
            return 'Error: ' + e.message;
        }
    },
    
    jsToPython(json, varName) {
        try {
            const data = JSON.parse(json);
            return `${varName} = ${JSON.stringify(data)}`;
        } catch (e) {
            return 'Error: ' + e.message;
        }
    },
    
    jsToPythonDataclass(json, varName) {
        try {
            const data = JSON.parse(json);
            const keys = Object.keys(data);
            return `from dataclasses import dataclass\n\n@dataclass\nclass ${varName}:\n` + keys.map(key => `    ${key}: str\ndefault=None\n`).join('') + `)\n`);
        } catch (e) {
            return 'Error: ' + e.message;
        }
    },
    
    jsToGo(json, varName, indent = 2) {
        try {
            const data = JSON.parse(json);
            return `package main\n\n` + this.jsToGoStruct(json, varName, indent);
        } catch (e) {
            return 'Error: ' + e.message;
        }
    },
    
    jsToGoStruct(json, varName, indent = 2) {
        try {
            const data = JSON.parse(json);
            const keys = Object.keys(data);
            return `type ${varName} struct {\n` + keys.map(key => `    ${key} string `).join(' `json:"` + key + `"\n`) + `}`;
        } catch (e) {
            return 'Error: ' + e.message;
        }
    },
    
    jsToJava(json, varName, indent = 2) {
        try {
            const data = JSON.parse(json);
            return `public class ${varName} {\n` + this.jsToJavaClass(json, varName, indent);
        } catch (e) {
            return 'Error: ' + e.message;
        }
    },
    
    jsToJavaClass(json, varName, indent = 2) {
        try {
            const data = JSON.parse(json);
            const keys = Object.keys(data);
            return `package com.example;\n\nimport com.fasterxml.jackson.annotation.JsonProperty;\n\npublic class ${varName} {\n` + keys.map(key => `    @JsonProperty("${key}")\n    private String ${this.toCamelCase(key)};\n`).join('') + ``);
        } catch (e) {
            return 'Error: ' + e.message;
        }
    },
    
    jsToRust(json, varName, indent = 2) {
        try {
            const data = JSON.parse(json);
            return `let ${varName}: serde_json::Value = serde_json::json!(${JSON.stringify(data)});`;
        } catch (e) {
            return 'Error: ' + e.message;
        }
    },
    
    jsToRustStruct(json, varName, indent = 2) {
        try {
            const data = JSON.parse(json);
            const keys = Object.keys(data);
            return `use serde::{Deserialize, Serialize};\n\n#[derive(Debug, Serialize, Deserialize)]\n` + `struct ${varName} {\n` + keys.map(key => `    #[serde(rename = "${key}")]\n    ${this.snakeToCamelCase(key)}: String,\n`).join('') + `}\n`);
    },
    
    jsToCpp(json, varName, indent = 2) {
        try {
            const data = JSON.parse(json);
            return `#include <iostream>\n#include <string>\n\nusing namespace std;\n\nstruct ${varName} {\n` + keys.map(key => `    string ${key};\n`).join('') + `};\nint main() {\n    cout << "${varName} {" << ${varName}.${key} << "}.` + '};\n').join('') + `\n');
    } catch (e) {
        return 'Error: ' + e.message;
    }
},
jsToCSharp(json, varName, indent = 2) {
    try {
        const data = JSON.parse(json);
        return `using System;\nusing System.Text.Json;\n\npublic class ${varName} {\n` + keys.map(key => `    public string ${key} { get; set; }\n`).join('') + `}\n`);
    } catch (e) {
        return 'Error: ' + e.message;
    }
},
jsToCSharpClass(json, varName, indent = 2) {
    try {
        const data = JSON.parse(json);
        return `using System;\nusing System.Text.Json;\n\npublic class ${varName} {\n` + keys.map(key => `    public string ${key} { get; set; }\n`).join('') + `}\n`);
    } catch (e) {
        return 'Error: ' + e.message;
    }
},
jsToKotlin(json, varName, indent = 2) {
    try {
        const data = JSON.parse(json);
        return `data class ${varName}(\n` + keys.map(key => `    @field:JsonProperty("${key}")\n    val ${this.toCamelCase(key)}: String,\n`).join('') + `)`;
    } catch (e) {
        return 'Error: ' + e.message;
    }
},
jsToLua(json, varName, indent = 2) {
    try {
        const data = JSON.parse(json);
        return `${varName} = ` + JSON.stringify(data, null, indent);
    } catch (e) {
        return 'Error: ' + e.message;
    }
},
jsToPHP(json, varName, indent = 2) {
    try {
        const data = JSON.parse(json);
        return `$${varName} = ${JSON.stringify(data)};`;
    } catch (e) {
        return 'Error: ' + e.message;
    }
},
jsToRuby(json, varName, indent = 2) {
    try {
        const data = JSON.parse(json);
        return `${varName} = ` + JSON.stringify(data, null, indent);
    } catch (e) {
        return 'Error: ' + e.message;
    }
},
jsToSQL(json, varName) {
    try {
        const data = JSON.parse(json);
        const keys = Object.keys(data);
        return `CREATE TABLE ${varName} (\n` + keys.map(key => `    ${key} TEXT,\n`).join('') + `);`;
    } catch (e) {
        return 'Error: ' + e.message;
    }
},
jsToXML(json, varName, indent = indent) {
    try {
        const data = JSON.parse(json);
        const keys = Object.keys(data);
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<${varName}>\n` + keys.map(key => `    <${key}>${data[key]}</${key}>\n`).join('') + `</${varName}>`;
        return xml;
    } catch (e) {
        return 'Error: ' + e.message;
    }
},
jsToJSONSchema(json, varName, indent = 2) {
    try {
        const data = JSON.parse(json);
        const keys = Object.keys(data);
        return `{\n` + keys.map(key => `    "${key}": {\n        "type": "string"\n    },\n`).join('') + `}`;
    } catch (e) {
        return 'Error: ' + e.message;
    }
},
jsToYAML(json, varName, indent = 2) {
    try {
        const data = JSON.parse(json);
        let yaml = `${varName}:\n`;
        const keys = Object.keys(data);
        keys.forEach(key => {
            yaml += `  ${key}: ${data[key]}\n`;
        });
        return yaml;
    } catch (e) {
        return 'Error: ' + e.message;
    }
},
jsToTOML(json, varName, indent = 2) {
    try {
        const data = JSON.parse(json);
        let toml = `[data]\n`;
        const keys = Object.keys(data);
        keys.forEach(key => {
            toml += `${key} = "${data[key]}"\n`;
        });
        return toml;
    } catch (e) {
        return 'Error: ' + e.message;
    }
},
jsToINI(json, varName, indent = 2) {
    try {
        const data = JSON.parse(json);
        let ini = `[${varName}]\n`;
        const keys = Object.keys(data);
        keys.forEach(key => {
            ini += `${key} = ${data[key]}\n`;
        });
        return ini;
    } catch (e) {
        return 'Error: ' + e.message;
    }
},
toCamelCase(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
},
snakeToCamelCase(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}
};

document.addEventListener('DOMContentLoaded', () => {
    JSONToCodeConverter.init();
});
