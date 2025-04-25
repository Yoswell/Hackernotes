import { useEffect, useState } from 'react'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/nnfx-dark.min.css'

interface Props {
    filePath: string;
}

export const MarkdownViewer = ({ filePath }: Props) => {
    const [content, setContent] = useState('')

    useEffect(() => {
        const renderer = new marked.Renderer()

        renderer.code = ({ text, lang }) => {
            const validLang = hljs.getLanguage(lang || 'plaintext') ? lang || 'plaintext' : 'plaintext'
            const highlighted = hljs.highlight(text, { language: validLang || 'plaintext' }).value
            return `<pre><code class="hljs language-${validLang}">${highlighted}</code></pre>`
        }

        fetch(filePath)
            .then((res) => res.text())
            .then((text) => {
                const html = marked(text, { renderer }) as string;
                setContent(html);
            })
            .catch((err) => {
                console.error("Error loading markdown file:", err)
                setContent('<p>Error loading file</p>')
            })
    }, [filePath])

    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
}
