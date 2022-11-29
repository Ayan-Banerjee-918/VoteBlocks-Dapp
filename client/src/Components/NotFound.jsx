import bg404 from '../assets/404bg.jpg'

export const NotFound = () => {
  return (
    <>
    <div className="bg-purple-300 hscreen bg-no-repeat bg-cover bg-center bg-blend-darken blur-lg" style={{backgroundImage: `url(${bg404})`}}>
    </div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col h-full w-full items-center justify-center bg-white rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20">
      <h1 className='text-4xl font-bold text-white'>ARE YOU LOST ?</h1>
      <h1 className='grid justify-center text-5xl font-bold text-amber-500'>404</h1>
    </div>
  </>
  )
}