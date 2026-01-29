import { useState, useCallback, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Code2, Eye, FileCode, FileType, Braces } from 'lucide-react';

interface CodeEditorProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  onHtmlChange: (code: string) => void;
  onCssChange: (code: string) => void;
  onJsChange: (code: string) => void;
  readOnly?: boolean;
}

// HTML suggestions
const htmlSuggestions = [
  { label: 'div', insertText: '<div></div>', documentation: 'Division element' },
  { label: 'p', insertText: '<p></p>', documentation: 'Paragraph element' },
  { label: 'h1', insertText: '<h1></h1>', documentation: 'Heading 1' },
  { label: 'h2', insertText: '<h2></h2>', documentation: 'Heading 2' },
  { label: 'h3', insertText: '<h3></h3>', documentation: 'Heading 3' },
  { label: 'span', insertText: '<span></span>', documentation: 'Inline element' },
  { label: 'a', insertText: '<a href=""></a>', documentation: 'Anchor/Link' },
  { label: 'img', insertText: '<img src="" alt="" />', documentation: 'Image' },
  { label: 'button', insertText: '<button></button>', documentation: 'Button' },
  { label: 'input', insertText: '<input type="text" />', documentation: 'Input field' },
  { label: 'form', insertText: '<form action="">\n\t\n</form>', documentation: 'Form element' },
  { label: 'ul', insertText: '<ul>\n\t<li></li>\n</ul>', documentation: 'Unordered list' },
  { label: 'ol', insertText: '<ol>\n\t<li></li>\n</ol>', documentation: 'Ordered list' },
  { label: 'table', insertText: '<table>\n\t<tr>\n\t\t<th></th>\n\t</tr>\n\t<tr>\n\t\t<td></td>\n\t</tr>\n</table>', documentation: 'Table' },
  { label: 'section', insertText: '<section>\n\t\n</section>', documentation: 'Section element' },
  { label: 'header', insertText: '<header>\n\t\n</header>', documentation: 'Header element' },
  { label: 'footer', insertText: '<footer>\n\t\n</footer>', documentation: 'Footer element' },
  { label: 'nav', insertText: '<nav>\n\t\n</nav>', documentation: 'Navigation element' },
  { label: 'article', insertText: '<article>\n\t\n</article>', documentation: 'Article element' },
  { label: 'aside', insertText: '<aside>\n\t\n</aside>', documentation: 'Aside element' },
];

// CSS suggestions
const cssSuggestions = [
  { label: 'display', insertText: 'display: ;', documentation: 'Sets element display type' },
  { label: 'flex', insertText: 'display: flex;', documentation: 'Flexbox display' },
  { label: 'grid', insertText: 'display: grid;', documentation: 'Grid display' },
  { label: 'margin', insertText: 'margin: ;', documentation: 'Outer spacing' },
  { label: 'padding', insertText: 'padding: ;', documentation: 'Inner spacing' },
  { label: 'background', insertText: 'background: ;', documentation: 'Background property' },
  { label: 'color', insertText: 'color: ;', documentation: 'Text color' },
  { label: 'font-size', insertText: 'font-size: ;', documentation: 'Font size' },
  { label: 'font-weight', insertText: 'font-weight: ;', documentation: 'Font weight' },
  { label: 'border', insertText: 'border: 1px solid ;', documentation: 'Border property' },
  { label: 'border-radius', insertText: 'border-radius: ;', documentation: 'Border radius' },
  { label: 'width', insertText: 'width: ;', documentation: 'Element width' },
  { label: 'height', insertText: 'height: ;', documentation: 'Element height' },
  { label: 'position', insertText: 'position: ;', documentation: 'Position type' },
  { label: 'z-index', insertText: 'z-index: ;', documentation: 'Stack order' },
  { label: 'transition', insertText: 'transition: all 0.3s ease;', documentation: 'CSS transition' },
  { label: 'transform', insertText: 'transform: ;', documentation: 'CSS transform' },
  { label: 'box-shadow', insertText: 'box-shadow: 0 2px 4px rgba(0,0,0,0.1);', documentation: 'Box shadow' },
  { label: 'text-align', insertText: 'text-align: ;', documentation: 'Text alignment' },
  { label: 'justify-content', insertText: 'justify-content: ;', documentation: 'Flex justify' },
  { label: 'align-items', insertText: 'align-items: ;', documentation: 'Flex align items' },
];

// JS suggestions
const jsSuggestions = [
  { label: 'console.log', insertText: 'console.log();', documentation: 'Log to console' },
  { label: 'function', insertText: 'function name() {\n\t\n}', documentation: 'Function declaration' },
  { label: 'arrow', insertText: 'const name = () => {\n\t\n};', documentation: 'Arrow function' },
  { label: 'if', insertText: 'if () {\n\t\n}', documentation: 'If statement' },
  { label: 'for', insertText: 'for (let i = 0; i < ; i++) {\n\t\n}', documentation: 'For loop' },
  { label: 'forEach', insertText: '.forEach((item) => {\n\t\n});', documentation: 'Array forEach' },
  { label: 'map', insertText: '.map((item) => {\n\treturn item;\n});', documentation: 'Array map' },
  { label: 'filter', insertText: '.filter((item) => {\n\treturn true;\n});', documentation: 'Array filter' },
  { label: 'getElementById', insertText: 'document.getElementById("");', documentation: 'Get element by ID' },
  { label: 'querySelector', insertText: 'document.querySelector("");', documentation: 'Query selector' },
  { label: 'querySelectorAll', insertText: 'document.querySelectorAll("");', documentation: 'Query all selectors' },
  { label: 'addEventListener', insertText: '.addEventListener("click", () => {\n\t\n});', documentation: 'Event listener' },
  { label: 'setTimeout', insertText: 'setTimeout(() => {\n\t\n}, 1000);', documentation: 'Set timeout' },
  { label: 'setInterval', insertText: 'setInterval(() => {\n\t\n}, 1000);', documentation: 'Set interval' },
  { label: 'fetch', insertText: 'fetch("")\n\t.then(res => res.json())\n\t.then(data => {\n\t\t\n\t});', documentation: 'Fetch API' },
  { label: 'async', insertText: 'async function name() {\n\tawait \n}', documentation: 'Async function' },
  { label: 'try-catch', insertText: 'try {\n\t\n} catch (error) {\n\tconsole.error(error);\n}', documentation: 'Try-catch block' },
  { label: 'class', insertText: 'class Name {\n\tconstructor() {\n\t\t\n\t}\n}', documentation: 'Class declaration' },
  { label: 'let', insertText: 'let  = ;', documentation: 'Let variable' },
  { label: 'const', insertText: 'const  = ;', documentation: 'Const variable' },
];

export const CodeEditor = ({
  htmlCode,
  cssCode,
  jsCode,
  onHtmlChange,
  onCssChange,
  onJsChange,
  readOnly = false,
}: CodeEditorProps) => {
  const [activeTab, setActiveTab] = useState('html');

  const generatePreview = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}<\/script>
        </body>
      </html>
    `;
  }, [htmlCode, cssCode, jsCode]);

  const handleEditorMount = useCallback((editor: any, monaco: any, language: string) => {
    // Register completion provider based on language
    const suggestions = language === 'html' ? htmlSuggestions 
      : language === 'css' ? cssSuggestions 
      : jsSuggestions;

    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: () => ({
        suggestions: suggestions.map((s) => ({
          label: s.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: s.insertText,
          documentation: s.documentation,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        })),
      }),
    });
  }, []);

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on' as const,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on' as const,
    readOnly,
    quickSuggestions: true,
    suggestOnTriggerCharacters: true,
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={50} minSize={30}>
        <Card className="h-full rounded-none border-0">
          <CardHeader className="py-2 px-4 border-b">
            <CardTitle className="text-sm flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Code Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-48px)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="w-full justify-start rounded-none border-b h-10 bg-muted/50">
                <TabsTrigger value="html" className="gap-2 data-[state=active]:bg-background">
                  <FileCode className="h-3.5 w-3.5" />
                  HTML
                </TabsTrigger>
                <TabsTrigger value="css" className="gap-2 data-[state=active]:bg-background">
                  <FileType className="h-3.5 w-3.5" />
                  CSS
                </TabsTrigger>
                <TabsTrigger value="js" className="gap-2 data-[state=active]:bg-background">
                  <Braces className="h-3.5 w-3.5" />
                  JavaScript
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="html" className="h-[calc(100%-40px)] m-0">
                <Editor
                  height="100%"
                  language="html"
                  value={htmlCode}
                  onChange={(value) => onHtmlChange(value || '')}
                  options={editorOptions}
                  onMount={(editor, monaco) => handleEditorMount(editor, monaco, 'html')}
                  theme="vs-dark"
                />
              </TabsContent>
              
              <TabsContent value="css" className="h-[calc(100%-40px)] m-0">
                <Editor
                  height="100%"
                  language="css"
                  value={cssCode}
                  onChange={(value) => onCssChange(value || '')}
                  options={editorOptions}
                  onMount={(editor, monaco) => handleEditorMount(editor, monaco, 'css')}
                  theme="vs-dark"
                />
              </TabsContent>
              
              <TabsContent value="js" className="h-[calc(100%-40px)] m-0">
                <Editor
                  height="100%"
                  language="javascript"
                  value={jsCode}
                  onChange={(value) => onJsChange(value || '')}
                  options={editorOptions}
                  onMount={(editor, monaco) => handleEditorMount(editor, monaco, 'javascript')}
                  theme="vs-dark"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={50} minSize={30}>
        <Card className="h-full rounded-none border-0">
          <CardHeader className="py-2 px-4 border-b">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-48px)]">
            <iframe
              srcDoc={generatePreview}
              title="Preview"
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts"
            />
          </CardContent>
        </Card>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
