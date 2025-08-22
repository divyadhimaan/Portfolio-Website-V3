import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeItem {
    code: string;
    language: string;
    label?: string;
}

interface CodeBlockProps {
codes: CodeItem[];
copyButton?: boolean;
}

interface SyntaxConfig {
    keywords: string[];
    types: string[];
    functions: string[];
    operators: string[];
    punctuation: string[];
  }

  const syntaxHighlighting: Record<string, SyntaxConfig>  = {
    python: {
      keywords: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'in', 'return', 'import', 'from', 'as', 'and', 'or', 'not', 'True', 'False', 'None', 'self', 'break', 'continue', 'pass', 'try', 'except', 'finally', 'with', 'lambda', 'yield'],
      types: ['int', 'str', 'float', 'bool', 'list', 'dict', 'tuple', 'set', 'List', 'Dict', 'Tuple', 'Set', 'Optional', 'Union'],
      functions: ['len', 'range', 'print', 'input', 'open', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'min', 'max', 'sum', 'abs'],
      operators: ['=', '==', '!=', '<', '>', '<=', '>=', '+', '-', '*', '/', '//', '%', '**', '&', '|', '^', '~', '<<', '>>', 'and', 'or', 'not', 'in', 'is'],
      punctuation: ['(', ')', '[', ']', '{', '}', ',', ':', ';', '.', '->', '=>']
    },
    javascript: {
      keywords: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'class', 'extends', 'import', 'export', 'from', 'as', 'async', 'await', 'yield', 'typeof', 'instanceof'],
      types: ['string', 'number', 'boolean', 'object', 'undefined', 'null', 'Array', 'Object', 'Function', 'Date', 'RegExp', 'Map', 'Set', 'Promise'],
      functions: ['console', 'log', 'error', 'warn', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'parseInt', 'parseFloat', 'isNaN', 'JSON', 'parse', 'stringify'],
      operators: ['=', '==', '===', '!=', '!==', '<', '>', '<=', '>=', '+', '-', '*', '/', '%', '++', '--', '&&', '||', '!', '&', '|', '^', '~', '<<', '>>', '>>>', '?', ':', '=>'],
      punctuation: ['(', ')', '[', ']', '{', '}', ',', ';', '.', '?', ':']
    },
    java: {
      keywords: ['public', 'private', 'protected', 'static', 'final', 'abstract', 'class', 'interface', 'extends', 'implements', 'import', 'package', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'throws', 'new', 'this', 'super', 'null', 'true', 'false', 'instanceof'],
      types: ['int', 'long', 'short', 'byte', 'float', 'double', 'boolean', 'char', 'String', 'Object', 'Integer', 'Long', 'Short', 'Byte', 'Float', 'Double', 'Boolean', 'Character', 'List', 'ArrayList', 'Map', 'HashMap', 'Set', 'HashSet', 'void'],
      functions: ['System', 'out', 'println', 'print', 'length', 'size', 'add', 'remove', 'get', 'set', 'contains', 'isEmpty', 'toString', 'equals', 'hashCode'],
      operators: ['=', '==', '!=', '<', '>', '<=', '>=', '+', '-', '*', '/', '%', '++', '--', '&&', '||', '!', '&', '|', '^', '~', '<<', '>>', '>>>', '?', ':'],
      punctuation: ['(', ')', '[', ']', '{', '}', ',', ';', '.', '@']
    },
    cpp: {
      keywords: ['#include', '#define', '#ifdef', '#ifndef', '#endif', 'using', 'namespace', 'std', 'class', 'struct', 'enum', 'public', 'private', 'protected', 'virtual', 'static', 'const', 'inline', 'template', 'typename', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return', 'try', 'catch', 'throw', 'new', 'delete', 'this', 'nullptr', 'true', 'false'],
      types: ['int', 'long', 'short', 'char', 'float', 'double', 'bool', 'void', 'size_t', 'string', 'vector', 'map', 'set', 'pair', 'auto', 'decltype'],
      functions: ['cout', 'cin', 'endl', 'printf', 'scanf', 'strlen', 'strcpy', 'strcmp', 'malloc', 'free', 'sizeof'],
      operators: ['=', '==', '!=', '<', '>', '<=', '>=', '+', '-', '*', '/', '%', '++', '--', '&&', '||', '!', '&', '|', '^', '~', '<<', '>>', '->', '::'],
      punctuation: ['(', ')', '[', ']', '{', '}', ',', ';', '.', '::', '->', '?', ':']
    }
  };

const highlightCode = (code: string, language: string) : React.ReactNode => {
    if (!syntaxHighlighting[language]) return code;
    
    const { keywords, types, functions, operators, punctuation } = syntaxHighlighting[language];
    
    // Split code into tokens while preserving whitespace
    const tokenRegex = /(\s+|\/\/.*|\/\*[\s\S]*?\*\/|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|@Override|::|->|=>|\+\+|--|\*\*|\/\/|<<|>>|<=|>=|==|!=|===|!==|&&|\|\||[()[\]{},;:.=<>!&|^~+\-*/%?:@#]|\w+|\d+(?:\.\d+)?)/g;
    
    const tokens = code.match(tokenRegex) || [];

    return tokens.map((token, index) => {
      const trimmed = token.trim();

      // Skip whitespace
      if (/^\s+$/.test(token)) {
        return <span key={index}>{token}</span>;
      }
      
      
      // Comments (single line and multi-line)
      if (token.startsWith('//') || (token.startsWith('/*') && token.endsWith('*/'))) {
        return <span key={index} className="text-gray-500 italic">{token}</span>;
      }

      // Annotations (Java)
      if (token.startsWith('@')) {
        return <span key={index} className="text-yellow-300">{token}</span>;
      }
      
      // Strings
      if ((token.startsWith('"') && token.endsWith('"')) || 
          (token.startsWith("'") && token.endsWith("'"))) {
        return <span key={index} className="text-green-400">{token}</span>;
      }
      
      // Numbers (including decimals)
      if (/^\d+(\.\d+)?$/.test(token)) {
        return <span key={index} className="text-purple-400">{token}</span>;
      }
      // Multi-character operators first (to avoid splitting them)
      if (['&&', '||', '==', '!=', '<=', '>=', '++', '--', '>>', '<<', '::', '->', '=>', '===', '!==', '**', '//'].includes(token)) {
        return <span key={index} className="text-orange-400 font-medium">{token}</span>;
      }
      // Keywords
      if (keywords.includes(token)) {
        return <span key={index} className="text-blue-400 font-semibold">{token}</span>;
      }
      
      // Types
      if (types.includes(token)) {
        return <span key={index} className="text-yellow-400 font-medium">{token}</span>;
      }
      
      // Functions and methods
      if (functions.some(func => token.includes(func))) {
        return <span key={index} className="text-cyan-400">{token}</span>;
      }
      // Method calls (words followed by parentheses in next tokens)
      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
        const nextToken = tokens[index + 1];
        if (nextToken && nextToken.trim() === '(') {
          return <span key={index} className="text-cyan-400">{token}</span>;
        }
      }
      
      // Single character operators
      if (operators.includes(token)) {
        return <span key={index} className="text-orange-400">{token}</span>;
      }
      
      // Punctuation
      if (punctuation.includes(token)) {
        return <span key={index} className="text-gray-300">{token}</span>;
      }
      
      // Class names (PascalCase)
      if (/^[A-Z][a-zA-Z0-9]*$/.test(token)) {
        return <span key={index} className="text-emerald-400">{token}</span>;
      }
      
      // Default text
      return <span key={index} className="text-gray-100">{token}</span>;
    });
  };
const CodeBlock: React.FC<CodeBlockProps> = ({ codes, copyButton = true }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [copied, setCopied] = useState(false);
  
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(codes[activeTab].code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };
  
    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        {/* Language tabs */}
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {codes.map((codeItem, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    activeTab === index
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {codeItem.label || codeItem.language}
                </button>
              ))}
            </div>
            
            {copyButton && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded transition-colors"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
        </div>
  
        {/* Code content */}
        <div className="relative">
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
            <code className="text-gray-100 font-mono">
              {highlightCode(codes[activeTab].code, codes[activeTab].language)}
            </code>
          </pre>
        </div>
      </div>
    );
  };

export default CodeBlock;