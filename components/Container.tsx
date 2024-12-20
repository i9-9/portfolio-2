// app/new/components/Container.tsx
import ProfileCard from './ProfileCard';
import ProjectDisplay from './ProjectDisplay';

const Container = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 bg-dark-gray text-light-gray min-h-screen">
      <ProfileCard />
      <ProjectDisplay />
    </div>
  );
};

export default Container;
