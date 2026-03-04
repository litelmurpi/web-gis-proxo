export default function About() {
  return (
    <div className="min-h-screen bg-base-950 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-heading font-semibold text-white tracking-tight mb-4">
        About{" "}
        <span className="font-emphasis italic font-normal text-primary-400">
          UrbanInsight AI
        </span>
      </h1>
      <p className="text-base-400 font-body">
        Project information and methodology will go here.
      </p>
    </div>
  );
}
