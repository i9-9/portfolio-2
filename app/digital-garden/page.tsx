import Navbar from "../../components/Navbar";
import Link from "next/link";
import getPostMetadata from "../../components/getPostMetadata";

export default async function Page() {
  const postMetadata = getPostMetadata();

  const postPreviews = postMetadata.map((post) => (
    <div key={post.slug} className="text-verde border border-verde flex flex-col px-2 hover:bg-gris_claro transition-all duration-700 py-3 shadow-xl">
      <Link href={`/digital-garden/${post.slug}`}>
        <div className="flex flex-row items-center justify-between py-1">
          <h2 className="font-bold text-md hover-underline-animation">{post.title}</h2>
        </div>
          <p className="text-sm">{post.subtitle}</p>
          <p className="text-xs">{post.date}</p>
      </Link>
    </div>
  ))
  


  return (
    <section className="h-auto pb-10 bg-repeat min-h-screen px-4">
      <Navbar />
      <h1 className="text-xl text-verde my-2">
        DIGITAL GARDEN
      </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">
      {postPreviews}
        </div>
    </section>
    )
  


}


