import Navbar from "../../../components/Navbar";
import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import getPostMetadata from "../../../components/getPostMetadata";
import Link from "next/link";

const getPostContent = (slug: string) => {
  const folder = "posts/";
  const file = `${folder}${slug}.md`;
  const content = fs.readFileSync(file, "utf8");
  const matterResult = matter(content)
  return matterResult;
};

export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  return posts.map((post) =>  ({
    slug: post.slug,
  }))
  
}


const PostPage = (props: any) => {

  const slug = props.params.slug;
  const post = getPostContent(slug);

  return (
      <section className="h-auto pb-10 bg-repeat px-4">
        <Navbar />
        <Link href='/digital-garden'>
          <h1 className="text-6xl md:text-9xl md:leading-[7rem] text-verde font-bold my-6 mx-1 ">
            DIGITAL<br />GARDEN
          </h1>
        </Link>
        <hr className="border-verde border mx-1" />
        <h2 className="text-verde px-1 font-bold text-6xl py-6 text-center">{post.data.title}</h2>
        
        <h3 className="text-verde mx-1 font-light text-center">{post.data.date}</h3>
        
        <Markdown className="text-center prose prose-headings:text-verde prose-a:text-verde hover:prose-a:text-verde/60 px-1 text-lg text-verde mt-10 mx-auto">{post.content}</Markdown>
      </section>
      
  );

}

export default PostPage;