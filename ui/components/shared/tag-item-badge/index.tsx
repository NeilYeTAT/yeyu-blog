export default function TagItemBadge({ tag }: { tag: string }) {
  return <span className="border-b border-b-foreground border-dashed">{`#${tag}`}</span>
}
