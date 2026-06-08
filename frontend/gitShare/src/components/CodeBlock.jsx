import './CodeBlock.css'

function CodeBlock({ code }) {
  return (
    <div className="code-block">
      <pre className="code-block__pre">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default CodeBlock
