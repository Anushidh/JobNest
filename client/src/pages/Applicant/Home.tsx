import { Link } from "react-router";

const Home = () => {
  return (
    <section className="bg-[rgb(88,81,211)] text-white py-28 px-4 flex justify-center">
      <div className="text-center max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold mb-8">
          Where techies realise their true potential
        </h1>
        <p className="text-sm sm:text-base md:text-[24px] mb-12">
          Look beyond the obvious. Use Cutshort to easily get discovered by
          awesome companies and get referred to job positions very few know
          about.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/find-jobs"
            className="px-6 py-3 rounded-full font-semibold text-base text-[rgb(88,81,211)] bg-white hover:bg-opacity-90 transition duration-200"
          >
            Find Jobs
          </Link>
          <Link
            to="/hire-talent"
            className="px-6 py-3 rounded-full text-base font-semibold text-white border border-white bg-transparent hover:bg-white 
            hover:text-[rgb(88,81,211)] transition duration-200"
          >
            Hire Talent
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
