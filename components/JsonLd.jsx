export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ivan Nevares",
    "url": "https://inevares.com",
    "image": "https://inevares.com/profile.jpeg",
    "jobTitle": "UX/UI Designer & Front-End Developer",
    "description": "Portfolio of Ivan Nevares, a creative UX/UI Designer and Front-End Developer specializing in visual identity, digital experiences, and web development.",
    "sameAs": [
      "https://github.com/i9-9", // GitHub profile
      "https://dribbble.com/i9i9", // Dribbble profile
      "https://linkedin.com/in/ivan-nevares" // LinkedIn profile
    ],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://inevares.com"
    },
    "knowsAbout": [
      "UX Design",
      "UI Design",
      "Front-End Development",
      "Web Design",
      "React",
      "Next.js",
      "Visual Identity",
      "Digital Experiences"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 