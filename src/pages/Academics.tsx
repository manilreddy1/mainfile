import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const academicSubjects = [
  {
    name: "Mathematics",
    description: "Algebra, Calculus, Statistics, Geometry, and more",
    icon: "📐"
  },
  {
    name: "Physics",
    description: "Classical Mechanics, Electromagnetism, Quantum Physics",
    icon: "⚛️"
  },
  {
    name: "Chemistry",
    description: "Organic Chemistry, Inorganic Chemistry, Biochemistry",
    icon: "🧪"
  },
  {
    name: "Biology",
    description: "Molecular Biology, Genetics, Ecology, Physiology",
    icon: "🔬"
  },
  {
    name: "History",
    description: "World History, Ancient Civilizations, Modern History",
    icon: "📜"
  },
  {
    name: "Literature",
    description: "Classic Literature, Poetry, Modern Fiction",
    icon: "📚"
  },
  {
    name: "Computer Science",
    description: "Programming, Algorithms, Data Structures",
    icon: "💻"
  },
  {
    name: "Economics",
    description: "Microeconomics, Macroeconomics, International Economics",
    icon: "📊"
  },
  {
    name: "Languages",
    description: "English, Spanish, French, German, Mandarin",
    icon: "🌎"
  }
];

const AcademicsPage = () => {
  return (
    <div className="container-custom py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Academics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">Academic Subjects</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-3xl">
        Explore a wide range of academic subjects taught by expert tutors. Whether you're struggling with a specific topic or want to advance your knowledge, our platform connects you with the perfect tutor.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {academicSubjects.map((subject) => (
          <div key={subject.name} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">{subject.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
            <p className="text-gray-600 mb-4">{subject.description}</p>
            <Link to="/search">
              <Button variant="outline" className="w-full">Find Tutors</Button>
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-4">Academic Tutoring Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="text-blue-600 font-bold text-xl">✓</div>
            <div>
              <h3 className="font-semibold">Personalized Learning</h3>
              <p className="text-gray-600">Learn at your own pace with customized lesson plans</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-blue-600 font-bold text-xl">✓</div>
            <div>
              <h3 className="font-semibold">Expert Tutors</h3>
              <p className="text-gray-600">Learn from experienced teachers and industry professionals</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-blue-600 font-bold text-xl">✓</div>
            <div>
              <h3 className="font-semibold">Flexible Scheduling</h3>
              <p className="text-gray-600">Book sessions at times that work for your schedule</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-blue-600 font-bold text-xl">✓</div>
            <div>
              <h3 className="font-semibold">Improved Grades</h3>
              <p className="text-gray-600">See measurable improvements in your academic performance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Boost Your Academic Performance?</h2>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Join thousands of students who have improved their grades and confidence through our platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
          </Link>
          <Link to="/search">
            <Button size="lg" variant="outline">Browse Tutors</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AcademicsPage;
