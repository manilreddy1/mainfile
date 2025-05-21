import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const About = () => {
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
            <BreadcrumbPage>About Us</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">About CoLearnerr Pvt. Ltd.</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl font-semibold text-blue-600 mb-6">Empowering Peer-to-Peer Learning</p>
          
          <p className="text-sm text-gray-500 mb-8">Effective Date: April 13, 2025</p>
          
          <p className="mb-6">
            CoLearnerr Pvt. Ltd. is a peer-to-peer learning platform crafted for students and recent graduates. We connect 
            users through live 1-on-1 sessions, offering barter-based skill exchanges or paid collaborations. Our mission is 
            to empower everyone to learn new skills and teach their expertise, fostering a community of growth and 
            collaboration.
          </p>

          <p className="mb-6">
            Based in India with a global outlook, we prioritize security, accessibility, and a student-focused experience. Our 
            platform stands out with flexible learning options, a distraction-free dashboard, and robust privacy protections. 
            We envision CoLearnerr as the go-to hub where young learners and mentors shape their futures through shared 
            knowledge.
          </p>

          <p className="mb-6">
            Join us to learn, teach, and grow. Contact us at support@colearnerr.in or visit our headquarters in Hyderabad, 
            Telangana, India.
          </p>

          <p className="text-xl font-semibold text-blue-600 mt-8">
            CoLearnerr Pvt. Ltd. — Knowledge Shared, Futures Built.
          </p>

          <p className="text-sm text-gray-500 mt-8">
            © 2025 CoLearnerr Pvt. Ltd.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About; 