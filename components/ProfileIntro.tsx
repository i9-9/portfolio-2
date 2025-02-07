import React from "react";

const ProfileIntro = () => (
  <div className="flex flex-col w-full text-sm pb-4 pt-8 md:pt-0">
    <p className="text-lima">ivannevares9@gmail.com</p>
    <div className="text-sm text-lima mb-2">
      <a href="https://dribbble.com/i9i9" target="_blank" className="hover:text-bluer">
        Dribbble
      </a>
      <span className="mr-1">,</span>
      <a href="https://github.com/i9-9" target="_blank" className="hover:text-bluer">
        Github
      </a>
    </div>
    <p className="text-sm mb-4 font-helveticaNowTextRegular text-mid-gray">
      Designer with experience in websites and applications, dedicated to crafting unique, modern, and tailored experiences.
    </p>
    <p className="text-sm mb-2 font-helveticaNowTextRegular text-mid-gray">
      Currently studying Graphic Design at the Universidad de Buenos Aires.
    </p>
    <h1 className="text-sm mb-2 font-helveticaNowTextRegular text-mid-gray">
      Sound Technician, trained at TECSON, Buenos Aires.
    </h1>
    <p className="text-sm mb-2 font-helveticaNowTextRegular text-mid-gray">
      Web Designer at newtro.xyz.
    </p>
    <p className="text-sm mb-2 font-helveticaNowTextRegular text-mid-gray">
      Available for freelance web projects.
      <br /> If you have any questions, feel free to send me an email.
    </p>
  </div>
);

export default ProfileIntro;