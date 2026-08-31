import { siFigma, siHono, siNestjs, siNextdotjs, siReact, siTypescript } from 'simple-icons/icons'

const techStackData = [siTypescript, siReact, siNextdotjs, siHono, siNestjs, siFigma]

function TechStack() {
  return (
    <ul aria-label="技术栈" className="mt-[21px] grid grid-cols-6 gap-[10px]">
      {techStackData.map(icon => (
        <li key={icon.slug} title={icon.title} className="size-6">
          <svg
            role="img"
            aria-label={icon.title}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-full"
          >
            <path d={icon.path} />
          </svg>
        </li>
      ))}
    </ul>
  )
}

export default TechStack
