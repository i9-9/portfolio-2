
import Navbar from "../../components/Navbar";
import Link from "next/link";
import getPostMetadata from "../../components/getPostMetadata";


export default async function Page() {
  const postMetadata = getPostMetadata();
  const postPreviews = postMetadata.map((post) => (
    <div key={post.slug} className="text-verde border border-verde flex flex-col px-2 hover:bg-violeta transition-all duration-700 py-3 shadow-xl">
      <Link href={`/digital-garden/${post.slug}`}>
        <div className="flex flex-row items-center justify-between py-1">
          <h2 className="font-bold text-2xl hover-underline-animation">{post.title}</h2>
        </div>
          <p className="text-sm">{post.subtitle}</p>
          <p className="text-xs">{post.date}</p>
      </Link>
    </div>
  ))
  


  return (
    <section className="h-auto pb-10 bg-repeat min-h-screen px-4">
      <Navbar />
      <h1 className="text-6xl text-verde font-bold mt-6 mx-1 leading-8	">
        DIGITAL GARDEN
      </h1>
      <h3 className="mt-1 text-xl md:text-4xl text-verde font-medium mx-1 uppercase leading-8">
        Filter by growth stage:
      </h3>
      <div className="relative bg-transparent grid grid-cols-4 mx-1">
        <select
          id="Growth"
          className="bg-transparent border border-verde text-verde text-lg focus:ring-verde block w-full p-2.5 "
        >
          <option>ALL GROWTH STAGES</option>
          <option value="SE">SEEDLING</option>
          <option value="BU">BUDDING</option>
          <option value="EV">EVERGREEN</option>
        </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 mx-1 gap-10 my-6">
      {postPreviews}
        </div>
    </section>
    )
  


}


