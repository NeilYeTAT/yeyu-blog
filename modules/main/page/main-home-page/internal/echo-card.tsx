import { getRandomEcho } from '@/actions/echos'

export default async function EchoCard() {
  const randomEcho = await getRandomEcho()

  return (
    <section
      className="flex flex-col w-2/3 md:w-1/2 p-2 rounded-sm
                  hover:scale-105 duration-300
                bg-slate-300 dark:bg-gray-950 
    "
    >
      <p className="underline">{randomEcho?.content}</p>
      <footer className="ml-auto text-sm font-thin text-pink-500">
        「{randomEcho?.reference}」
      </footer>
    </section>
  )
}
