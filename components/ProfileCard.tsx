"use client";

const ProfileCard = () => {
  return (
    <section className="flex flex-col justify-between bg-sidebar-gray p-6 rounded-lg w-full max-w-sm text-[19px]">
      <h1 className="text-2xl font-bold text-white mb-2 text-[33px]">IVAN NEVARES</h1>
      <p>Designer with experience in websites and applications, dedicated to crafting unique, modern, and tailored experiences.</p>
      <p>Currently studying Graphic Design at the Universidad de Buenos Aires.<br/>
      Sound Technician, trained at TECSON, Buenos Aires.</p>
      <p >Web Designer at <span className="font-semibold">newtro.xyz</span>.</p>
      <p>Available for freelance web projects.</p>
      <p className="mt-2">If you have any questions, feel free to send me an email.</p>
      <div className="mt-6">
        <button className="px-2 py-1 bg-button-gray text-light-gray rounded mr-2">EN</button>
        <button className="px-2 py-1 bg-button-gray text-light-gray rounded">ES</button>
      </div>
    </section>
  );
};

export default ProfileCard;
