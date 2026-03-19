"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Highlight } from '@tiptap/extension-highlight'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { Typography } from '@tiptap/extension-typography'

import { CharacterCount } from '@tiptap/extension-character-count'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { FontFamily } from '@tiptap/extension-font-family'
import { Extension } from '@tiptap/core'

const FontSize = Extension.create({
    name: 'fontSize',
    addGlobalAttributes() {
        return [
            {
                types: ['textStyle', 'paragraph', 'heading'],
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize?.replace(/['"]+/g, ''),
                        renderHTML: attributes => {
                            if (!attributes.fontSize) {
                                return {}
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            }
                        },
                    },
                },
            },
        ]
    },
    addCommands() {
        return {
            setFontSize: (fontSize: string) => ({ chain }: any) => {
                return chain()
                    .setMark('textStyle', { fontSize })
                    .run()
            },
            unsetFontSize: () => ({ chain }: any) => {
                return chain()
                    .setMark('textStyle', { fontSize: null })
                    .removeEmptyTextStyle()
                    .run()
            },
        } as any
    },
})

import { uploadImageToCloudinary } from '@/lib/cloudinary'

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Undo,
    Redo,
    Quote,
    Link as LinkIcon,
    Image as ImageIcon,
    Table as TableIcon,
    Highlighter,
    Code,
    Minus,
    Type,
    Subscript as SubscriptIcon,
    Superscript as SuperscriptIcon,
    Eraser,
    Indent as IndentIcon,
    Outdent as OutdentIcon,
    Maximize2,
    Printer,
    Link2Off,
    CheckSquare,
    TableCellsMerge,
    Rows,
    Columns,
    FileCode,
    Trash,
    ChevronDown,
    Upload,
    Loader2
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
    readOnly?: boolean
}

export default function RichTextEditor({ content, onChange, placeholder = "İçeriğinizi buraya yazın...", readOnly = false }: RichTextEditorProps) {
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [showImageInput, setShowImageInput] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isSourceMode, setIsSourceMode] = useState(false)

    // Table Insertion State
    const [showTableOverlay, setShowTableOverlay] = useState(false)
    const [tableRows, setTableRows] = useState(3)
    const [tableCols, setTableCols] = useState(3)

    // Font State
    const [showFontDropdown, setShowFontDropdown] = useState(false)
    const [showSizeDropdown, setShowSizeDropdown] = useState(false)
    const [showFormatDropdown, setShowFormatDropdown] = useState(false)
    const [sourceCode, setSourceCode] = useState('')

    const formats = [
        { label: 'Normal Metin', value: 'paragraph', icon: <Type className="size-3" /> },
        { label: 'Başlık 1', value: 'heading', level: 1, icon: <Heading1 className="size-3" /> },
        { label: 'Başlık 2', value: 'heading', level: 2, icon: <Heading2 className="size-3" /> },
        { label: 'Başlık 3', value: 'heading', level: 3, icon: <Heading3 className="size-3" /> },
    ]

    const fonts = [
        { label: 'Varsayılan', value: '' },
        { label: 'Arial', value: 'Arial' },
        { label: 'Comic Sans MS', value: 'Comic Sans MS, Comic Sans' },
        { label: 'Courier New', value: 'Courier New' },
        { label: 'Georgia', value: 'Georgia' },
        { label: 'Impact', value: 'Impact' },
        { label: 'Lucida Console', value: 'Lucida Console' },
        { label: 'Tahoma', value: 'Tahoma' },
        { label: 'Times New Roman', value: 'Times New Roman' },
        { label: 'Verdana', value: 'Verdana' },
    ]

    const sizes = ['9px', '10px', '11px', '12px', '13px', '14px', '15px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '32px', '36px', '48px', '72px']

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            FontFamily,
            FontSize,
            Highlight.configure({ multicolor: true }),
            Subscript,
            Superscript,
            Typography,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Table.configure({
                resizable: true,
                allowTableNodeSelection: true,
                HTMLAttributes: {
                    class: 'editor-table',
                },
            }).extend({
                addKeyboardShortcuts() {
                    return {
                        'Backspace': () => {
                            if (this.editor.state.selection.$anchor.parent.type.name === 'tableCell' && this.editor.state.selection.empty && this.editor.state.selection.$anchor.parentOffset === 0) {
                                // Optional: delete table if at start of first cell? Maybe too aggressive.
                            }
                            return false
                        },
                        'Mod-Backspace': () => {
                            if (this.editor.isActive('table')) {
                                return this.editor.commands.deleteTable()
                            }
                            return false
                        }
                    }
                }
            }),
            TableRow,
            TableHeader,
            TableCell.extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        backgroundColor: {
                            default: null,
                            parseHTML: element => element.style.backgroundColor || null,
                            renderHTML: attributes => {
                                if (!attributes.backgroundColor) {
                                    return {}
                                }
                                return {
                                    style: `background-color: ${attributes.backgroundColor}`,
                                }
                            },
                        },
                    }
                },
            }),
            Placeholder.configure({
                placeholder: placeholder,
                emptyEditorClass: 'is-editor-empty',
            }),
            CharacterCount,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        content: content,
        editable: !readOnly,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none min-h-[400px] p-6 editor-content',
            },
            handleKeyDown: (view, event) => {
                if (event.key === 'Backspace' || event.key === 'Delete') {
                    const { selection } = view.state;
                    // Check if multiple cells are selected or the whole table is targetable
                    // Tiptap's Table extension already handles some of this, but we can force deleteTable
                    // if the user expects it from certain states. 
                    // For now, we'll rely on the dedicated delete button and improved node selection.
                }
                return false;
            }
        },
    })

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    if (!editor) {
        return null
    }

    const MenuButton = ({ onClick, active, children, title, disabled }: any) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`p-2 rounded-lg transition-colors ${active
                ? 'bg-orange-100 text-orange-600'
                : 'hover:bg-slate-100 text-slate-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={title}
        >
            {children}
        </button>
    )

    const addLink = () => {
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run()
            setLinkUrl('')
            setShowLinkInput(false)
        }
    }

    const addImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
            setImageUrl('')
            setShowImageInput(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setIsUploading(true)
            const url = await uploadImageToCloudinary(file)
            editor.chain().focus().setImage({ src: url }).run()
            setShowImageInput(false)
        } catch (error) {
            alert('Görsel yüklenirken bir hata oluştu: ' + (error as any).message)
        } finally {
            setIsUploading(false)
        }
    }

    const formatHTML = (html: string) => {
        if (!html) return ''
        let formatted = ''
        let indent = ''
        try {
            const cleanHtml = html.replace(/>\s*</g, '>\n<')
            const lines = cleanHtml.split('\n')
            lines.forEach((line) => {
                if (line.match(/<\/\w/)) indent = indent.substring(2)
                formatted += (indent || '') + line + '\n'
                // If line has an opening tag but no closing tag on the same line, increase indent
                if (line.match(/<\w[^>]*[^\/]>$/) && !line.match(/<\/\w/) && !line.startsWith('<input') && !line.startsWith('<img') && !line.startsWith('<br')) {
                    indent += '  '
                }
            })
            return formatted.trim()
        } catch (e) {
            return html
        }
    }

    const handleSourceToggle = () => {
        if (!isSourceMode) {
            // Toggling TO source mode: format the current content
            setSourceCode(formatHTML(editor.getHTML()))
        } else {
            // Toggling FROM source mode: content is already synced via handleSourceChange
        }
        setIsSourceMode(!isSourceMode)
        setShowFontDropdown(false)
        setShowSizeDropdown(false)
        setShowFormatDropdown(false)
    }

    const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        setSourceCode(newValue) // Update local textarea state
        onChange(newValue) // Update parent state
        if (editor) {
            editor.commands.setContent(newValue, { emitUpdate: false }) // Sync TipTap without re-rendering if possible
        }
    }

    const handlePrint = () => {
        const printContent = editor.getHTML()
        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Yazdır - Nova Steel</title>
                        <style>
                            body { font-family: 'Inter', sans-serif; padding: 40px; color: #334155; line-height: 1.25; }
                            table { border-collapse: collapse; width: 100%; margin: 10px 0; border: 1px solid #e2e8f0; }
                            td, th { border: 1px solid #e2e8f0; padding: 4px 8px; text-align: left; }
                            p { margin: 0; min-height: 1.2em; }
                            th { background-color: #f8fafc; font-weight: bold; }
                            ul[data-type="taskList"] { list-style: none; padding: 0; }
                            ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 4px; }
                            input[type="checkbox"] { margin-top: 5px; }
                            h1 { font-size: 24pt; margin-bottom: 15px; color: #1e293b; }
                            h2 { font-size: 18pt; margin-bottom: 12px; color: #1e293b; }
                            h3 { font-size: 14pt; margin-bottom: 10px; color: #1e293b; }
                            @media print {
                                body { padding: 0; }
                                .no-print { display: none; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="editor-content">${printContent}</div>
                        <script>window.onload = () => { window.print(); window.close(); }</script>
                    </body>
                </html>
            `)
            printWindow.document.close()
        }
    }

    return (
        <div className={`border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all flex flex-col ${isFullscreen ? 'fixed inset-0 z-[9999] rounded-none h-full' : 'max-h-[800px]'}`}>
            {/* Toolbar */}
            {!readOnly && (
                <div className="border-b border-slate-100 bg-slate-50 p-1.5">
                    <div className="flex flex-wrap gap-1">
                        {/* View Actions */}
                        <div className="flex items-center gap-1 border-r border-slate-200 pr-1 mr-1">
                            <MenuButton onClick={handleSourceToggle} active={isSourceMode} title="Kaynak Kodu">
                                <FileCode className="size-4" />
                            </MenuButton>
                            <MenuButton onClick={handlePrint} title="Yazdır">
                                <Printer className="size-4" />
                            </MenuButton>
                            <MenuButton onClick={() => setIsFullscreen(!isFullscreen)} active={isFullscreen} title="Tam Ekran">
                                <Maximize2 className="size-4" />
                            </MenuButton>
                        </div>

                        {/* Typography Selectors */}
                        <div className="flex items-center gap-1 border-r border-slate-200 pr-1 mr-1 relative">
                            {/* Format Dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => { setShowFormatDropdown(!showFormatDropdown); setShowFontDropdown(false); setShowSizeDropdown(false); }}
                                    className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg min-w-[90px] justify-between transition-colors border border-transparent hover:border-slate-200"
                                >
                                    <span className="truncate italic">
                                        {formats.find(f => f.value === 'heading' ? editor.isActive('heading', { level: f.level }) : editor.isActive('paragraph'))?.label || 'Format'}
                                    </span>
                                    <ChevronDown className="size-3 opacity-50" />
                                </button>
                                {showFormatDropdown && (
                                    <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                                        {formats.map((f, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    if (f.value === 'heading') editor.chain().focus().toggleHeading({ level: f.level as any }).run()
                                                    else editor.chain().focus().setParagraph().run()
                                                    setShowFormatDropdown(false)
                                                }}
                                                className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-orange-50 hover:text-orange-600 transition-colors ${f.value === 'heading' ? (editor.isActive('heading', { level: f.level }) ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600') : (editor.isActive('paragraph') ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600')}`}
                                            >
                                                {f.icon}
                                                {f.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Font Family */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => { setShowFontDropdown(!showFontDropdown); setShowSizeDropdown(false); setShowFormatDropdown(false); }}
                                    className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg min-w-[100px] justify-between transition-colors border border-transparent hover:border-slate-200"
                                >
                                    <span className="truncate">
                                        {fonts.find(f => editor.isActive('textStyle', { fontFamily: f.value }))?.label || 'Font'}
                                    </span>
                                    <ChevronDown className="size-3 opacity-50" />
                                </button>
                                {showFontDropdown && (
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 max-h-[300px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                                        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 border-b border-slate-50 mb-1 sticky top-0 bg-white">Yazı Tipi</div>
                                        {fonts.map((f) => (
                                            <button
                                                key={f.label}
                                                type="button"
                                                onClick={() => {
                                                    if (f.value) editor.chain().focus().setFontFamily(f.value).run()
                                                    else editor.chain().focus().unsetFontFamily().run()
                                                    setShowFontDropdown(false)
                                                }}
                                                className={`w-full text-left px-3 py-2 text-xs hover:bg-orange-50 hover:text-orange-600 transition-colors ${editor.isActive('textStyle', { fontFamily: f.value }) ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600'}`}
                                                style={{ fontFamily: f.value }}
                                            >
                                                {f.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Font Size */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => { setShowSizeDropdown(!showSizeDropdown); setShowFontDropdown(false); setShowFormatDropdown(false); }}
                                    className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg min-w-[70px] justify-between transition-colors border border-transparent hover:border-slate-200"
                                >
                                    <span>{
                                        (editor.getAttributes('textStyle').fontSize) ||
                                        (editor.getAttributes('paragraph').fontSize) ||
                                        (editor.getAttributes('heading').fontSize) ||
                                        'Boyut'
                                    }</span>
                                    <ChevronDown className="size-3 opacity-50" />
                                </button>
                                {showSizeDropdown && (
                                    <div className="absolute top-full left-0 mt-1 w-24 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                                        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 border-b border-slate-50 mb-1">Boyut</div>
                                        {sizes.map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => {
                                                    editor.chain().focus().setFontSize(s).run()
                                                    setShowSizeDropdown(false)
                                                }}
                                                className={`w-full text-left px-3 py-2 text-xs hover:bg-orange-50 hover:text-orange-600 transition-colors ${editor.getAttributes('textStyle').fontSize === s ||
                                                    editor.getAttributes('paragraph').fontSize === s ||
                                                    editor.getAttributes('heading').fontSize === s
                                                    ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600'
                                                    }`}
                                            >
                                                {s.replace('px', '')}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                editor.chain().focus().unsetFontSize().run()
                                                setShowSizeDropdown(false)
                                            }}
                                            className="w-full text-left px-3 py-2 text-[10px] text-slate-400 hover:bg-rose-50 hover:text-rose-600 border-t border-slate-50 mt-1"
                                        >
                                            Sıfırla
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* History */}
                        <div className="flex items-center gap-1 border-r border-slate-200 pr-1 mr-1">
                            <MenuButton
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editor.can().undo()}
                                title="Geri Al"
                            >
                                <Undo className="size-4" />
                            </MenuButton>
                            <MenuButton
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.can().redo()}
                                title="İleri Al"
                            >
                                <Redo className="size-4" />
                            </MenuButton>
                        </div>

                        {/* Style */}
                        <div className="flex items-center gap-1 border-r border-slate-200 pr-1 mr-1">
                            <input
                                type="color"
                                onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
                                value={editor.getAttributes('textStyle').color || '#000000'}
                                className="w-8 h-8 rounded cursor-pointer border border-slate-200 p-0"
                                title="Renk"
                            />
                            <MenuButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Vurgu"><Highlighter className="size-4" /></MenuButton>
                            <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Sola Hizala"><AlignLeft className="size-4" /></MenuButton>
                            <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Ortala"><AlignCenter className="size-4" /></MenuButton>
                            <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Sağa Hizala"><AlignRight className="size-4" /></MenuButton>
                        </div>

                        {/* Lists */}
                        <div className="flex items-center gap-1 border-r border-slate-200 pr-1 mr-1">
                            <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Madde İşaretli"><List className="size-4" /></MenuButton>
                            <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numaralı"><ListOrdered className="size-4" /></MenuButton>
                            <MenuButton onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} title="Görev Listesi"><CheckSquare className="size-4" /></MenuButton>
                            <MenuButton onClick={() => editor.chain().focus().liftListItem('listItem').run()} title="Girintiyi Azalt"><OutdentIcon className="size-4" /></MenuButton>
                            <MenuButton onClick={() => editor.chain().focus().sinkListItem('listItem').run()} title="Girintiyi Artır"><IndentIcon className="size-4" /></MenuButton>
                        </div>

                        {/* Tables */}
                        <div className="flex items-center gap-1 border-r border-slate-200 pr-1 mr-1 border-none">
                            <MenuButton onClick={() => setShowTableOverlay(!showTableOverlay)} active={showTableOverlay} title="Tablo Ekle"><TableIcon className="size-4" /></MenuButton>
                            {editor.isActive('table') && (
                                <>
                                    <MenuButton onClick={() => editor.chain().focus().addColumnBefore().run()} title="Sola Kolon Ekle"><Columns className="size-4 rotate-180" /></MenuButton>
                                    <MenuButton onClick={() => editor.chain().focus().addColumnAfter().run()} title="Sağa Kolon Ekle"><Columns className="size-4" /></MenuButton>
                                    <MenuButton onClick={() => editor.chain().focus().addRowBefore().run()} title="Üste Satır Ekle"><Rows className="size-4 rotate-180" /></MenuButton>
                                    <MenuButton onClick={() => editor.chain().focus().addRowAfter().run()} title="Alta Satır Ekle"><Rows className="size-4" /></MenuButton>
                                    <MenuButton onClick={() => editor.chain().focus().deleteTable().run()} title="Tabloyu Sil"><Trash className="size-4 text-rose-500" /></MenuButton>
                                </>
                            )}
                        </div>

                        {/* Features */}
                        <div className="flex items-center gap-1">
                            <MenuButton onClick={() => setShowLinkInput(!showLinkInput)} active={editor.isActive('link')} title="Link Ekle"><LinkIcon className="size-4" /></MenuButton>
                            <MenuButton onClick={() => setShowImageInput(!showImageInput)} title="Resim Ekle"><ImageIcon className="size-4" /></MenuButton>
                            <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Alıntı"><Quote className="size-4" /></MenuButton>
                            <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Yatay Çizgi"><Minus className="size-4" /></MenuButton>
                            <MenuButton onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive('subscript')} title="Alt Simge"><SubscriptIcon className="size-4" /></MenuButton>
                            <MenuButton onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive('superscript')} title="Üst Simge"><SuperscriptIcon className="size-4" /></MenuButton>
                        </div>
                    </div>

                    {/* Overlays */}
                    {showTableOverlay && (
                        <div className="mt-2 flex gap-4 items-center p-3 bg-white rounded-xl border border-slate-200 shadow-xl animate-in slide-in-from-top-1 z-10 w-fit">
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-slate-500">Satır</label>
                                <input
                                    type="number"
                                    value={tableRows}
                                    onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-16 px-2 py-1 text-sm border border-slate-200 rounded outline-none focus:ring-1 focus:ring-orange-500"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-slate-500">Sütun</label>
                                <input
                                    type="number"
                                    value={tableCols}
                                    onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-16 px-2 py-1 text-sm border border-slate-200 rounded outline-none focus:ring-1 focus:ring-orange-500"
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        editor.chain().focus().insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true }).run()
                                        setShowTableOverlay(false)
                                    }}
                                    className="px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded hover:bg-orange-600 shadow-sm"
                                >
                                    Oluştur
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowTableOverlay(false)}
                                    className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded hover:bg-slate-200"
                                >
                                    İptal
                                </button>
                            </div>
                        </div>
                    )}
                    {showLinkInput && (
                        <div className="mt-2 flex gap-2 items-center p-2 bg-white rounded-xl border border-slate-200 shadow-xl animate-in slide-in-from-top-1">
                            <input
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://..."
                                className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-orange-500"
                                autoFocus
                            />
                            <button type="button" onClick={addLink} className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 shadow-sm">Ekle</button>
                            <button type="button" onClick={() => { editor.chain().focus().unsetLink().run(); setShowLinkInput(false); }} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-200">Kaldır</button>
                        </div>
                    )}
                    {showImageInput && (
                        <div className="mt-2 flex flex-col gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-xl animate-in slide-in-from-top-1 min-w-[300px]">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-medium text-slate-500">Görsel Ekle</span>
                                <button onClick={() => setShowImageInput(false)} className="text-slate-400 hover:text-slate-600"><Trash className="size-3" /></button>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <label className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-100 rounded-lg hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition-all">
                                        {isUploading ? <Loader2 className="size-5 text-orange-500 animate-spin" /> : <Upload className="size-5 text-slate-400" />}
                                        <span className="text-[10px] font-medium text-slate-600">{isUploading ? 'Yükleniyor...' : 'Fotoğraf Yükle'}</span>
                                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="url"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            placeholder="URL yapıştırın..."
                                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-orange-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={addImage}
                                            disabled={!imageUrl || isUploading}
                                            className="w-full py-2 bg-orange-500 text-white text-[10px] font-bold rounded-lg hover:bg-orange-600 shadow-sm disabled:opacity-50 transition-all"
                                        >
                                            URL'den Ekle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Editor Area */}
            <div className={`flex-1 overflow-y-auto ${isFullscreen ? 'bg-slate-50' : ''}`}>
                <div className={`${isFullscreen ? 'max-w-[1000px] mx-auto bg-white shadow-xl min-h-screen my-10 p-12 rounded-lg' : ''}`}>
                    {isSourceMode ? (
                        <textarea
                            value={sourceCode}
                            onChange={handleSourceChange}
                            className="w-full h-[600px] editor-source focus:outline-none"
                        />
                    ) : (
                        <EditorContent editor={editor} />
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50 p-2 px-4 flex justify-end gap-4 text-[10px] font-medium text-slate-400">
                <span>{editor.storage.characterCount.words()} kelime</span>
                <span>{editor.storage.characterCount.characters()} karakter</span>
            </div>
        </div>
    )
}
