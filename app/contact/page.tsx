
import React from "react";
import Link from 'next/link'
import NavbarHome from "../../components/NavbarHome";

const page = () => {
  return (
    <div className="h-auto bg-repeat pb-28 min-h-screen px-4 py-20 md:py-0">
      <NavbarHome />
      <h3 className="text-md text-verde py-4">
        We can either talk and discuss your project, or you can follow me up for
        future reference:
      </h3>
      <div className="grid md:grid-cols-3 text-center gap-6 mx-1 ">
        <Link href='mailto:ivannevares9@gmail.com'>
          <div className=" text-verde h-fit py-1 hover:bg-gris_oscuro hover:text-gris_claro transition-all duration-700 border border-gris_oscuro">
            <h4 className="text-3xl md:text-xl font-bold">EMAIL</h4>
          </div>
        </Link>
        <Link href='https://www.behance.net/ivan_nevares'>
          <div className=" text-verde h-fit py-1 hover:bg-gris_oscuro hover:text-gris_claro transition-all duration-700 border border-gris_oscuro">
            <h4 className="text-3xl md:text-xl font-bold">BEHANCE</h4>
          </div>
        </Link>
        <Link href='https://github.com/i9-9'>
          <div className=" text-verde h-fit py-1 hover:bg-gris_oscuro hover:text-gris_claro transition-all duration-700 border border-gris_oscuro">
            <h4 className="text-3xl md:text-xl font-bold">GITHUB</h4>
          </div>
        </Link>
      </div>
      <div>
        {/* <button className="border border-verde p-2 mx-1 text-verde text-3xl hover:bg-verde hover:text-violeta drop-shadow transition transition-all">
          <a
            href="/cv_inevares_front.pdf"
            target="_blank"
            download
            rel="noopener noreferrer"
          >Download CV</a>
        </button> */}
      </div>
    </div>
  );
};

export default page;
