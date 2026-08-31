import Image from 'next/image'
import avatar from '@/config/img/avatar.webp'

export default function YeAvatar() {
  return (
    <figure className="size-[180px] shrink-0 overflow-hidden rounded-[64px] border border-[#eaeaea]">
      <Image
        src={avatar}
        alt="叶鱼的头像"
        className="size-full object-cover"
        sizes="180px"
        placeholder="blur"
        preload
        fetchPriority="high"
        draggable={false}
      />
    </figure>
  )
}
