type ProjectProps = {
  project: {
    title: string;
    description: string;
    image: string;
    anchor: string;
    videoId: string;
  };
};

const ProjectCard: React.FC<ProjectProps> = ({ project }) => {
  return (
    <div className="bg-[#070707] rounded-lg p-4 w-full md:w-1/3">
      <h3 className="text-white font-bold">{project.title}</h3>
      <p className="text-gray-400">{project.description}</p>
      <a href={project.anchor} target="_blank" rel="noopener noreferrer" className="text-lima mt-2 inline-block">
        View Project
      </a>
    </div>
  );
};

export default ProjectCard;
