export function InlineText({ value }: { value: string }) {
  const parts = value.split('`');
  return <>{parts.map((part, index) => index % 2 === 1 ? <code key={`${index}-${part}`}>{part}</code> : <span key={`${index}-${part}`}>{part}</span>)}</>;
}
