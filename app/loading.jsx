export default function Loading() {
    return <div className="flex items-center h-screen justify-center text-verde  text-6xl animate-pulse">
      Loading
      <div className="flex text-lima">
        <div className="dot animate-dot bg-mid-gray "></div>
        <div className="dot animate-dot animation-delay-300 bg-verde"></div>
        <div className="dot animate-dot animation-delay-600 bg-verde"></div>
      </div>
      </div>
  }